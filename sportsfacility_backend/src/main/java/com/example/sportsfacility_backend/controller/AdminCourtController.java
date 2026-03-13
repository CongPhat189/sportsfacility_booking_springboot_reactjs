package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.RejectCourtRequest;
import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.service.AdminCourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/courts")
public class AdminCourtController {

    @Autowired
    private AdminCourtService adminCourtService;

    // Lấy danh sách sân chờ duyệt
    @GetMapping("/pending")
    public List<Court> getPendingCourts() {
        return adminCourtService.getPendingCourts();
    }

    // Duyệt sân
    @PutMapping("/{id}/approve")
    public Court approveCourt(@PathVariable Integer id) {
        return adminCourtService.approveCourt(id);
    }

    @PutMapping("/{id}/reject")
    public Court rejectCourt(@PathVariable Integer id,
                             @RequestBody RejectCourtRequest request) {

        return adminCourtService.rejectCourt(id, request.getRejectReason());
    }
}