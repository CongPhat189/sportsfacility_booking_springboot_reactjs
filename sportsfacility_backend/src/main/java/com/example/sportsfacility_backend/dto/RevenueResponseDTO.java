package com.example.sportsfacility_backend.dto;

public class RevenueResponseDTO {

    private RevenueItemDTO completed;
    private RevenueItemDTO cancelled;
    private RevenueItemDTO expired;

    public RevenueResponseDTO(RevenueItemDTO completed,
                              RevenueItemDTO cancelled,
                              RevenueItemDTO expired) {
        this.completed = completed;
        this.cancelled = cancelled;
        this.expired = expired;
    }

    public RevenueItemDTO getCompleted() { return completed; }
    public RevenueItemDTO getCancelled() { return cancelled; }
    public RevenueItemDTO getExpired() { return expired; }
}