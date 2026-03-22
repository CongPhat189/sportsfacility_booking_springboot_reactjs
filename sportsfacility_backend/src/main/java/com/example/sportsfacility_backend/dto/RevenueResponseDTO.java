package com.example.sportsfacility_backend.dto;

public class RevenueResponseDTO {

    private RevenueItemDTO completed;
    private RevenueItemDTO cancelled;

    public RevenueResponseDTO(RevenueItemDTO completed, RevenueItemDTO cancelled) {
        this.completed = completed;
        this.cancelled = cancelled;
    }

    public RevenueItemDTO getCompleted() { return completed; }
    public RevenueItemDTO getCancelled() { return cancelled; }
}