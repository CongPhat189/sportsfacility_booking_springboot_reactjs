# API Documentation — Hệ Thống Đặt Sân Thể Thao

- **Base URL:** `http://localhost:8080`
- **Authentication:** Bearer JWT Token trong header `Authorization`
- **Content-Type:** `application/json` (trừ endpoint upload ảnh dùng `multipart/form-data`)

---

## Phân quyền

| Prefix | Role yêu cầu |
|--------|-------------|
| `/auth/**` | Public (không cần token) |
| `/courts/**` | Public |
| `/bookings/**` | CUSTOMER (cần token) |
| `/user/**` | Đã đăng nhập (cần token) |
| `/payments/**` | Mixed (create cần token, callback public) |
| `/reviews/**` | CUSTOMER (cần token) |
| `/owner/**` | OWNER (cần token + role OWNER) |
| `/admin/**` | ADMIN (cần token + role ADMIN) |

---

## 1. Authentication (`/auth`)

### POST `/auth/register`
Đăng ký tài khoản mới. Gửi email xác thực sau khi đăng ký thành công.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `fullName` | String | ✓ | Họ và tên |
| `email` | String | ✓ | Email |
| `password` | String | ✓ | Mật khẩu |
| `phone` | String | | Số điện thoại |
| `role` | String | ✓ | CUSTOMER hoặc OWNER |

**Response `200`:**
```json
{ "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực." }
```

---

### POST `/auth/login`
Đăng nhập bằng email/mật khẩu.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "role": "CUSTOMER"
}
```

**Response `200`:**
```json
{
  "id": 1,
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "CUSTOMER",
  "fullName": "Nguyễn Văn A",
  "phone": "0901234567",
  "avatarUrl": "https://res.cloudinary.com/..."
}
```

---

### GET `/auth/verify?token={token}`
Xác thực email qua link nhận được trong email.

---

### POST `/auth/social-login`
Đăng nhập bằng Google OAuth2.

**Request Body:**
```json
{
  "email": "user@gmail.com",
  "fullName": "Nguyễn Văn A",
  "avatarUrl": "https://...",
  "provider": "GOOGLE"
}
```

**Response `200`:** Tương tự `/auth/login`

---

## 2. Courts — Public (`/courts`)

### GET `/courts/search`
Tìm kiếm sân.

| Query Param | Type | Mô tả |
|-------------|------|-------|
| `keyword` | String | Từ khóa tên/địa chỉ |
| `categoryId` | Integer | Lọc theo loại sân |
| `sortBy` | String | `rating` để sắp xếp theo đánh giá |

**Response `200`:** `List<CourtResponseDTO>`

---

### GET `/courts/categories`
Lấy danh sách loại sân đang hoạt động.

**Response `200`:** `List<CourtCategory>`

---

### GET `/courts/{id}`
Xem chi tiết một sân.

**Response `200`:** `CourtResponseDTO`

---

### GET `/courts/{id}/reviews`
Xem tất cả đánh giá của một sân.

**Response `200`:** `List<ReviewResponseDTO>`

---

### GET `/courts/{courtId}/available-slots?date={date}`
Xem các khung giờ còn trống của sân theo ngày.

| Query Param | Type | Mô tả |
|-------------|------|-------|
| `date` | String | Định dạng `YYYY-MM-DD` |

**Response `200`:** `List<ScheduleResponseDTO>`

---

## 3. User Profile (`/user`)

> Yêu cầu: Bearer Token

### GET `/user/profile`
Lấy thông tin người dùng hiện tại.

**Response `200`:** `User`

---

### PUT `/user/profile`
Cập nhật thông tin cá nhân.

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn B",
  "phone": "0909999999"
}
```

---

### PATCH `/user/change-password`
Đổi mật khẩu.

**Request Body:**
```json
{
  "oldPassword": "123456",
  "newPassword": "newpass123"
}
```

---

## 4. Bookings (`/bookings`)

> Yêu cầu: Bearer Token (CUSTOMER)

