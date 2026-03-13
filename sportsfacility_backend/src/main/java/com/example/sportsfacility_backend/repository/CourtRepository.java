package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourtRepository extends JpaRepository<Court, Integer> {

    List<Court> findByStatus(CourtStatus status);

}