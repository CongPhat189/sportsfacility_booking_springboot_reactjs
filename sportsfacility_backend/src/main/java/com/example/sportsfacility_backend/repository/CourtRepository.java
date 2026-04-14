package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourtRepository extends JpaRepository<Court, Long> {

    Optional<Court> findByIdAndStatus(Long id, CourtStatus status);

    @Query("""
       SELECT c FROM Court c
       JOIN FETCH c.category
       WHERE c.owner.id = :ownerId
       """)
    List<Court> findByOwnerId(@Param("ownerId") Long ownerId);

    @Query("SELECT c FROM Court c WHERE c.category.id = :categoryId")
    List<Court> findByCategoryId(@Param("categoryId") Integer categoryId);


    boolean existsByCategoryId(Integer categoryId);


    @Modifying
    @Query("DELETE FROM Court c WHERE c.owner.id = :ownerId")
    void deleteByOwnerId(@Param("ownerId") Long ownerId);


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
