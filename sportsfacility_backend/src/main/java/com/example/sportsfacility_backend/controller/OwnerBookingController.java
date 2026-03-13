package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.BookingRequest;
import com.example.sportsfacility_backend.dto.BookingResponse;
import com.example.sportsfacility_backend.service.OwnerBookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner/bookings")
public class OwnerBookingController {

    private final OwnerBookingService ownerBookingService;

    public OwnerBookingController(OwnerBookingService ownerBookingService) {
        this.ownerBookingService = ownerBookingService;
    }

    // GET ALL
    @GetMapping
    public List<BookingResponse> getAllBookings(){
        return ownerBookingService.getAllBookings();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public BookingResponse getBooking(@PathVariable Long id){
        return ownerBookingService.getBookingById(id);
    }

    // UPDATE STATUS
    @PutMapping("/{id}")
    public BookingResponse updateBooking(
            @PathVariable Long id,
            @RequestBody BookingRequest request){

        return ownerBookingService.updateBooking(id, request);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteBooking(@PathVariable Long id){

        ownerBookingService.deleteBooking(id);

        return "Booking deleted";
    }
}