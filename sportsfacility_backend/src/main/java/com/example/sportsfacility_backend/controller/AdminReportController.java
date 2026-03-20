package com.example.sportsfacility_backend.controller;


import com.example.sportsfacility_backend.dto.BookingPieDTO;
import com.example.sportsfacility_backend.dto.RevenueBarDTO;
import com.example.sportsfacility_backend.service.AdminReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/reports")
public class AdminReportController {

    @Autowired
    private AdminReportService adminReportService;

    // ===== PIE =====
    @GetMapping("/booking-pie")
    public ResponseEntity<BookingPieDTO> getBookingPie(
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(
                adminReportService.getBookingPie(month, year)
        );
    }

    // ===== BAR =====
    @GetMapping("/revenue-3months")
    public ResponseEntity<List<RevenueBarDTO>> getRevenue3Months(
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(
                adminReportService.getRevenue3Months(month, year)
        );
    }
}
