# Plan: Thêm 2 tính năng mới cho Customer (F1–F6)

## Tổng quan

| # | Tính năng | Phạm vi |
|---|-----------|---------|
| 1 | **Icon bản đồ** — click mở Google Maps theo địa chỉ sân | CourtSearchPage + CourtDetailPage |
| 2 | **Sân hot** — sắp xếp / gợi ý sân theo rating | HomePage + CourtSearchPage |

---

## Feature 1: Icon bản đồ

> Address lưu dạng text thuần → dùng Google Maps Search URL, không cần thay đổi backend.

**URL format:**
```
https://www.google.com/maps/search/?api=1&query=<address_encoded>
```

### Các file cần sửa (Frontend only)

#### `sportsfacility_fe/src/pages/CourtSearchPage.jsx`
- Thêm import `Map` từ `lucide-react`
- Trong phần hiển thị address của mỗi card court, thêm icon map bên cạnh:

```jsx
<a
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.address)}`}
  target="_blank"
  rel="noopener noreferrer"
  onClick={(e) => e.stopPropagation()}   // tránh navigate vào CourtDetail khi click
  className="ml-2 text-green-600 hover:text-green-800"
  title="Xem trên Google Maps"
>
  <Map size={16} />
</a>
```

#### `sportsfacility_fe/src/pages/CourtDetailPage.jsx`
- Thêm import `Map` từ `lucide-react`
- Thêm link bên dưới dòng hiển thị địa chỉ:

```jsx
<a
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.address)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-1 text-sm text-green-600 hover:underline mt-1"
>
  <Map size={14} /> Xem trên Google Maps
</a>
```

---

## Feature 2: Sân hot theo rating

> CourtResponseDTO hiện **không có** averageRating → cần thêm vào backend trước.

### Backend — thứ tự sửa

#### 1. `ReviewRepository.java`
Thêm 2 JPQL query để tính avg rating và đếm review theo court:

```java
@Query("SELECT AVG(r.rating) FROM Review r WHERE r.court.id = :courtId")
Double getAverageRatingByCourtId(@Param("courtId") Long courtId);

@Query("SELECT COUNT(r) FROM Review r WHERE r.court.id = :courtId")
Long countByCourtId(@Param("courtId") Long courtId);
```

#### 2. `CourtResponseDTO.java`
Thêm 2 field mới và constructor overload:

```java
private Double averageRating;
private Long reviewCount;

// Constructor mới (gọi constructor cũ, rồi set thêm 2 field)
public CourtResponseDTO(Court court, Double averageRating, Long reviewCount) {
    this(court);
    this.averageRating = averageRating != null
        ? Math.round(averageRating * 10.0) / 10.0
        : null;
    this.reviewCount = reviewCount != null ? reviewCount : 0L;
}
```

#### 3. `CourtRepository.java`
Thêm method Spring Data JPA:

```java
List<Court> findByStatus(CourtStatus status);
```

#### 4. `CourtService.java`
- Inject `ReviewRepository`
- Thêm helper `toDTO()` tính rating
- Cập nhật `searchCourts()` nhận thêm `sortBy`
- Thêm `getTopRatedCourts()`

```java
@Autowired
private ReviewRepository reviewRepository;

private CourtResponseDTO toDTO(Court court) {
    Double avg = reviewRepository.getAverageRatingByCourtId(court.getId());
    Long count = reviewRepository.countByCourtId(court.getId());
    return new CourtResponseDTO(court, avg, count);
}

public List<CourtResponseDTO> searchCourts(String keyword, Integer categoryId, String sortBy) {
    List<CourtResponseDTO> dtos = courtRepository
        .search(keyword, categoryId, CourtStatus.ACTIVE)
        .stream().map(this::toDTO).collect(Collectors.toList());

    if ("rating".equals(sortBy)) {
        dtos.sort(Comparator.comparingDouble(
            dto -> -(dto.getAverageRating() != null ? dto.getAverageRating() : 0.0)
        ));
    }
    return dtos;
}

