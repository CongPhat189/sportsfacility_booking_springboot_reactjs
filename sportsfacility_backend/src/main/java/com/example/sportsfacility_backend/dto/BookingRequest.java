package com.example.sportsfacility_backend.dto;

import com.example.sportsfacility_backend.entity.enums.BookingStatus;

public class BookingRequest {

    private BookingStatus status;
    private String cancelReason;

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }
}