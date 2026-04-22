# Hệ Thống Đặt Sân Thể Thao (Sports Facility Booking)

Bài Tập Lớn Môn Phát Triển Hệ Thống Web — Đề tài số 2

## Thành viên nhóm

| MSSV | Họ tên | Vai trò |
|------|--------|---------|
| 2251012142 | Đoàn Tiên Trung | Fullstack — Phân hệ Khách hàng (Customer) |
| 2251012036 | Võ Tiến Đạt | Fullstack — Phân hệ Chủ sân (Owner) |
| 2251012108 | Trần Công Phát | Fullstack — Phân hệ Quản trị (Admin) |

**Giảng viên hướng dẫn:** ThS. Võ Việt Khoa

## Mô tả

Platform cho phép khách hàng tìm sân thể thao theo vị trí/loại, xem lịch trống, đặt sân và thanh toán đặt cọc online. Chủ sân quản lý thông tin sân, cấu hình khung giờ/giá, xác nhận đặt và check-in khách. Admin duyệt sân mới, quản lý hệ thống và xem báo cáo.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Backend | Spring Boot 3.x (Java 17) |
| Database | MySQL |
| Frontend | ReactJS 19 + Vite + Tailwind CSS |
| Authentication | Spring Security + JWT |
| Thanh toán | VNPay |
| Upload ảnh | Cloudinary |
| Email | JavaMail (Gmail SMTP) |
| AI | Google Gemini API |
| OAuth2 | Google OAuth2 |

## Tính năng chính

### Khách hàng (Customer)
- Tìm kiếm sân theo vị trí và loại sân
- Xem lịch trống và đặt sân online
- Thanh toán đặt cọc qua VNPay
- Xem lịch sử đặt sân
- Hủy đặt sân (kèm thông tin hoàn tiền)
- Đánh giá sân sau khi sử dụng

### Chủ sân (Owner)
- Quản lý thông tin sân (CRUD + upload ảnh)
- Cấu hình khung giờ và giá theo từng ngày trong tuần
- Xem và quản lý danh sách đặt sân
- Xác nhận / từ chối đặt sân
- Check-in khách đến sân
- Xem báo cáo doanh thu

### Admin
- Duyệt sân mới đăng ký (approve / reject)
- Quản lý danh mục loại sân (CRUD)
- Quản lý người dùng (khóa / mở khóa tài khoản)
- Cấu hình tỉ lệ hoa hồng (commission)
- Xem báo cáo toàn hệ thống (biểu đồ booking, doanh thu)

## Cài đặt và chạy

### Yêu cầu

- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

### Cấu hình biến môi trường

Tạo file `.env` ở thư mục `sportsfacility_backend/` với nội dung:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/sportsfacility
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password

JWT_SECRET=your_jwt_secret

SPRING_MAIL_USERNAME=your_email@gmail.com
SPRING_MAIL_PASSWORD=your_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/success

GEMINI_API_KEY=your_gemini_key

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8080
```

### Khởi tạo Database

```bash
mysql -u root -p < schema.sql
```

### Chạy Backend

```bash
cd sportsfacility_backend
./mvnw spring-boot:run
```

Backend chạy tại: `http://localhost:8080`

### Chạy Frontend

```bash
cd sportsfacility_fe
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

## Cấu trúc project

```
sportsfacility_booking_springboot_reactjs/
├── sportsfacility_backend/       # Spring Boot backend
│   └── src/main/java/.../
│       ├── config/               # SecurityConfig, WebConfig, Cloudinary
│       ├── controller/           # REST API controllers
│       ├── service/              # Business logic
│       ├── repository/           # JPA repositories
│       ├── entity/               # JPA entities + enums
│       ├── dto/                  # Request/Response DTOs
│       └── security/             # JWT Filter, UserDetails
├── sportsfacility_fe/            # ReactJS frontend
│   └── src/
│       ├── pages/                # Các trang theo role
│       ├── components/           # Navbar, Footer, Layout
│       ├── context/              # AuthProvider (React Context)
│       └── config/               # API endpoints, axios instance
├── docs/                         # Tài liệu dự án
├── weekly-reports/               # Báo cáo tiến độ hàng tuần
├── schema.sql                    # Database schema
└── README.md
```

## Demo

[Link video demo]

## Tài liệu

- [Phân tích yêu cầu](docs/requirements.md)
- [Thiết kế Database](docs/database-design.md)
- [API Documentation](docs/api-docs.md)
