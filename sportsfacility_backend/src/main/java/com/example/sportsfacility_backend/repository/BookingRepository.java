package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.dto.BookingPieDTO;
import com.example.sportsfacility_backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}