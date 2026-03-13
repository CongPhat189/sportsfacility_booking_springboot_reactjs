package com.example.sportsfacility_backend.dto;

import java.math.BigDecimal;
import java.time.LocalTime;

public class CourtScheduleRequest {

    private Long courtId;
    private Byte dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal price;
    private Boolean isActive;

    public Long getCourtId() { return courtId; }
    public void setCourtId(Long courtId) { this.courtId = courtId; }

    public Byte getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(Byte dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}