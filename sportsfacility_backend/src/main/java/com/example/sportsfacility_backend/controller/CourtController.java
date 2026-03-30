package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.CourtResponseDTO;
import com.example.sportsfacility_backend.dto.ReviewResponseDTO;
import com.example.sportsfacility_backend.entity.CourtCategory;
import com.example.sportsfacility_backend.service.CourtCategoryService;
import com.example.sportsfacility_backend.service.CourtService;
import com.example.sportsfacility_backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courts")
public class CourtController {

    @Autowired
    private CourtService courtService;

    @Autowired
    private CourtCategoryService courtCategoryService;

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/categories")
    public ResponseEntity<List<CourtCategory>> getCategories() {
        return ResponseEntity.ok(
                courtCategoryService.getAllCategories()
                        .stream()
                        .filter(CourtCategory::getIsActive)
                        .toList()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<CourtResponseDTO>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId) {
        return ResponseEntity.ok(courtService.searchCourts(keyword, categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourtResponseDTO> getCourtById(@PathVariable Long id) {
        return ResponseEntity.ok(courtService.getCourtDTOById(id));
    }


    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getCourtReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsByCourtId(id));
    }
}
