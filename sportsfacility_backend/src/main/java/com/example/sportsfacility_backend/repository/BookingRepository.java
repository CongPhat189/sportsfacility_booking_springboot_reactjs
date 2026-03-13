package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
