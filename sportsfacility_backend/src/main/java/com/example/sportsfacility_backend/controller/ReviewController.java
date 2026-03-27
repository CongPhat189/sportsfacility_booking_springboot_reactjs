package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.ReviewRequestDTO;
import com.example.sportsfacility_backend.dto.ReviewResponseDTO;
import com.example.sportsfacility_backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
public class ReviewController {

    @Autowired private ReviewService reviewService;

    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponseDTO> submitReview(
            @RequestBody ReviewRequestDTO req,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.submitReview(req, userDetails.getUsername()));
    }

    @GetMapping("/bookings/{bookingId}/review")
    public ResponseEntity<?> getReview(@PathVariable Long bookingId) {
        return reviewService.getReviewByBookingId(bookingId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
