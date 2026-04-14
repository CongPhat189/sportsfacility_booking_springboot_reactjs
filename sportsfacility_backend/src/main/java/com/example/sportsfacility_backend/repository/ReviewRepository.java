package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByBookingId(Long bookingId);
    boolean existsByBookingId(Long bookingId);
    List<Review> findByCourtIdOrderByCreatedAtDesc(Long courtId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.court.id = :courtId")
    Double getAverageRatingByCourtId(@Param("courtId") Long courtId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.court.id = :courtId")
    Long countByCourtId(@Param("courtId") Long courtId);
}
