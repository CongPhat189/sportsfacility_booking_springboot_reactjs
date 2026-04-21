# Performance Optimization Plan — SportArena

## Nguyên tắc

> **Đo trước, đừng đoán.** Tối ưu sai chỗ không cải thiện gì mà còn tốn công.

Thứ tự ưu tiên:
1. Database (tác động lớn nhất)
2. Caching
3. Concurrency / Connection pool
4. Frontend
5. Infrastructure (khi đã hết room code)

---

## Bước 1 — Đo lường (Profiling)

Bật tạm trong `application.yaml` khi dev/staging:
```yaml
jpa:
  show-sql: true
  properties:
    hibernate:
      generate_statistics: true
```

Công việc:
- Đếm số SQL query cho từng API endpoint
- Dùng `EXPLAIN ANALYZE` trên Railway MySQL Workbench để xem query plan
- Mở DevTools → Network tab → đo latency từng API call từ frontend

---

## Bước 2 — Database

### 2.1 Fix N+1 Query

#### N+1 #1: `CourtService.toDTO()` — NGHIÊM TRỌNG
**File:** `sportsfacility_backend/src/main/java/com/example/sportsfacility_backend/service/CourtService.java`

**Vấn đề:** Mỗi Court trong kết quả gọi thêm 2 query riêng lẻ:
- `reviewRepository.getAverageRatingByCourtId(court.getId())`
- `reviewRepository.countByCourtId(court.getId())`

→ 10 sân = **21 queries**. Ảnh hưởng `searchCourts()` và `getTopRatedCourts()`.

**Fix — tạo batch query:**
```java
// ReviewRepository.java — thêm interface projection:
public interface ReviewStatsProjection {
    Long getCourtId();
    Double getAvg();
    Long getCnt();
}

// ReviewRepository.java — thêm query:
@Query("SELECT r.court.id as courtId, AVG(r.rating) as avg, COUNT(r) as cnt " +
       "FROM Review r WHERE r.court.id IN :courtIds GROUP BY r.court.id")
List<ReviewStatsProjection> getStatsByCourtIds(@Param("courtIds") List<Long> courtIds);
```

```java
// CourtService.java — thay vì gọi 2 query per court:
List<Court> courts = courtRepository.search(...);
List<Long> ids = courts.stream().map(Court::getId).toList();
Map<Long, ReviewStatsProjection> statsMap = reviewRepository
    .getStatsByCourtIds(ids).stream()
    .collect(Collectors.toMap(ReviewStatsProjection::getCourtId, s -> s));

// Trong toDTO():
ReviewStatsProjection stats = statsMap.get(court.getId());
Double avg = stats != null ? stats.getAvg() : null;
Long cnt = stats != null ? stats.getCnt() : 0L;
```

**Kết quả:** 21 queries → **3 queries**.

---

#### N+1 #2: `BookingService.getAvailableSlots()` — NGHIÊM TRỌNG
**File:** `sportsfacility_backend/src/main/java/com/example/sportsfacility_backend/service/BookingService.java`

**Vấn đề:** Mỗi slot gọi `findBookingsInSlot()` trong loop → N slots = **N+1 queries**.

**Fix — 1 query lấy toàn bộ, group theo scheduleId:**
```java
// BookingRepository.java — thêm:
@Query("SELECT b FROM Booking b " +
       "WHERE b.court.id = :courtId AND b.bookingDate = :date " +
       "AND b.status NOT IN ('CANCELLED', 'REJECTED')")
List<Booking> findAllBookingsForDate(@Param("courtId") Long courtId,
                                     @Param("date") LocalDate date);
```

```java
// BookingService.java — trong getAvailableSlots():
List<Booking> allBookings = bookingRepository.findAllBookingsForDate(courtId, date);
Map<Long, List<Booking>> bySchedule = allBookings.stream()
    .collect(Collectors.groupingBy(b -> b.getSchedule().getId()));

// Trong loop slots — dùng bySchedule.getOrDefault(slot.getId(), List.of())
```

**Kết quả:** N+1 queries → **2 queries**.

---

#### N+1 #3: `ReviewRepository` thiếu JOIN FETCH
**File:** `sportsfacility_backend/src/main/java/com/example/sportsfacility_backend/repository/ReviewRepository.java`

**Vấn đề:** `findByCourtIdOrderByCreatedAtDesc` không có JOIN FETCH → mỗi Review access `.customer` trigger thêm 1 query.

**Fix:**
```java
@Query("SELECT r FROM Review r JOIN FETCH r.customer " +
       "WHERE r.court.id = :courtId ORDER BY r.createdAt DESC")
List<Review> findByCourtIdWithCustomer(@Param("courtId") Long courtId);
```

Cập nhật `ReviewService.getReviewsByCourtId()` dùng method mới.

---

### 2.2 Thêm Index

Kiểm tra bằng `EXPLAIN ANALYZE` trước, thêm index nếu thấy `Full Table Scan`:

```sql
-- Chạy trên Railway MySQL Workbench:
CREATE INDEX idx_bookings_date    ON bookings(booking_date);
CREATE INDEX idx_bookings_court   ON bookings(court_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_reviews_court    ON reviews(court_id);
CREATE INDEX idx_courts_status    ON courts(status);
CREATE INDEX idx_courts_owner     ON courts(owner_id);
```

---

