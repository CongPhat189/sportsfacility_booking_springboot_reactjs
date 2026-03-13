package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.BookingRequest;
import com.example.sportsfacility_backend.dto.BookingResponse;
import com.example.sportsfacility_backend.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner/bookings")
public class OwnerBookingController {

    private final BookingService bookingService;

    public OwnerBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // GET ALL
    @GetMapping
    public List<BookingResponse> getAllBookings(){
        return bookingService.getAllBookings();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public BookingResponse getBooking(@PathVariable Long id){
        return bookingService.getBookingById(id);
    }

    // UPDATE STATUS
    @PutMapping("/{id}")
    public BookingResponse updateBooking(
            @PathVariable Long id,
            @RequestBody BookingRequest request){

        return bookingService.updateBooking(id, request);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteBooking(@PathVariable Long id){

        bookingService.deleteBooking(id);

        return "Booking deleted";
    }
}