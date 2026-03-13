package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.CourtCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtCategoryRepository extends JpaRepository<CourtCategory, Integer> {
}