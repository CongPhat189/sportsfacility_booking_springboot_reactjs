package com.example.sportsfacility_backend.dto;

import java.time.LocalDate;

public class BookingRequestDTO {

    private Long courtId;
    private Long scheduleId;
    private LocalDate date;
    private String note;

    public Long getCourtId() { return courtId; }
    public Long getScheduleId() { return scheduleId; }
    public LocalDate getDate() { return date; }
    public String getNote() { return note; }

    public void setCourtId(Long courtId) { this.courtId = courtId; }
    public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setNote(String note) { this.note = note; }
}
