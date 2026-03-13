package com.example.sportsfacility_backend.dto;

import com.example.sportsfacility_backend.entity.Booking;
import com.example.sportsfacility_backend.entity.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponseDTO {

    private Long id;
    private Long courtId;
    private String courtName;
    private Long scheduleId;
    private LocalDateTime bookingDateTime;
    private BigDecimal totalAmount;
    private BigDecimal depositAmount;
    private BookingStatus status;
    private String note;
    private LocalDateTime createdAt;

    public BookingResponseDTO(Booking b) {
        this.id = b.getId();
        this.courtId = b.getCourt().getId();
        this.courtName = b.getCourt().getName();
        this.scheduleId = b.getSchedule().getId();
        this.bookingDateTime = b.getBookingDateTime();
        this.totalAmount = b.getTotalAmount();
        this.depositAmount = b.getDepositAmount();
        this.status = b.getStatus();
        this.note = b.getNote();
        this.createdAt = b.getCreatedAt();
    }

    public Long getId() { return id; }
    public Long getCourtId() { return courtId; }
    public String getCourtName() { return courtName; }
    public Long getScheduleId() { return scheduleId; }
    public LocalDateTime getBookingDateTime() { return bookingDateTime; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public BigDecimal getDepositAmount() { return depositAmount; }
    public BookingStatus getStatus() { return status; }
    public String getNote() { return note; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
