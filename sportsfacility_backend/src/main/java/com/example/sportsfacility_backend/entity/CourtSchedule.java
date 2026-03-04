package com.example.sportsfacility_backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "court_schedules")
public class CourtSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
    @Column(name = "day_of_week", nullable = false)
    private Byte dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // ==================== Constructors ====================

    public CourtSchedule() {}

    public CourtSchedule(Long id, Court court, Byte dayOfWeek, LocalTime startTime,
                         LocalTime endTime, BigDecimal price, Boolean isActive) {
        this.id = id;
        this.court = court;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
        this.isActive = isActive;
    }

    // ==================== Getters ====================

    public Long getId() { return id; }

    public Court getCourt() { return court; }

    public Byte getDayOfWeek() { return dayOfWeek; }

    public LocalTime getStartTime() { return startTime; }

    public LocalTime getEndTime() { return endTime; }

    public BigDecimal getPrice() { return price; }

    public Boolean getIsActive() { return isActive; }

    // ==================== Setters ====================

    public void setId(Long id) { this.id = id; }

    public void setCourt(Court court) { this.court = court; }

    public void setDayOfWeek(Byte dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public void setPrice(BigDecimal price) { this.price = price; }

    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
