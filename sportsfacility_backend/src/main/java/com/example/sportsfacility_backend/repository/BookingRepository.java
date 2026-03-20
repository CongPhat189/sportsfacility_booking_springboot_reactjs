package com.example.sportsfacility_backend.repository;
import java.time.LocalDateTime;
import com.example.sportsfacility_backend.dto.BookingPieDTO;
import com.example.sportsfacility_backend.entity.Booking;
import com.example.sportsfacility_backend.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {


    @Query("""
            SELECT new com.example.sportsfacility_backend.dto.BookingPieDTO(
                COALESCE(SUM(CASE WHEN b.status = 'PENDING' THEN 1 ELSE 0 END), 0),
                COALESCE(SUM(CASE WHEN b.status = 'COMPLETED' THEN 1 ELSE 0 END), 0),
                COALESCE(SUM(CASE WHEN b.status = 'CANCELLED' THEN 1 ELSE 0 END), 0)
            )
            FROM Booking b
            WHERE MONTH(b.bookingDateTime) = :month
            AND YEAR(b.bookingDateTime) = :year
            """)
    BookingPieDTO getBookingPie(int month, int year);

    @Query("""
            SELECT 
                MONTH(b.bookingDateTime),
                YEAR(b.bookingDateTime),
                ROUND(SUM(b.totalAmount * c.commissionRate / 100), 2)
            FROM Booking b
            JOIN b.court c
            WHERE b.status = 'COMPLETED'
            AND (
                (YEAR(b.bookingDateTime) = :year AND MONTH(b.bookingDateTime) <= :month)
                OR
                (YEAR(b.bookingDateTime) = :year - 1 AND MONTH(b.bookingDateTime) > 12 - (3 - :month))
            )
            GROUP BY YEAR(b.bookingDateTime), MONTH(b.bookingDateTime)
            ORDER BY YEAR(b.bookingDateTime), MONTH(b.bookingDateTime)
            """)
    List<Object[]> getRevenueLast3Months(int month, int year);

    @Query("""
SELECT COUNT(b.id), 
       COALESCE(SUM(b.totalAmount), 0), 
       COALESCE(SUM(b.totalAmount * (1 - c.commissionRate/100)), 0)
FROM Booking b
JOIN b.court c
WHERE c.owner.id = :ownerId
  AND b.status = :status
  AND b.bookingDateTime >= :startDate
  AND b.bookingDateTime < :endDate
""")
    List<Object[]> getOwnerRevenueByPeriod(@Param("ownerId") Long ownerId,
                                           @Param("status") BookingStatus status,
                                           @Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);
}