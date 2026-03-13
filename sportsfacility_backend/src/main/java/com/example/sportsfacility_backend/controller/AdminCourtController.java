package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.CourtResponseDTO;
import com.example.sportsfacility_backend.dto.RejectCourtRequest;
import com.example.sportsfacility_backend.service.AdminCourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}