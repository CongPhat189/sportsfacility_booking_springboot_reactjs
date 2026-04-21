# Hướng dẫn Deploy — Sports Facility Booking

## Kiến trúc

```
GitHub (nhánh main)
    ├── push → Render tự động build & deploy (Backend + Docker)
    └── push → Vercel tự động build & deploy (Frontend)

Railway MySQL  ←──  Render Backend  ←──  Vercel Frontend  ←──  User
```

---

## BƯỚC 0 — Revoke credentials đã lộ (làm NGAY trước khi làm gì khác)

Các secrets sau đang bị commit trong repo công khai. Cần thu hồi và tạo lại:

| Secret | Cách thu hồi |
|--------|-------------|
| JWT Secret | Tạo mới bằng lệnh: `openssl rand -base64 32` |
| Gmail App Password | Gmail → Security → 2-Step Verification → App Passwords → revoke `gtzgsmjcdzanimek` → tạo mới |
| Gemini API Key | Google AI Studio → revoke key cũ → tạo key mới |
| Cloudinary API Secret | Cloudinary Dashboard → Settings → Access Keys → revoke → tạo mới |

> Lưu lại các giá trị mới để điền vào env vars ở các bước sau.

---

## BƯỚC 1 — Sửa code (6 file)

### 1.1 `sportsfacility_backend/src/main/resources/application.yaml`

Thay toàn bộ nội dung:

```yaml
spring:
  application:
    name: sportsfacility_backend

  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        "[format_sql]": false
    open-in-view: false

  mail:
    host: smtp.gmail.com
    port: 587
    username: ${SPRING_MAIL_USERNAME}
    password: ${SPRING_MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
          ssl:
            protocols: TLSv1.2
            trust: smtp.gmail.com

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

server:
  port: 8080

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000

cloudinary:
  cloud-name: ${CLOUDINARY_CLOUD_NAME}
  api-key: ${CLOUDINARY_API_KEY}
  api-secret: ${CLOUDINARY_API_SECRET}

vnpay:
  tmn-code: ${VNPAY_TMN_CODE}
  hash-secret: ${VNPAY_HASH_SECRET}
  url: ${VNPAY_URL}
  return-url: ${VNPAY_RETURN_URL}

gemini:
  api:
    key: ${GEMINI_API_KEY}
    url: https://generativelanguage.googleapis.com/v1
    model: gemini-2.5-flash

app:
  frontend-url: ${FRONTEND_URL}
```

### 1.2 `SecurityConfig.java` — dòng 86

Thêm `@Value` và sửa `corsConfigurationSource()`:

```java
// Thêm vào đầu class (sau các field hiện có)
@Value("${app.frontend-url}")
private String frontendUrl;

// Sửa trong corsConfigurationSource():
config.setAllowedOriginPatterns(List.of(
    "http://localhost:5173",
    frontendUrl,
    "https://*-*.vercel.app"
));
// Xóa dòng cũ: config.setAllowedOrigins(List.of("http://localhost:5173"));
```

Thêm import: `import org.springframework.beans.factory.annotation.Value;`

### 1.3 `PaymentController.java` — dòng 39–41

```java
// Thêm vào đầu class
@Value("${app.frontend-url}")
private String frontendUrl;

// Sửa trong handleCallback():
String redirectUrl = success
    ? frontendUrl + "/payment/success"
    : frontendUrl + "/payment/failed";
// Xóa 2 dòng hardcode localhost cũ
```

Thêm import: `import org.springframework.beans.factory.annotation.Value;`

### 1.4 `EmailService.java` — dòng 62

```java
// Thêm vào đầu class (inject qua constructor hoặc @Value)
@Value("${app.frontend-url}")
private String frontendUrl;

// Sửa trong sendApproveCourtEmail():
context.setVariable("link", frontendUrl + "/owner/courts");
// Xóa dòng hardcode localhost cũ
```

### 1.5 `sportsfacility_fe/src/config/APIs.jsx`

```js
// Sửa dòng BASE_URL:
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/'
```

### 1.6 `sportsfacility_fe/src/pages/AdminCourtManagement.jsx` — dòng 91

```jsx
// Tìm đoạn xử lý image URL, sửa thành:
return url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL || 'http://localhost:8080/'}${url}`;
```

---

## BƯỚC 2 — Tạo Dockerfile cho Backend

Tạo file `sportsfacility_backend/Dockerfile`:

```dockerfile
FROM eclipse-temurin:25-jdk AS builder
WORKDIR /app
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B
COPY src src
RUN ./mvnw package -DskipTests -B

FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## BƯỚC 3 — Tạo file .env.example cho Frontend

Tạo file `sportsfacility_fe/.env.example`:

```bash
# Copy file này thành .env.local để dev local
# KHÔNG commit file .env vào git

VITE_API_URL=http://localhost:8080/
```

Kiểm tra `.gitignore` đã có các dòng sau chưa (thêm nếu thiếu):
```
.env
.env.local
.env.production
```

---

## BƯỚC 4 — Kiểm tra build local

```bash
# Backend
cd sportsfacility_backend
./mvnw package -DskipTests
# Phải thấy BUILD SUCCESS

# Frontend
cd ../sportsfacility_fe
npm run build
# Phải thấy dist/ được tạo ra
```

> Nếu build lỗi thì fix trước khi push lên GitHub.

---

## BƯỚC 5 — Push code lên GitHub

```bash
git add .
git commit -m "chore: setup deploy config for Render + Vercel"
git push origin main
```

---

## BƯỚC 6 — Setup Railway MySQL

