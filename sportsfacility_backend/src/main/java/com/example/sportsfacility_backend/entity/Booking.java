package com.example.sportsfacility_backend.entity;

import com.example.sportsfacility_backend.entity.enums.BookingStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private CourtSchedule schedule;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "booking_date_time", nullable = false)
    private LocalDateTime bookingDateTime;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "deposit_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal depositAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "cancel_reason", columnDefinition = "TEXT")
    private String cancelReason;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "refund_bank_name", length = 100)
    private String refundBankName;

    @Column(name = "refund_account_number", length = 50)
    private String refundAccountNumber;

    @Column(name = "refund_account_holder", length = 100)
    private String refundAccountHolder;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ==================== Constructors ====================

    public Booking() {}

    public Booking(Long id, User customer, Court court, CourtSchedule schedule,
                LocalTime startTime, LocalTime endTime,
                LocalDateTime bookingDateTime, BigDecimal totalAmount, BigDecimal depositAmount,
                BookingStatus status, String cancelReason, String note,
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.customer = customer;
        this.court = court;
        this.schedule = schedule;
        this.startTime = startTime;
        this.endTime = endTime;
        this.bookingDateTime = bookingDateTime;
        this.totalAmount = totalAmount;
        this.depositAmount = depositAmount;
        this.status = status;
        this.cancelReason = cancelReason;
        this.note = note;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ==================== Getters ====================

    public Long getId() { return id; }

    public User getCustomer() { return customer; }

    public Court getCourt() { return court; }

    public CourtSchedule getSchedule() { return schedule; }

    public LocalTime getStartTime() { return startTime; }

    public LocalTime getEndTime() { return endTime; }

    public LocalDateTime getBookingDateTime() { return bookingDateTime; }

    public BigDecimal getTotalAmount() { return totalAmount; }

    public BigDecimal getDepositAmount() { return depositAmount; }

    public BookingStatus getStatus() { return status; }

    public String getCancelReason() { return cancelReason; }

    public String getNote() { return note; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public String getRefundBankName() { return refundBankName; }

    public String getRefundAccountNumber() { return refundAccountNumber; }

    public String getRefundAccountHolder() { return refundAccountHolder; }

    // ==================== Setters ====================

    public void setId(Long id) { this.id = id; }

    public void setCustomer(User customer) { this.customer = customer; }

    public void setCourt(Court court) { this.court = court; }

    public void setSchedule(CourtSchedule schedule) { this.schedule = schedule; }

    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public void setBookingDateTime(LocalDateTime bookingDateTime) { this.bookingDateTime = bookingDateTime; }

    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }

    public void setStatus(BookingStatus status) { this.status = status; }

    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }

    public void setNote(String note) { this.note = note; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public void setRefundBankName(String refundBankName) { this.refundBankName = refundBankName; }

    public void setRefundAccountNumber(String refundAccountNumber) { this.refundAccountNumber = refundAccountNumber; }

    public void setRefundAccountHolder(String refundAccountHolder) { this.refundAccountHolder = refundAccountHolder; }
}
