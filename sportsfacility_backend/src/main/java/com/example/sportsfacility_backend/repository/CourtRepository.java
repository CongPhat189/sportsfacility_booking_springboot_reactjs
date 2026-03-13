package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourtRepository extends JpaRepository<Court, Long> {

    List<Court> findByOwnerId(Long ownerId);


    @Query("""
            SELECT c FROM Court c
            JOIN FETCH c.owner
            JOIN FETCH c.category
            WHERE c.status = :status
            """)
    List<Court> findByStatus(CourtStatus status);

    @Query("SELECT c FROM Court c WHERE c.status = :status " +
            "AND (:keyword IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(c.address) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:categoryId IS NULL OR c.category.id = :categoryId)")
    List<Court> search(@Param("keyword") String keyword,
                       @Param("categoryId") Integer categoryId,
                       @Param("status") CourtStatus status);
}
