package com.example.sportsfacility_backend.dto;

public class BookingPieDTO {
    private long pending;
    private long completed;
    private long cancelled;

    public BookingPieDTO(long pending, long completed, long cancelled) {
        this.pending = pending;
        this.completed = completed;
        this.cancelled = cancelled;
    }

    public long getPending() { return pending; }
    public long getCompleted() { return completed; }
    public long getCancelled() { return cancelled; }
}
