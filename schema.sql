-- ============================================================
-- DATABASE SCHEMA: Hệ Thống Đặt Sân Thể Thao
-- Sports Facility Booking Platform
-- Database: MySQL 8.x
-- Charset: utf8mb4 (hỗ trợ tiếng Việt và emoji)
-- Version: v1.0 — 23/02/2026
-- ============================================================

CREATE DATABASE IF NOT EXISTS sportsfacility_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sportsfacility_db;

-- ============================================================
-- TABLE 1: users
-- Lưu thông tin tất cả người dùng (Customer, Owner, Admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id          		BIGINT          NOT NULL AUTO_INCREMENT,
    full_name   		VARCHAR(100)    NOT NULL,
    email       		VARCHAR(150)    NOT NULL,
    password    		VARCHAR(255)    NOT NULL,
    phone       		VARCHAR(15)     NULL DEFAULT NULL,
    avatar_url  		TEXT            NULL DEFAULT NULL,

    role        		ENUM('CUSTOMER','OWNER','ADMIN') 
						NOT NULL DEFAULT 'CUSTOMER',

    status      		ENUM('ACTIVE','INACTIVE','LOCKED') 
						NOT NULL DEFAULT 'INACTIVE',

    -- email verification
    verification_token  VARCHAR(255) NULL,
    token_expires_at    TIMESTAMP NULL,
    is_verified			BOOLEAN   NOT NULL default 0,	

    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP 
                ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE INDEX idx_email (email),
    INDEX idx_role   (role),
    INDEX idx_status (status),
    INDEX idx_verification_token (verification_token)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 2: court_categories
-- Danh mục loại sân thể thao (Bóng đá, Cầu lông, ...)
-- ============================================================
CREATE TABLE IF NOT EXISTS court_categories (
    id          INT             NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50)     NOT NULL,
    description TEXT            NULL DEFAULT NULL,
    is_active   TINYINT(1)      NOT NULL DEFAULT 1,

    PRIMARY KEY (id),
    UNIQUE INDEX idx_name (name)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 3: courts
-- Thông tin chi tiết các sân thể thao do Owner đăng ký
-- ============================================================
CREATE TABLE IF NOT EXISTS courts (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    owner_id        BIGINT          NOT NULL,
    category_id     INT             NOT NULL,
    name            VARCHAR(150)    NOT NULL,
    address         TEXT            NOT NULL,
    description     TEXT            NULL DEFAULT NULL,
    image_url       TEXT            NULL DEFAULT NULL,
    commission_rate DECIMAL(5,2)    NOT NULL DEFAULT 10.00,
    status          ENUM('PENDING','ACTIVE','INACTIVE','REJECTED') NOT NULL DEFAULT 'PENDING',
    reject_reason   TEXT            NULL DEFAULT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX         idx_owner    (owner_id),
    INDEX         idx_category (category_id),
    INDEX         idx_status   (status),
    FULLTEXT INDEX idx_address (address),

    CONSTRAINT fk_courts_owner
        FOREIGN KEY (owner_id)    REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_courts_category
        FOREIGN KEY (category_id) REFERENCES court_categories (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 4: court_schedules
-- Cấu hình khung giờ và giá cho từng sân theo ngày trong tuần
-- ============================================================
CREATE TABLE IF NOT EXISTS court_schedules (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    court_id    BIGINT          NOT NULL,
    day_of_week TINYINT         NOT NULL COMMENT '0=Chủ nhật, 1=Thứ 2, ..., 6=Thứ 7',
    start_time  TIME            NOT NULL,
    end_time    TIME            NOT NULL,
    price       DECIMAL(10,2)   NOT NULL,
    is_active   TINYINT(1)      NOT NULL DEFAULT 1,

    PRIMARY KEY (id),
    INDEX idx_court (court_id),
    UNIQUE INDEX idx_court_day_time (court_id, day_of_week, start_time),

    CONSTRAINT fk_schedules_court
        FOREIGN KEY (court_id) REFERENCES courts (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 5: bookings
-- Lưu trữ thông tin đặt sân của Customer
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    customer_id         BIGINT          NOT NULL,
    court_id            BIGINT          NOT NULL,
    schedule_id             BIGINT          NOT NULL,
    start_time              TIME            NOT NULL,
    end_time                TIME            NOT NULL,
    booking_date_time       DATETIME        NOT NULL,
    total_amount            DECIMAL(10,2)   NOT NULL,
    deposit_amount          DECIMAL(10,2)   NOT NULL,
    status                  ENUM('PENDING','CONFIRMED','CANCELLED','CHECKED_IN','EXPIRED','COMPLETED') NOT NULL DEFAULT 'PENDING',
    cancel_reason           TEXT            NULL DEFAULT NULL,
    note                    TEXT            NULL DEFAULT NULL,
    refund_bank_name        VARCHAR(100)    NULL DEFAULT NULL,
    refund_account_number   VARCHAR(50)     NULL DEFAULT NULL,
    refund_account_holder   VARCHAR(100)    NULL DEFAULT NULL,
    created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX        idx_customer     (customer_id),
    INDEX        idx_court        (court_id),
    INDEX        idx_status       (status),
    INDEX        idx_booking_date (booking_date_time),
    UNIQUE INDEX idx_court_schedule_date (court_id, schedule_id, booking_date_time),

    CONSTRAINT fk_bookings_customer
        FOREIGN KEY (customer_id) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_bookings_court
        FOREIGN KEY (court_id)    REFERENCES courts (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_bookings_schedule
        FOREIGN KEY (schedule_id) REFERENCES court_schedules (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 6: payments
-- Lịch sử giao dịch thanh toán qua VNPay (chỉ READ — VNPay ghi)
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    booking_id          BIGINT          NOT NULL,
    vnpay_txn_ref       VARCHAR(100)    NOT NULL,
    vnpay_order_info    VARCHAR(255)    NULL DEFAULT NULL,
    amount              DECIMAL(10,2)   NOT NULL,
    status              ENUM('PENDING','SUCCESS','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
    response_code       VARCHAR(10)     NULL DEFAULT NULL COMMENT '00 = thành công',
    bank_code           VARCHAR(20)     NULL DEFAULT NULL,
    transaction_no      VARCHAR(100)    NULL DEFAULT NULL,
    paid_at             DATETIME        NULL DEFAULT NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE INDEX idx_txn_ref  (vnpay_txn_ref),
    INDEX        idx_booking  (booking_id),
    INDEX        idx_status   (status),

    CONSTRAINT fk_payments_booking
        FOREIGN KEY (booking_id) REFERENCES bookings (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 7: reviews
-- Đánh giá sân của Customer sau khi sử dụng
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    booking_id  BIGINT      NOT NULL,
    customer_id BIGINT      NOT NULL,
    court_id    BIGINT      NOT NULL,
    rating      TINYINT     NOT NULL COMMENT '1–5 sao',
    comment     TEXT        NULL DEFAULT NULL,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE INDEX idx_booking_review (booking_id),
    INDEX        idx_court          (court_id),
    INDEX        idx_customer       (customer_id),

    CONSTRAINT fk_reviews_booking
        FOREIGN KEY (booking_id)  REFERENCES bookings (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_reviews_customer
        FOREIGN KEY (customer_id) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_reviews_court
        FOREIGN KEY (court_id)    REFERENCES courts (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
