# Thiết Kế Database — Hệ Thống Đặt Sân Thể Thao

- **Database:** MySQL 8.x
- **Charset:** utf8mb4 (hỗ trợ tiếng Việt)
- **Số bảng:** 7

---

## 1. ERD (Entity Relationship Diagram)

```
users (1) ─────────────────── (N) courts
  │                                  │
  │                                  │ (1)
  │                                  │
  │                          court_schedules (N)
  │                                  │
  │                                  │ (1)
  │                                  │
  └── (1) ──── bookings (N) ─────────┘
                    │
                    │ (1)
                    │
                payments (N)
                    │
                reviews (1)
```

**Quan hệ chi tiết:**
- `users` 1–N `courts` (một owner có nhiều sân)
- `courts` 1–N `court_schedules` (một sân có nhiều khung giờ)
- `users` 1–N `bookings` (một customer có nhiều booking)
- `courts` 1–N `bookings` (một sân có nhiều booking)
- `court_schedules` 1–N `bookings` (một slot có nhiều booking ở các ngày khác nhau)
- `bookings` 1–1 `payments` (một booking có một payment)
- `bookings` 1–1 `reviews` (một booking có tối đa một review)

---

## 2. Mô tả các bảng

### 2.1 Bảng `users`
Lưu thông tin tất cả người dùng trong hệ thống.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Khóa chính |
| `full_name` | VARCHAR(100) | NOT NULL | Họ và tên |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE | Email đăng nhập |
| `password` | VARCHAR(255) | NOT NULL | Mật khẩu đã mã hóa (bcrypt) |
| `phone` | VARCHAR(15) | NULL | Số điện thoại |
| `avatar_url` | TEXT | NULL | URL ảnh đại diện (Cloudinary) |
| `role` | ENUM | NOT NULL, DEFAULT 'CUSTOMER' | CUSTOMER / OWNER / ADMIN |
| `status` | ENUM | NOT NULL, DEFAULT 'INACTIVE' | ACTIVE / INACTIVE / LOCKED |
| `is_verified` | BOOLEAN | NOT NULL, DEFAULT 0 | Đã xác thực email chưa |
| `verification_token` | VARCHAR(255) | NULL | Token xác thực email |
| `token_expires_at` | TIMESTAMP | NULL | Thời hạn token xác thực |
| `created_at` | DATETIME | NOT NULL | Thời điểm tạo |
| `updated_at` | DATETIME | NOT NULL | Thời điểm cập nhật cuối |

---

### 2.2 Bảng `court_categories`
Danh mục loại sân thể thao.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | Tên loại sân (Bóng đá, Cầu lông, ...) |
| `description` | TEXT | NULL | Mô tả loại sân |
| `is_active` | TINYINT(1) | NOT NULL, DEFAULT 1 | Đang hoạt động hay bị ẩn |

---

### 2.3 Bảng `courts`
Thông tin sân thể thao do Owner đăng ký.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Khóa chính |
| `owner_id` | BIGINT | FK → users.id | Chủ sân |
| `category_id` | INT | FK → court_categories.id | Loại sân |
| `name` | VARCHAR(150) | NOT NULL | Tên sân |
| `address` | TEXT | NOT NULL | Địa chỉ (có FULLTEXT index) |
| `description` | TEXT | NULL | Mô tả sân |
| `image_url` | TEXT | NULL | URL ảnh, nhiều ảnh ngăn cách bằng dấu phẩy |
| `commission_rate` | DECIMAL(5,2) | NOT NULL, DEFAULT 10.00 | Tỉ lệ hoa hồng (%) |
| `status` | ENUM | NOT NULL, DEFAULT 'PENDING' | PENDING / ACTIVE / INACTIVE / REJECTED |
| `reject_reason` | TEXT | NULL | Lý do từ chối (nếu REJECTED) |
| `created_at` | DATETIME | NOT NULL | Thời điểm tạo |
| `updated_at` | DATETIME | NOT NULL | Thời điểm cập nhật cuối |

---

### 2.4 Bảng `court_schedules`
Cấu hình khung giờ và giá cho từng sân theo ngày trong tuần.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Khóa chính |
| `court_id` | BIGINT | FK → courts.id | Sân |
| `day_of_week` | TINYINT | NOT NULL | 0=Chủ nhật, 1=Thứ 2, ..., 6=Thứ 7 |
| `start_time` | TIME | NOT NULL | Giờ bắt đầu |
| `end_time` | TIME | NOT NULL | Giờ kết thúc |
| `price` | DECIMAL(10,2) | NOT NULL | Giá thuê (VNĐ) |
| `is_active` | TINYINT(1) | NOT NULL, DEFAULT 1 | Slot còn hoạt động không |

