package com.example.sportsfacility_backend.dto;

public class RevenueItemDTO {
    private Long total;
    private Double totalAmount;
    private Double revenueAfterCommission;

    public RevenueItemDTO(Long total, Double totalAmount, Double revenueAfterCommission) {
        this.total = total;
        this.totalAmount = totalAmount;
        this.revenueAfterCommission = revenueAfterCommission;
    }

    public Long getTotal() { return total; }
    public Double getTotalAmount() { return totalAmount; }
    public Double getRevenueAfterCommission() { return revenueAfterCommission; }
}
