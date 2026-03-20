package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.service.OwnerRevenueService;
import com.example.sportsfacility_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner/revenue")
public class OwnerRevenueController {

    private final OwnerRevenueService ownerRevenueService;
    private final UserService userService;

    public OwnerRevenueController(OwnerRevenueService ownerRevenueService,
                                  UserService userService) {
        this.ownerRevenueService = ownerRevenueService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getRevenue(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam int year,
            @RequestParam(required = false) Integer month) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body("Chưa đăng nhập");
        }

        // Lấy user hiện tại
        User currentUser = userService.getCurrentUser(userDetails.getUsername());
        Long ownerId = currentUser.getId(); // ID của user đang đăng nhập

        // Trả về doanh thu
        return ResponseEntity.ok(
                ownerRevenueService.getRevenue(ownerId, year, month)
        );
    }
}