**Unique index:** `(court_id, day_of_week, start_time)` — không trùng slot.

---

### 2.5 Bảng `bookings`
Thông tin đặt sân của Customer.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Khóa chính |
| `customer_id` | BIGINT | FK → users.id | Khách hàng đặt |
| `court_id` | BIGINT | FK → courts.id | Sân được đặt |
| `schedule_id` | BIGINT | FK → court_schedules.id | Khung giờ được đặt |
| `start_time` | TIME | NOT NULL | Giờ bắt đầu thực tế |
| `end_time` | TIME | NOT NULL | Giờ kết thúc thực tế |
| `booking_date_time` | DATETIME | NOT NULL | Ngày giờ đặt sân |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Tổng tiền thuê sân |
| `deposit_amount` | DECIMAL(10,2) | NOT NULL | Tiền đặt cọc qua VNPay |
| `status` | ENUM | NOT NULL, DEFAULT 'PENDING' | PENDING / CONFIRMED / CANCELLED / CHECKED_IN / EXPIRED / COMPLETED |
| `cancel_reason` | TEXT | NULL | Lý do hủy |
| `note` | TEXT | NULL | Ghi chú của khách |
| `refund_bank_name` | VARCHAR(100) | NULL | Tên ngân hàng hoàn tiền |
| `refund_account_number` | VARCHAR(50) | NULL | Số tài khoản hoàn tiền |
| `refund_account_holder` | VARCHAR(100) | NULL | Tên chủ tài khoản hoàn tiền |
| `created_at` | DATETIME | NOT NULL | Thời điểm tạo |
| `updated_at` | DATETIME | NOT NULL | Thời điểm cập nhật cuối |

**Unique index:** `(court_id, schedule_id, booking_date_time)` — chống trùng lịch.

**Vòng đời trạng thái:**
```
PENDING → CONFIRMED → CHECKED_IN → COMPLETED
       ↘ CANCELLED
       ↘ EXPIRED
```

---

### 2.6 Bảng `payments`
Lịch sử giao dịch thanh toán qua VNPay.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Khóa chính |
| `booking_id` | BIGINT | FK → bookings.id | Booking được thanh toán |
| `vnpay_txn_ref` | VARCHAR(100) | NOT NULL, UNIQUE | Mã giao dịch VNPay |
| `vnpay_order_info` | VARCHAR(255) | NULL | Thông tin đơn hàng |
| `amount` | DECIMAL(10,2) | NOT NULL | Số tiền giao dịch |
| `status` | ENUM | NOT NULL, DEFAULT 'PENDING' | PENDING / SUCCESS / FAILED / REFUNDED |
| `response_code` | VARCHAR(10) | NULL | Mã phản hồi VNPay (00 = thành công) |
| `bank_code` | VARCHAR(20) | NULL | Ngân hàng thanh toán |
| `transaction_no` | VARCHAR(100) | NULL | Mã giao dịch phía ngân hàng |
| `paid_at` | DATETIME | NULL | Thời điểm thanh toán thành công |
| `created_at` | DATETIME | NOT NULL | Thời điểm tạo bản ghi |

---

### 2.7 Bảng `reviews`
Đánh giá sân của Customer sau khi sử dụng.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Khóa chính |
| `booking_id` | BIGINT | FK → bookings.id, UNIQUE | Booking được đánh giá (1 booking = 1 review) |
| `customer_id` | BIGINT | FK → users.id | Người đánh giá |
| `court_id` | BIGINT | FK → courts.id | Sân được đánh giá |
| `rating` | TINYINT | NOT NULL, CHECK (1–5) | Điểm đánh giá (1–5 sao) |
| `comment` | TEXT | NULL | Nhận xét |
| `created_at` | DATETIME | NOT NULL | Thời điểm đánh giá |

---

## 3. Tóm tắt quan hệ Foreign Key

| Foreign Key | Bảng con | Tham chiếu |
|-------------|----------|------------|
| `courts.owner_id` | courts | users.id |
| `courts.category_id` | courts | court_categories.id |
| `court_schedules.court_id` | court_schedules | courts.id |
| `bookings.customer_id` | bookings | users.id |
| `bookings.court_id` | bookings | courts.id |
| `bookings.schedule_id` | bookings | court_schedules.id |
| `payments.booking_id` | payments | bookings.id |
| `reviews.booking_id` | reviews | bookings.id |
| `reviews.customer_id` | reviews | users.id |
| `reviews.court_id` | reviews | courts.id |
