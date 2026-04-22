# Phân Tích Yêu Cầu — Hệ Thống Đặt Sân Thể Thao

## 1. Tổng quan hệ thống

### 1.1 Bối cảnh
Việc đặt sân thể thao (bóng đá, cầu lông, ...) hiện nay phải thực hiện qua điện thoại, không biết sân nào còn trống, thường xuyên bị trùng lịch. Hệ thống được xây dựng nhằm giải quyết các bất cập trên.

### 1.2 Mục tiêu
- Cho phép khách hàng tìm, xem và đặt sân trực tuyến.
- Chủ sân quản lý thông tin, lịch và đơn đặt hiệu quả.
- Admin kiểm soát chất lượng sân và vận hành toàn hệ thống.

### 1.3 Phạm vi
Ứng dụng web gồm 3 phân hệ: **Khách hàng**, **Chủ sân**, **Admin**.

---

## 2. Đối tượng sử dụng

| Role | Mô tả |
|------|-------|
| **CUSTOMER** | Khách hàng — tìm sân, đặt sân, thanh toán, đánh giá |
| **OWNER** | Chủ sân — đăng ký và quản lý sân, cấu hình lịch/giá, xác nhận đặt |
| **ADMIN** | Quản trị viên — duyệt sân, quản lý hệ thống, xem báo cáo |

---

## 3. Yêu cầu chức năng

### 3.1 Phân hệ Khách hàng (Customer)

| # | Tính năng | Mô tả |
|---|-----------|-------|
| C1 | Đăng ký / Đăng nhập | Đăng ký bằng email (xác thực OTP qua email) hoặc Google OAuth2 |
| C2 | Tìm kiếm sân | Tìm theo từ khóa, loại sân, sắp xếp theo đánh giá |
| C3 | Xem chi tiết sân | Xem thông tin, ảnh, lịch trống theo ngày |
| C4 | Đặt sân | Chọn ngày, khung giờ, xác nhận đặt |
| C5 | Thanh toán cọc | Thanh toán đặt cọc qua VNPay |
| C6 | Xem lịch sử đặt sân | Danh sách tất cả booking và trạng thái |
| C7 | Hủy đặt sân | Hủy booking kèm lý do và thông tin hoàn tiền ngân hàng |
| C8 | Đánh giá sân | Gửi đánh giá (rating 1–5 sao + nhận xét) sau khi hoàn thành |
| C9 | Quản lý hồ sơ | Cập nhật thông tin cá nhân, avatar, đổi mật khẩu |

### 3.2 Phân hệ Chủ sân (Owner)

| # | Tính năng | Mô tả |
|---|-----------|-------|
| O1 | Quản lý sân | Tạo / sửa / xóa sân, upload tối đa 3 ảnh qua Cloudinary |
| O2 | Cấu hình khung giờ | Thêm / sửa / xóa slot theo từng ngày trong tuần, có giá riêng |
| O3 | Xem danh sách đặt sân | Xem tất cả booking của sân mình |
| O4 | Xác nhận / từ chối | Chấp nhận hoặc từ chối đơn đặt của khách |
| O5 | Check-in khách | Đánh dấu khách đã đến sân |
| O6 | Hoàn thành booking | Đánh dấu buổi chơi hoàn thành |
| O7 | Báo cáo doanh thu | Xem doanh thu theo tháng/năm |

### 3.3 Phân hệ Quản trị (Admin)

| # | Tính năng | Mô tả |
|---|-----------|-------|
| A1 | Duyệt sân mới | Xem và duyệt / từ chối sân do Owner đăng ký |
| A2 | Quản lý loại sân | CRUD danh mục loại sân (bóng đá, cầu lông, ...) |
| A3 | Quản lý người dùng | Xem danh sách, khóa / mở khóa / xóa tài khoản |
| A4 | Cấu hình commission | Đặt tỉ lệ hoa hồng cho từng sân |
| A5 | Báo cáo booking | Biểu đồ tròn phân bổ trạng thái booking theo tháng |
| A6 | Báo cáo doanh thu | Biểu đồ cột doanh thu 3 tháng gần nhất |
| A7 | Phân tích AI | Gửi dữ liệu cho Gemini AI để nhận nhận xét và đề xuất |

---

## 4. Yêu cầu phi chức năng

| # | Yêu cầu | Chi tiết |
|---|---------|----------|
| NF1 | Bảo mật | JWT stateless, bcrypt password, phân quyền theo role |
| NF2 | Xác thực email | Gửi link xác thực khi đăng ký, token hết hạn sau 24h |
| NF3 | Upload file | Ảnh tối đa 10MB/file, lưu trên Cloudinary |
| NF4 | Thanh toán | Tích hợp VNPay sandbox |
| NF5 | CORS | Cho phép frontend localhost:5173 và domain Vercel |
| NF6 | Responsive | Giao diện tương thích desktop và mobile |

---

## 5. Use Case Diagram (mô tả văn bản)

### UC-01: Đặt sân (Customer)
- **Actor:** Customer
- **Tiền điều kiện:** Đã đăng nhập, sân có trạng thái ACTIVE
- **Luồng chính:**
  1. Customer tìm kiếm sân theo từ khóa / loại sân
  2. Chọn sân, xem chi tiết và lịch trống theo ngày
  3. Chọn khung giờ và xác nhận đặt
  4. Hệ thống tạo booking với trạng thái `PENDING`
  5. Customer thanh toán cọc qua VNPay
  6. Hệ thống cập nhật Payment và chuyển booking sang `CONFIRMED` sau khi Owner xác nhận

### UC-02: Quản lý đơn đặt (Owner)
- **Actor:** Owner
- **Tiền điều kiện:** Sân của Owner có booking mới
- **Luồng chính:**
  1. Owner xem danh sách booking
  2. Xác nhận → booking chuyển sang `CONFIRMED`
  3. Hoặc từ chối → booking chuyển sang `CANCELLED`
  4. Khi khách đến: Owner check-in → `CHECKED_IN`
  5. Kết thúc buổi chơi: Owner complete → `COMPLETED`

### UC-03: Duyệt sân (Admin)
- **Actor:** Admin
- **Tiền điều kiện:** Owner đã tạo sân mới (status `PENDING`)
- **Luồng chính:**
  1. Admin xem danh sách sân chờ duyệt
  2. Xem chi tiết sân
  3. Duyệt → sân chuyển sang `ACTIVE`
  4. Hoặc từ chối kèm lý do → sân chuyển sang `REJECTED`
