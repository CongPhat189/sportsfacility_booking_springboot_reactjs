package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourtRepository extends JpaRepository<Court, Long> {

    List<Court> findByOwnerId(Long ownerId);

}