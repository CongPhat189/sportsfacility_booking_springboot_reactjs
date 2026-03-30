package com.example.sportsfacility_backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequestDTO {

    private Long courtId;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate date;
    private String note;

    public Long getCourtId() { return courtId; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public LocalDate getDate() { return date; }
    public String getNote() { return note; }

    public void setCourtId(Long courtId) { this.courtId = courtId; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setNote(String note) { this.note = note; }
}
