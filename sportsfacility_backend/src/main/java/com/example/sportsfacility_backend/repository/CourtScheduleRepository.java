package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.CourtSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourtScheduleRepository extends JpaRepository<CourtSchedule, Long> {

    @Query("SELECT s FROM CourtSchedule s WHERE s.court.id = :courtId " +
           "AND s.dayOfWeek = :dayOfWeek AND s.isActive = true " +
           "AND s.id NOT IN (" +
           "  SELECT b.schedule.id FROM Booking b " +
           "  WHERE b.court.id = :courtId " +
           "  AND FUNCTION('DATE', b.bookingDateTime) = :date " +
           "  AND b.status <> 'CANCELLED'" +
           ")")
    List<CourtSchedule> findAvailableSlots(@Param("courtId") Long courtId,
                                           @Param("dayOfWeek") Byte dayOfWeek,
                                           @Param("date") java.time.LocalDate date);
}