### POST `/bookings`
Tạo đơn đặt sân mới.

**Request Body:**
```json
{
  "courtId": 1,
  "scheduleId": 3,
  "bookingDateTime": "2026-05-01T08:00:00"
}
```

**Response `200`:** `BookingResponseDTO`

---

### GET `/bookings/history`
Lấy lịch sử đặt sân của khách hàng đang đăng nhập.

**Response `200`:** `List<BookingResponseDTO>`

---

### POST `/bookings/{id}/cancel`
Hủy đặt sân.

**Request Body:**
```json
{
  "cancelReason": "Bận việc đột xuất",
  "refundBankName": "Vietcombank",
  "refundAccountNumber": "1234567890",
  "refundAccountHolder": "NGUYEN VAN A"
}
```

**Response `200`:** `CancelBookingResponse`

---

## 5. Payments (`/payments`)

### POST `/payments/vnpay/create`
Tạo URL thanh toán VNPay.

> Yêu cầu: Bearer Token

**Request Body:**
```json
{ "bookingId": 5 }
```

**Response `200`:**
```json
{ "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/..." }
```

---

### GET `/payments/vnpay/callback`
Callback từ VNPay sau khi thanh toán. Redirect về frontend.

> Public — VNPay gọi tự động, không cần token.

---

## 6. Reviews (`/reviews`)

> Yêu cầu: Bearer Token (CUSTOMER)

### POST `/reviews`
Gửi đánh giá sau khi booking hoàn thành.

**Request Body:**
```json
{
  "bookingId": 5,
  "rating": 5,
  "comment": "Sân rất tốt, sẽ quay lại!"
}
```

**Response `200`:** `ReviewResponseDTO`

---

### GET `/bookings/{bookingId}/review`
Xem đánh giá của một booking cụ thể.

**Response `200`:** `ReviewResponseDTO` hoặc `204 No Content`

---

## 7. Owner — Courts (`/owner/courts`)

> Yêu cầu: Bearer Token (OWNER)

### GET `/owner/courts`
Lấy danh sách sân của owner hiện tại.

### POST `/owner/courts`
Tạo sân mới.

**Content-Type:** `multipart/form-data`

| Field | Type | Mô tả |
|-------|------|-------|
| `name` | String | Tên sân |
| `address` | String | Địa chỉ |
| `description` | String | Mô tả |
| `categoryId` | Integer | ID loại sân |
| `imageFiles` | File[] | Tối đa 3 ảnh |

### GET `/owner/courts/{id}`
Xem chi tiết sân.

### PUT `/owner/courts/{id}`
Cập nhật thông tin sân. (multipart/form-data)

### PUT `/owner/courts/{id}/deactivate`
Tạm ẩn sân.

### PUT `/owner/courts/{id}/activate`
Kích hoạt lại sân.

---

## 8. Owner — Schedules (`/owner/schedules`)

> Yêu cầu: Bearer Token (OWNER)

### GET `/owner/schedules`
Lấy tất cả khung giờ của owner.

### POST `/owner/schedules`
Tạo khung giờ mới.

**Request Body:**
```json
{
  "courtId": 1,
  "dayOfWeek": 1,
  "startTime": "08:00",
  "endTime": "10:00",
  "price": 150000
}
```

### PUT `/owner/schedules/{id}`
Cập nhật khung giờ.

### DELETE `/owner/schedules/{id}`
Xóa khung giờ.

---

## 9. Owner — Bookings (`/owner/bookings`)

> Yêu cầu: Bearer Token (OWNER)

### GET `/owner/bookings`
Lấy tất cả booking của sân mình.

### GET `/owner/bookings/{id}`
Xem chi tiết một booking.

### PUT `/owner/bookings/{id}/confirm`
Xác nhận đặt sân → `CONFIRMED`.

### PUT `/owner/bookings/{id}/reject`
Từ chối đặt sân → `CANCELLED`.

