package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.dto.BookingPieDTO;
import com.example.sportsfacility_backend.entity.Booking;
import com.example.sportsfacility_backend.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.customer.email = :email ORDER BY b.createdAt DESC")
    List<Booking> findByCustomerEmailOrderByCreatedAtDesc(@Param("email") String email);


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
                SELECT 
                    COUNT(CASE WHEN b.status = 'COMPLETED' THEN 1 END),
                    SUM(CASE WHEN b.status = 'COMPLETED' THEN b.totalAmount ELSE 0 END),
                    SUM(CASE WHEN b.status = 'COMPLETED' 
                             THEN b.totalAmount * (1 - c.commissionRate / 100) ELSE 0 END),
            
                    COUNT(CASE WHEN b.status = 'CANCELLED' THEN 1 END),
                    0,
                    0,
            
                    COUNT(CASE WHEN b.status = 'EXPIRED' THEN 1 END),
                    SUM(CASE WHEN b.status = 'EXPIRED' THEN b.depositAmount ELSE 0 END),
                    SUM(CASE WHEN b.status = 'EXPIRED'
                             THEN b.depositAmount * (1 - c.commissionRate / 100) ELSE 0 END)
            
                FROM Booking b
                JOIN b.court c
                WHERE c.owner.id = :ownerId
                  AND YEAR(b.bookingDateTime) = :year
                  AND (:month IS NULL OR MONTH(b.bookingDateTime) = :month)
            """)
    List<Object[]> getOwnerRevenueSeparate(@Param("ownerId") Long ownerId,
                                           @Param("year") int year,
                                           @Param("month") Integer month);

    @Query("""
                SELECT b FROM Booking b
                JOIN FETCH b.customer
                JOIN FETCH b.court
                JOIN FETCH b.schedule
                WHERE b.court.owner.id = :ownerId
            """)
    List<Booking> findByOwnerId(@Param("ownerId") Long ownerId);

    @Query("""
                SELECT b FROM Booking b
                JOIN FETCH b.court c
                JOIN FETCH c.owner
                JOIN FETCH b.customer
                WHERE b.id = :id
            """)
    Booking findByIdWithCourtAndOwner(Long id);

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
            "WHERE b.court.id = :courtId " +
            "AND FUNCTION('DATE', b.bookingDateTime) = :date " +
            "AND b.status <> 'CANCELLED' " +
            "AND b.startTime < :endTime AND b.endTime > :startTime")
    boolean hasTimeOverlap(
            @Param("courtId") Long courtId,
            @Param("date") java.time.LocalDate date,
            @Param("startTime") java.time.LocalTime startTime,
            @Param("endTime") java.time.LocalTime endTime);

    @Query("SELECT b FROM Booking b WHERE b.court.id = :courtId " +
            "AND FUNCTION('DATE', b.bookingDateTime) = :date " +
            "AND b.schedule.id = :scheduleId " +
            "AND b.status <> 'CANCELLED'")
    List<Booking> findBookingsInSlot(@Param("courtId") Long courtId,
                                     @Param("date") LocalDate date,
                                     @Param("scheduleId") Long scheduleId);


    // Lấy thống kê tất cả các sân của chủ sân (để vẽ biểu đồ)
    @Query(value = """
                SELECT c.name, COUNT(b.id) as total 
                FROM bookings b 
                JOIN courts c ON b.court_id = c.id 
                WHERE c.owner_id = :ownerId 
                  AND YEAR(b.booking_date_time) = :year 
                  AND (:month IS NULL OR MONTH(b.booking_date_time) = :month)
                  AND b.status = 'COMPLETED'
                GROUP BY c.id, c.name 
                ORDER BY total DESC
            """, nativeQuery = true)
    List<Object[]> findAllCourtsStat(@Param("ownerId") Long ownerId,
                                     @Param("year") int year,
                                     @Param("month") Integer month);

    // Lấy thống kê tất cả khung giờ có người đặt (để vẽ biểu đồ)
    @Query(value = """
                SELECT 
                    TIME_FORMAT(s.start_time, '%H:%i') as st,
                    TIME_FORMAT(s.end_time, '%H:%i') as et,
                    COUNT(b.id) as total
                FROM bookings b
                JOIN courts c ON b.court_id = c.id
                JOIN court_schedules s ON b.schedule_id = s.id
                WHERE c.owner_id = :ownerId
                  AND YEAR(b.booking_date_time) = :year
                  AND (:month IS NULL OR MONTH(b.booking_date_time) = :month)
                  AND b.status = 'COMPLETED'
                GROUP BY s.start_time, s.end_time
                ORDER BY s.start_time ASC
            """, nativeQuery = true)
    List<Object[]> findAllSlotsStat(@Param("ownerId") Long ownerId,
                                    @Param("year") int year,
                                    @Param("month") Integer month);
}


