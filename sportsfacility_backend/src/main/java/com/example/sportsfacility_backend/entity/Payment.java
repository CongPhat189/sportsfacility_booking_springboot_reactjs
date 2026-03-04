package com.example.sportsfacility_backend.entity;

import com.example.sportsfacility_backend.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "vnpay_txn_ref", nullable = false, unique = true, length = 100)
    private String vnpayTxnRef;

    @Column(name = "vnpay_order_info", length = 255)
    private String vnpayOrderInfo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private PaymentStatus status = PaymentStatus.PENDING;

    // 00 = thành công
    @Column(name = "response_code", length = 10)
    private String responseCode;

    @Column(name = "bank_code", length = 20)
    private String bankCode;

    @Column(name = "transaction_no", length = 100)
    private String transactionNo;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ==================== Constructors ====================

    public Payment() {}

    public Payment(Long id, Booking booking, String vnpayTxnRef, String vnpayOrderInfo,
                   BigDecimal amount, PaymentStatus status, String responseCode,
                   String bankCode, String transactionNo, LocalDateTime paidAt,
                   LocalDateTime createdAt) {
        this.id = id;
        this.booking = booking;
        this.vnpayTxnRef = vnpayTxnRef;
        this.vnpayOrderInfo = vnpayOrderInfo;
        this.amount = amount;
        this.status = status;
        this.responseCode = responseCode;
        this.bankCode = bankCode;
        this.transactionNo = transactionNo;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
    }

    // ==================== Getters ====================

    public Long getId() { return id; }

    public Booking getBooking() { return booking; }

    public String getVnpayTxnRef() { return vnpayTxnRef; }

    public String getVnpayOrderInfo() { return vnpayOrderInfo; }

    public BigDecimal getAmount() { return amount; }

    public PaymentStatus getStatus() { return status; }

    public String getResponseCode() { return responseCode; }

    public String getBankCode() { return bankCode; }

    public String getTransactionNo() { return transactionNo; }

    public LocalDateTime getPaidAt() { return paidAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    // ==================== Setters ====================

    public void setId(Long id) { this.id = id; }

    public void setBooking(Booking booking) { this.booking = booking; }

    public void setVnpayTxnRef(String vnpayTxnRef) { this.vnpayTxnRef = vnpayTxnRef; }

    public void setVnpayOrderInfo(String vnpayOrderInfo) { this.vnpayOrderInfo = vnpayOrderInfo; }

    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public void setStatus(PaymentStatus status) { this.status = status; }

    public void setResponseCode(String responseCode) { this.responseCode = responseCode; }

    public void setBankCode(String bankCode) { this.bankCode = bankCode; }

    public void setTransactionNo(String transactionNo) { this.transactionNo = transactionNo; }

    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
