package com.example.sportsfacility_backend.dto;

public class RevenueResponseDTO {

    private RevenueItemDTO completed;
    private RevenueItemDTO cancelled;
    private RevenueItemDTO expired;
    private TopItemDTO mostBookedCourt;
    private TopSlotDTO mostPopularSlot;

    public RevenueResponseDTO(RevenueItemDTO completed,
                              RevenueItemDTO cancelled,
                              RevenueItemDTO expired,
                              TopItemDTO mostBookedCourt,
                              TopSlotDTO mostPopularSlot) {
        this.completed = completed;
        this.cancelled = cancelled;
        this.expired = expired;
        this.mostBookedCourt = mostBookedCourt;
        this.mostPopularSlot = mostPopularSlot;
    }

    // --- Các class con nằm ở đây ---
    public static record TopItemDTO(String name, Long count) {}
    public static record TopSlotDTO(String timeRange, Long count) {}

    // Getters
    public RevenueItemDTO getCompleted() { return completed; }
    public RevenueItemDTO getCancelled() { return cancelled; }
    public RevenueItemDTO getExpired() { return expired; }
    public TopItemDTO getMostBookedCourt() { return mostBookedCourt; }
    public TopSlotDTO getMostPopularSlot() { return mostPopularSlot; }
}