package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.service.CheckinBookingService;
import com.example.sportsfacility_backend.service.CompleteBookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner/bookings")
public class CheckinBookingController {

    private final CheckinBookingService checkinBookingService;
    private final CompleteBookingService completeBookingService;

    public CheckinBookingController(CheckinBookingService checkinBookingService,
                                    CompleteBookingService completeBookingService) {
        this.checkinBookingService = checkinBookingService;
        this.completeBookingService = completeBookingService;
    }

    @PutMapping("/{id}/checkin")
    public ResponseEntity<?> checkin(@PathVariable Long id){
        try {
            checkinBookingService.checkin(id);
            return ResponseEntity.ok("Checkin booking thành công");
        } catch (RuntimeException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id){
        try {
            completeBookingService.complete(id);
            return ResponseEntity.ok("Hoàn thành booking");
        } catch (RuntimeException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}