1. Vào [railway.app](https://railway.app) → đăng ký / đăng nhập
2. **New Project** → **Add Service** → **Database** → **MySQL**
3. Sau khi tạo xong, vào tab **Connect** → chọn **Public Network**
4. Lấy các thông tin:
   - Host, Port, Database name, Username, Password
5. Dùng MySQL client (DBeaver, TablePlus, MySQL Workbench) kết nối và chạy file `schema.sql`
6. Connection string cho Render:
   ```
   jdbc:mysql://<host>:<port>/<database>?useSSL=true&serverTimezone=Asia/Ho_Chi_Minh&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
   ```

---

## BƯỚC 7 — Deploy Backend lên Render

1. Vào [render.com](https://render.com) → đăng ký / đăng nhập
2. **New** → **Web Service**
3. Connect GitHub → chọn repo `sportsfacility_booking_springboot_reactjs`
4. Cấu hình:
   - **Name**: `sportsfacility-backend` (hoặc tùy)
   - **Root Directory**: `sportsfacility_backend`
   - **Runtime**: Docker (Render tự detect Dockerfile)
   - **Region**: Singapore
   - **Plan**: Free
5. Vào tab **Environment** → thêm 15 env vars:

| Tên biến | Giá trị |
|----------|---------|
| `SPRING_DATASOURCE_URL` | Connection string Railway (bước 6) |
| `SPRING_DATASOURCE_USERNAME` | Username Railway |
| `SPRING_DATASOURCE_PASSWORD` | Password Railway |
| `SPRING_MAIL_USERNAME` | Gmail account |
| `SPRING_MAIL_PASSWORD` | Gmail App Password MỚI (bước 0) |
| `JWT_SECRET` | Secret mới (bước 0) |
| `CLOUDINARY_CLOUD_NAME` | `dwd4b8lcx` |
| `CLOUDINARY_API_KEY` | `271116451416351` |
| `CLOUDINARY_API_SECRET` | Secret MỚI (bước 0) |
| `VNPAY_TMN_CODE` | `63NUWGNE` |
| `VNPAY_HASH_SECRET` | `C3NBM8MWADUJ1HDMU1KZ67YICMAD9BSJ` |
| `VNPAY_URL` | `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` |
| `VNPAY_RETURN_URL` | Điền sau khi có domain Render (bước 9) |
| `FRONTEND_URL` | Điền sau khi có domain Vercel (bước 8) |
| `GEMINI_API_KEY` | Key MỚI (bước 0) |

6. Click **Create Web Service** → chờ build (~5–10 phút lần đầu)
7. Lấy domain dạng: `https://sportsfacility-backend-xxxx.onrender.com`

---

## BƯỚC 8 — Deploy Frontend lên Vercel

1. Vào [vercel.com](https://vercel.com) → đăng ký / đăng nhập
2. **Add New Project** → Import GitHub repo
3. Cấu hình:
   - **Root Directory**: `sportsfacility_fe`
   - **Framework Preset**: Vite (tự detect)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Thêm env var:
   - `VITE_API_URL` = `https://sportsfacility-backend-xxxx.onrender.com/` (URL Render bước 7, **có dấu `/` ở cuối**)
5. Click **Deploy** → chờ ~2 phút
6. Lấy domain dạng: `https://sportsfacility-xxxx.vercel.app`

---

## BƯỚC 9 — Update URLs sau khi có domain thật

### Trên Render dashboard:
- `FRONTEND_URL` = `https://sportsfacility-xxxx.vercel.app` (không có `/` cuối)
- `VNPAY_RETURN_URL` = `https://sportsfacility-backend-xxxx.onrender.com/payments/vnpay/callback`

Sau khi sửa env vars, Render tự động redeploy.

### Trên Vercel dashboard (nếu cần):
- `VITE_API_URL` = URL Render chính xác

---

## BƯỚC 10 — Cấu hình VNPay Sandbox

1. Vào [sandbox.vnpay.vn](https://sandbox.vnpay.vn) → đăng nhập merchant account
2. Vào **Cấu hình** → **Return URL**
3. Thêm: `https://sportsfacility-backend-xxxx.onrender.com/payments/vnpay/callback`
4. Lưu lại

---

## BƯỚC 11 — Test end-to-end

Kiểm tra theo thứ tự:

- [ ] Mở Vercel URL → trang chủ hiển thị bình thường
- [ ] Đăng ký tài khoản mới → nhận email xác nhận
- [ ] Đăng nhập → vào được trang profile
- [ ] Tìm kiếm sân → danh sách sân hiện với ảnh từ Cloudinary
- [ ] Đặt sân → thanh toán VNPay sandbox (dùng thẻ test VNPay)
- [ ] Redirect về `/payment/success` trên Vercel domain
- [ ] Owner đăng nhập → thấy booking mới

---

## BƯỚC 12 (Optional) — Giữ Render không bị sleep

Render free tier sẽ sleep sau 15 phút không có request. Dùng UptimeRobot để giữ thức:

1. Vào [uptimerobot.com](https://uptimerobot.com) → đăng ký miễn phí
2. **Add New Monitor** → HTTP(s)
3. URL: `https://sportsfacility-backend-xxxx.onrender.com/courts/search`
4. Interval: **14 minutes**
5. Bật monitor

---

## Auto-deploy từ lần sau

Mỗi khi nhóm merge code vào `main`:
- Render tự động detect push → build Docker image → deploy backend mới
- Vercel tự động detect push → build React → deploy frontend mới
- Không cần làm thêm gì

Xem log build:
- Render: Dashboard → Web Service → **Logs** / **Events**
- Vercel: Dashboard → Project → **Deployments**

---

## Lưu ý cho cả nhóm

> **Không commit file `.env` hay credentials lên GitHub.**
> **Chỉ merge vào `main` khi tính năng đã test xong trên máy local.**
> **Sau mỗi lần merge vào `main`, kiểm tra Render/Vercel dashboard xem build có pass không.**