### 2.3 Optimistic Locking

Tránh race condition khi 2 user đặt cùng slot cùng lúc:

```java
// CourtSchedule.java — thêm:
@Version
private Long version;
```

Hibernate tự xử lý: nếu 2 request cùng update 1 row, request thứ 2 nhận `OptimisticLockException`.
Bắt exception ở service layer và trả về lỗi "Slot vừa được đặt, vui lòng chọn slot khác".

---

### 2.4 Transaction Isolation Level

Mặc định MySQL dùng `REPEATABLE READ` — phù hợp với project này, **không cần thay đổi**.

---

## Bước 3 — Caching

Dùng Spring Cache in-memory (`ConcurrentMapCacheManager`) — **không cần Redis hay thêm dependency**.

### 3.1 Enable Caching
```java
// SportsfacilityBackendApplication.java
@EnableCaching
@SpringBootApplication
public class SportsfacilityBackendApplication { ... }
```

### 3.2 Cache endpoint ít thay đổi

```java
// CourtService.java
@Cacheable("topRatedCourts")
public List<CourtResponseDTO> getTopRatedCourts() { ... }

// CourtCategoryService.java
@Cacheable("categories")
public List<CourtCategoryResponseDTO> getCategories() { ... }
```

### 3.3 Evict khi data thay đổi

```java
// CourtService.java — approveCourt(), rejectCourt():
@CacheEvict(value = "topRatedCourts", allEntries = true)

// CourtCategoryService.java — createCategory(), updateCategory(), deleteCategory():
@CacheEvict(value = "categories", allEntries = true)
```

### Khi nào nên cache / không nên cache

| Nên cache | Không nên cache |
|-----------|----------------|
| `/courts/categories` | `/courts/{id}/available-slots` (thay đổi liên tục) |
| `/courts/top-rated` | `/bookings/history` (data cá nhân) |
| Dữ liệu đọc nhiều, ít thay đổi | Data cần real-time |

---

## Bước 4 — Concurrency / Connection Pool

### HikariCP

Thêm vào `application.yaml`:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 5      # Railway free ~5 connections đồng thời
      minimum-idle: 2
      connection-timeout: 20000
      idle-timeout: 300000
      max-lifetime: 1800000
```

### Hibernate Batch Processing

```yaml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
```

---

## Bước 5 — Frontend

### 5.1 Parallel API Calls

Thay sequential `await` bằng `Promise.all()` — các API độc lập nên gọi song song:

```javascript
// Trước (sequential — chậm):
const categories = await getCategories();
const topRated = await getTopRatedCourts();

// Sau (parallel — nhanh hơn ~50%):
const [categories, topRated] = await Promise.all([
    getCategories(),
    getTopRatedCourts()
]);
```

Áp dụng cho:
| File | API calls cần parallel hóa |
|------|---------------------------|
| `HomePage.jsx` | `getCategories()` + `getTopRatedCourts()` |
| `CourtSearchPage.jsx` | `getCategories()` + `searchCourts()` |
| `OwnerCourtPage.jsx` | `getCourts()` + `getCategories()` |
| `OwnerSchedulePage.jsx` | `getSchedules()` + `getCourts()` |

### 5.2 Lazy Load Routes (Code Splitting)

**File:** `sportsfacility_fe/src/App.jsx`

```jsx
import { lazy, Suspense } from 'react'

// Ưu tiên lazy load trang admin/owner (bundle lớn, ít người dùng):
const AdminCourtManagement = lazy(() => import('./pages/AdminCourtManagement'))
const AdminUserManagement  = lazy(() => import('./pages/AdminUserManagement'))
const OwnerCourtPage       = lazy(() => import('./pages/OwnerCourtPage'))
const OwnerSchedulePage    = lazy(() => import('./pages/OwnerSchedulePage'))

// Wrap Routes:
<Suspense fallback={<div className="flex justify-center p-10">Đang tải...</div>}>
  <Routes>
    ...
  </Routes>
</Suspense>
```

---

## Thứ tự thực hiện

- [ ] 1. Bật `show-sql: true` → quan sát log, xác định bottleneck
- [ ] 2. Fix N+1 `CourtService.toDTO()` → verify log giảm từ 21 → 3 queries
- [ ] 3. Fix N+1 `BookingService.getAvailableSlots()` → verify log
- [ ] 4. Fix `ReviewRepository` JOIN FETCH
- [ ] 5. Thêm Index trên Railway
- [ ] 6. Thêm Optimistic Locking cho slot booking
- [ ] 7. Thêm `@EnableCaching` + `@Cacheable`
- [ ] 8. Cấu hình HikariCP + Hibernate batch
- [ ] 9. Tắt `show-sql: true` trước khi deploy
- [ ] 10. Frontend: `Promise.all()` cho 4 trang
- [ ] 11. Frontend: Lazy load routes admin/owner

---

## Verification

| Bước | Cách kiểm tra |
|------|--------------|
| Fix N+1 | `show-sql: true` → đếm query trong log |
| Index | `EXPLAIN ANALYZE SELECT ...` → không còn `Full Table Scan` |
| Caching | Gọi API 2 lần → lần 2 không thấy SQL query trong log |
| Parallel API | DevTools Network → các request bắt đầu cùng lúc |
| Lazy load | `npm run build` → chunk admin/owner tách thành file riêng |
