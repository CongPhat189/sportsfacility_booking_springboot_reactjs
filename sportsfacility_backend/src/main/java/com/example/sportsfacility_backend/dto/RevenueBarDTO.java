package com.example.sportsfacility_backend.dto;

import java.math.BigDecimal;

public class RevenueBarDTO {
    private String month;
    private BigDecimal revenue;

    public RevenueBarDTO(String month, BigDecimal revenue) {
        this.month = month;
        this.revenue = revenue;
    }

    public String getMonth() { return month; }
    public BigDecimal getRevenue() { return revenue; }
}