public List<CourtResponseDTO> getTopRatedCourts(int limit) {
    return courtRepository.findByStatus(CourtStatus.ACTIVE)
        .stream().map(this::toDTO)
        .sorted(Comparator.comparingDouble(
            dto -> -(dto.getAverageRating() != null ? dto.getAverageRating() : 0.0)
        ))
        .limit(limit)
        .collect(Collectors.toList());
}
```

#### 5. `CourtController.java`
- Thêm param `sortBy` vào `/search`
- Thêm endpoint `/courts/top-rated`

```java
@GetMapping("/search")
public ResponseEntity<List<CourtResponseDTO>> search(
    @RequestParam(required = false) String keyword,
    @RequestParam(required = false) Integer categoryId,
    @RequestParam(required = false) String sortBy) {
    return ResponseEntity.ok(courtService.searchCourts(keyword, categoryId, sortBy));
}

@GetMapping("/top-rated")
public ResponseEntity<List<CourtResponseDTO>> getTopRated(
    @RequestParam(defaultValue = "3") int limit) {
    return ResponseEntity.ok(courtService.getTopRatedCourts(limit));
}
```

---

### Frontend — thứ tự sửa

#### `CourtSearchPage.jsx`
1. Thêm state: `const [sortBy, setSortBy] = useState('')`
2. Truyền `sortBy` vào API call:
   ```js
   GET /courts/search?keyword=...&categoryId=...&sortBy=rating
   ```
3. Thêm 2 nút sort (đặt cạnh bộ lọc category):
   ```jsx
   <button onClick={() => setSortBy('')}
     className={sortBy === '' ? 'bg-green-600 text-white ...' : '...'}>
     Mặc định
   </button>
   <button onClick={() => setSortBy('rating')}
     className={sortBy === 'rating' ? 'bg-green-600 text-white ...' : '...'}>
     🔥 Sân hot
   </button>
   ```
4. Hiển thị badge rating trên card:
   ```jsx
   {court.averageRating && (
     <span className="text-yellow-500 text-sm font-semibold">
       ⭐ {court.averageRating}
     </span>
   )}
   ```
5. Thêm icon map cạnh địa chỉ (xem Feature 1)

#### `HomePage.jsx`
1. Fetch thêm API: `GET /courts/top-rated?limit=3`
2. Thêm state: `const [topRatedCourts, setTopRatedCourts] = useState([])`
3. Thêm section sau phần "Sân nổi bật":
   ```jsx
   <section>
     <h2>🔥 Sân Hot — Được đánh giá cao nhất</h2>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {topRatedCourts.map(court => (
         <div key={court.id} onClick={() => navigate(`/courts/${court.id}`)}>
           <img src={court.imageUrl} />
           <div>{court.name}</div>
           <div>⭐ {court.averageRating} ({court.reviewCount} đánh giá)</div>
           <div>📍 {court.address}</div>
         </div>
       ))}
     </div>
   </section>
   ```

---

## Thứ tự thực hiện

```
Backend
  1. ReviewRepository.java      — thêm 2 query
  2. CourtResponseDTO.java      — thêm field + constructor
  3. CourtRepository.java       — thêm findByStatus
  4. CourtService.java          — toDTO, searchCourts, getTopRatedCourts
  5. CourtController.java       — sortBy param + /top-rated endpoint

Frontend
  6. CourtSearchPage.jsx        — icon map + sort button + rating badge
  7. CourtDetailPage.jsx        — link Google Maps
  8. HomePage.jsx               — section Sân Hot
```

---

## Kiểm tra

| Test case | Kết quả mong đợi |
|-----------|-----------------|
| CourtSearchPage → click icon map trên card | Mở tab mới Google Maps đúng địa chỉ |
| CourtDetailPage → click "Xem trên Google Maps" | Mở tab mới đúng vị trí |
| CourtSearchPage → click "Sân hot" | Danh sách sort theo rating giảm dần, badge ⭐ hiển thị |
| CourtSearchPage → click "Mặc định" | Trở về thứ tự mặc định |
| HomePage → section Sân Hot | Hiển thị 3 sân rating cao nhất |
| Sân chưa có review | averageRating = null → không hiển thị badge, xếp cuối khi sort |
