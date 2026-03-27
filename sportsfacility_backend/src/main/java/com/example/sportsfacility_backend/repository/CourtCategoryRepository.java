package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.CourtCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourtCategoryRepository extends JpaRepository<CourtCategory, Integer> {

    Optional<CourtCategory> findByName(String name);


}