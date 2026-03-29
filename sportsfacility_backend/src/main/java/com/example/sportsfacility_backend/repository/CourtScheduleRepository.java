package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.CourtSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourtScheduleRepository extends JpaRepository<CourtSchedule, Long> {

    // Lấy tất cả schedule của owner, fetch court luôn
    @Query("SELECT cs FROM CourtSchedule cs JOIN FETCH cs.court c WHERE c.owner.id = :ownerId")
    List<CourtSchedule> findByOwnerIdWithCourt(@Param("ownerId") Long ownerId);
    List<CourtSchedule> findByCourtIdAndDayOfWeek(Long courtId, Byte dayOfWeek);

    // Lấy schedule theo id, fetch court và owner luôn
    @Query("SELECT cs FROM CourtSchedule cs " +
            "JOIN FETCH cs.court c " +
            "JOIN FETCH c.owner " +
            "WHERE cs.id = :id")
    Optional<CourtSchedule> findByIdWithCourtAndOwner(@Param("id") Long id);

    // Lấy các slot còn trống
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