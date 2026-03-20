package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.customer.email = :email ORDER BY b.createdAt DESC")
    List<Booking> findByCustomerEmailOrderByCreatedAtDesc(@Param("email") String email);

}