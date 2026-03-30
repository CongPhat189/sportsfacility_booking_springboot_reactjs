package com.example.sportsfacility_backend.dto;

import java.time.LocalTime;

public class TimeRangeDTO {
    private LocalTime startTime;
    private LocalTime endTime;

    public TimeRangeDTO(LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
}
