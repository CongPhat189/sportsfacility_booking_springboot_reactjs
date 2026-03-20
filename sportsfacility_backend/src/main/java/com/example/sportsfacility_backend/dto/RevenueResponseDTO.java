package com.example.sportsfacility_backend.dto;

public class RevenueResponseDTO {

    private Long totalBookings;
    private Double totalAmount;
    private Double revenueAfterCommission;

    public RevenueResponseDTO(Long totalBookings, Double totalAmount, Double revenueAfterCommission) {
        this.totalBookings = totalBookings;
        this.totalAmount = totalAmount;
        this.revenueAfterCommission = revenueAfterCommission;
    }

    public Long getTotalBookings() {
        return totalBookings;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public Double getRevenueAfterCommission() {
        return revenueAfterCommission;
    }
}