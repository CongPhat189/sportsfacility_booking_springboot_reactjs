package com.example.sportsfacility_backend.dto;

import com.example.sportsfacility_backend.entity.enums.BookingStatus;

public class CancelBookingResponse {
    private Long bookingId;
    private BookingStatus status;
    private boolean refundEligible;
    private String message;

    public CancelBookingResponse(Long bookingId, BookingStatus status, boolean refundEligible, String message) {
        this.bookingId = bookingId;
        this.status = status;
        this.refundEligible = refundEligible;
        this.message = message;
    }

    public Long getBookingId() { return bookingId; }
    public BookingStatus getStatus() { return status; }
    public boolean isRefundEligible() { return refundEligible; }
    public String getMessage() { return message; }
}
