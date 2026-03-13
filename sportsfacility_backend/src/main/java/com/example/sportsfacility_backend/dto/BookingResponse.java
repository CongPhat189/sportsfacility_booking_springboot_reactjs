package com.example.sportsfacility_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long courtId;
    private Long scheduleId;
    private String status;
    private BigDecimal totalAmount;
    private BigDecimal depositAmount;
    private LocalDateTime bookingDateTime;
    private String cancelReason;

    public BookingResponse(Long id, Long courtId, Long scheduleId,
                           String status, BigDecimal totalAmount,
                           BigDecimal depositAmount,
                           LocalDateTime bookingDateTime,
                           String cancelReason) {

        this.id = id;
        this.courtId = courtId;
        this.scheduleId = scheduleId;
        this.status = status;
        this.totalAmount = totalAmount;
        this.depositAmount = depositAmount;
        this.bookingDateTime = bookingDateTime;
        this.cancelReason = cancelReason;
    }

    public Long getId() { return id; }
    public Long getCourtId() { return courtId; }
    public Long getScheduleId() { return scheduleId; }
    public String getStatus() { return status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public BigDecimal getDepositAmount() { return depositAmount; }
    public LocalDateTime getBookingDateTime() { return bookingDateTime; }
    public String getCancelReason() { return cancelReason; }
}