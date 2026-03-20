package com.example.sportsfacility_backend.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CommissionRequest {
    @NotNull(message = "Commission không được null")
    private BigDecimal commissionRate;

    public BigDecimal getCommissionRate() {
        return commissionRate;
    }

    public void setCommissionRate(BigDecimal commissionRate) {
        this.commissionRate = commissionRate;
    }
}