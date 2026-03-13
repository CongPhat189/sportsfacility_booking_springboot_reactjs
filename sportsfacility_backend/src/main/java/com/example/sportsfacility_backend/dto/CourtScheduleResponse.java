package com.example.sportsfacility_backend.dto;

import java.math.BigDecimal;
import java.time.LocalTime;

public class CourtScheduleResponse {

    private Long id;
    private Long courtId;
    private Byte dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal price;
    private Boolean isActive;

    public CourtScheduleResponse(Long id, Long courtId, Byte dayOfWeek,
                                 LocalTime startTime, LocalTime endTime,
                                 BigDecimal price, Boolean isActive) {
        this.id = id;
        this.courtId = courtId;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
        this.isActive = isActive;
    }

    public Long getId() { return id; }
    public Long getCourtId() { return courtId; }
    public Byte getDayOfWeek() { return dayOfWeek; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public BigDecimal getPrice() { return price; }
    public Boolean getIsActive() { return isActive; }
}