### PUT `/owner/bookings/{id}/checkin`
Check-in khách → `CHECKED_IN`.

### PUT `/owner/bookings/{id}/complete`
Hoàn thành buổi chơi → `COMPLETED`.

### DELETE `/owner/bookings/{id}`
Xóa booking.

---

## 10. Owner — Revenue (`/owner/revenue`)

> Yêu cầu: Bearer Token (OWNER)

### GET `/owner/revenue?year={year}&month={month}`
Xem báo cáo doanh thu.

| Query Param | Type | Required | Mô tả |
|-------------|------|----------|-------|
| `year` | Integer | ✓ | Năm |
| `month` | Integer | | Tháng (bỏ trống để xem cả năm) |

**Response `200`:** `RevenueResponseDTO`

---

## 11. Admin — Courts (`/admin/courts`)

> Yêu cầu: Bearer Token (ADMIN)

### GET `/admin/courts/pending`
Danh sách sân chờ duyệt.

### GET `/admin/courts/active`
Danh sách sân đã duyệt.

### GET `/admin/courts/{id}`
Chi tiết một sân.

### PUT `/admin/courts/{id}/approve`
Duyệt sân → `ACTIVE`.

### PUT `/admin/courts/{id}/reject`
Từ chối sân.

**Request Body:**
```json
{ "rejectReason": "Thông tin không đầy đủ" }
```

### PUT `/admin/courts/{id}/commission`
Cập nhật tỉ lệ hoa hồng.

**Request Body:**
```json
{ "commissionRate": 15.00 }
```

---

## 12. Admin — Categories (`/admin/categories`)

> Yêu cầu: Bearer Token (ADMIN)

### GET `/admin/categories`
Lấy tất cả danh mục loại sân.

### POST `/admin/categories`
Tạo danh mục mới.

**Request Body:**
```json
{ "name": "Pickleball", "description": "Sân pickleball" }
```

### PUT `/admin/categories/{id}`
Cập nhật danh mục.

### PUT `/admin/categories/{id}/enable`
Kích hoạt danh mục.

### PUT `/admin/categories/{id}/disable`
Ẩn danh mục.

### DELETE `/admin/categories/{id}`
Xóa danh mục.

---

## 13. Admin — Users (`/admin/users`)

> Yêu cầu: Bearer Token (ADMIN)

### GET `/admin/users`
Lấy danh sách tất cả người dùng.

### PUT `/admin/users/{id}/lock`
Khóa tài khoản.

### PUT `/admin/users/{id}/unlock`
Mở khóa tài khoản.

### DELETE `/admin/users/{id}`
Xóa tài khoản.

---

## 14. Admin — Reports (`/admin/reports`)

> Yêu cầu: Bearer Token (ADMIN)

### GET `/admin/reports/booking-pie?month={month}&year={year}`
Báo cáo phân bổ trạng thái booking (biểu đồ tròn).

**Response `200`:** `BookingPieDTO`

---

### GET `/admin/reports/revenue-3months?month={month}&year={year}`
Báo cáo doanh thu 3 tháng gần nhất (biểu đồ cột).

**Response `200`:** `List<RevenueBarDTO>`

---

### POST `/admin/reports/analyze`
Phân tích báo cáo bằng Google Gemini AI.

**Request Body:**
```json
{
  "pending": 10,
  "completed": 50,
  "cancelled": 5,
  "revenue": [...]
}
```

**Response `200`:** String (nội dung phân tích AI)

---

## Tổng kết endpoints

| Nhóm | Số endpoints |
|------|-------------|
| Auth | 4 |
| Courts (public) | 5 |
| User Profile | 3 |
| Bookings | 3 |
| Payments | 2 |
| Reviews | 2 |
| Owner Courts | 6 |
| Owner Schedules | 4 |
| Owner Bookings | 6 |
| Owner Revenue | 1 |
| Admin Courts | 6 |
| Admin Categories | 6 |
| Admin Users | 4 |
| Admin Reports | 3 |
| **Tổng** | **55** |
