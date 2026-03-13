package com.example.sportsfacility_backend.dto;

import com.example.sportsfacility_backend.entity.CourtSchedule;

import java.math.BigDecimal;
import java.time.LocalTime;

public class ScheduleResponseDTO {

    private Long id;
    private Byte dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal price;

    public ScheduleResponseDTO(CourtSchedule s) {
        this.id = s.getId();
        this.dayOfWeek = s.getDayOfWeek();
        this.startTime = s.getStartTime();
        this.endTime = s.getEndTime();
        this.price = s.getPrice();
    }

    public Long getId() { return id; }
    public Byte getDayOfWeek() { return dayOfWeek; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public BigDecimal getPrice() { return price; }
}
