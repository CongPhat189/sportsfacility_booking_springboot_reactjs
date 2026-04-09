package com.example.sportsfacility_backend.dto;

import java.util.List;

public class RevenueResponseDTO {

    private RevenueItemDTO completed;
    private RevenueItemDTO cancelled;
    private RevenueItemDTO expired;
    private List<TopItemDTO> courtStatistics; // Danh sách để vẽ biểu đồ sân
    private List<TopSlotDTO> slotStatistics;   // Danh sách để vẽ biểu đồ khung giờ

    public RevenueResponseDTO(RevenueItemDTO completed,
                              RevenueItemDTO cancelled,
                              RevenueItemDTO expired,
                              List<TopItemDTO> courtStatistics,
                              List<TopSlotDTO> slotStatistics) {
        this.completed = completed;
        this.cancelled = cancelled;
        this.expired = expired;
        this.courtStatistics = courtStatistics;
        this.slotStatistics = slotStatistics;
    }

    public static record TopItemDTO(String name, Long count) {}
    public static record TopSlotDTO(String timeRange, Long count) {}

    // Getters
    public RevenueItemDTO getCompleted() { return completed; }
    public RevenueItemDTO getCancelled() { return cancelled; }
    public RevenueItemDTO getExpired() { return expired; }
    public List<TopItemDTO> getCourtStatistics() { return courtStatistics; }
    public List<TopSlotDTO> getSlotStatistics() { return slotStatistics; }
}