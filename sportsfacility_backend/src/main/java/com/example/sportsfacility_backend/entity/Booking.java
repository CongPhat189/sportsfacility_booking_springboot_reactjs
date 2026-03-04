package com.example.sportsfacility_backend.entity;

import com.example.sportsfacility_backend.entity.enums.BookingStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ==================== Constructors ====================

    public Booking() {}

    public Booking(Long id, User customer, Court court, CourtSchedule schedule,
                   LocalDateTime bookingDateTime, BigDecimal totalAmount, BigDecimal depositAmount,
                   BookingStatus status, String cancelReason, String note,
                   LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.customer = customer;
        this.court = court;
        this.schedule = schedule;
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

    public LocalDateTime getBookingDateTime() { return bookingDateTime; }

    public BigDecimal getTotalAmount() { return totalAmount; }

    public BigDecimal getDepositAmount() { return depositAmount; }

    public BookingStatus getStatus() { return status; }

    public String getCancelReason() { return cancelReason; }

    public String getNote() { return note; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ==================== Setters ====================

    public void setId(Long id) { this.id = id; }

    public void setCustomer(User customer) { this.customer = customer; }

    public void setCourt(Court court) { this.court = court; }

    public void setSchedule(CourtSchedule schedule) { this.schedule = schedule; }

    public void setBookingDateTime(LocalDateTime bookingDateTime) { this.bookingDateTime = bookingDateTime; }

    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }

    public void setStatus(BookingStatus status) { this.status = status; }

    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }

    public void setNote(String note) { this.note = note; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
