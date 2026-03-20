package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.*;
import com.example.sportsfacility_backend.service.AdminCourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/admin/courts")
public class AdminCourtController {

    @Autowired
    private AdminCourtService adminCourtService;

    // Lấy danh sách sân chờ duyệt
    @GetMapping("/pending")
    public ResponseEntity<List<CourtResponseDTO>> getPendingCourts() {
        return ResponseEntity.ok(adminCourtService.getPendingCourts());
    }

        // Lấy danh sách sân đã duyệt
    @GetMapping("/active")
    public ResponseEntity<List<CourtResponseDTO>> getActiveCourts() {
        return ResponseEntity.ok(adminCourtService.getActiveCourts());
    }

        // Lấy chi tiết sân
    @GetMapping("/{id}")
    public ResponseEntity<CourtResponseDTO> getCourtDetails(@PathVariable Long id) {
        return ResponseEntity.ok(adminCourtService.getCourtDetails(id));
    }

    // Duyệt sân
    @PutMapping("/{id}/approve")
    public ResponseEntity<CourtResponseDTO> approveCourt(@PathVariable Long id) {
        return ResponseEntity.ok(adminCourtService.approveCourt(id));
    }

    // Từ chối sân
    @PutMapping("/{id}/reject")
    public ResponseEntity<CourtResponseDTO> rejectCourt(
            @PathVariable Long id,
            @RequestBody RejectCourtRequest request) {

        return ResponseEntity.ok(
                adminCourtService.rejectCourt(id, request.getRejectReason())
        );
    }

    // Cập nhật Commission
    @PutMapping("/{id}/commission")
    public ResponseEntity<CourtResponseDTO> updateCommission(
            @PathVariable Long id,
            @RequestBody CommissionRequest request) {

        return ResponseEntity.ok(
                adminCourtService.updateCommission(id, request.getCommissionRate())
        );
    }

}