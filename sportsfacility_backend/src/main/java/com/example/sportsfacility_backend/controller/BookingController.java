package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.BookingRequestDTO;
import com.example.sportsfacility_backend.dto.BookingResponseDTO;
import com.example.sportsfacility_backend.dto.ScheduleResponseDTO;
import com.example.sportsfacility_backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/courts/{courtId}/available-slots")
    public ResponseEntity<List<ScheduleResponseDTO>> getAvailableSlots(
            @PathVariable Long courtId,
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(bookingService.getAvailableSlots(courtId, date));
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody BookingRequestDTO req,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.createBooking(req, userDetails.getUsername()));
    }
}
