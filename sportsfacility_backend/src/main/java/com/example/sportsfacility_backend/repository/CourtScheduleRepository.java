package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.CourtSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtScheduleRepository extends JpaRepository<CourtSchedule, Long> {
}