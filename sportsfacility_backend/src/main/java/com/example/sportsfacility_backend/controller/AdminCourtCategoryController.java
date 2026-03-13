package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.CourtCategoryRequestDTO;
import com.example.sportsfacility_backend.entity.CourtCategory;
import com.example.sportsfacility_backend.service.CourtCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/categories")
public class AdminCourtCategoryController {

    @Autowired
    private CourtCategoryService courtCategoryService;

    // CREATE
    @PostMapping
    public ResponseEntity<CourtCategory> createCategory(
            @RequestBody CourtCategoryRequestDTO request) {

        CourtCategory category = courtCategoryService.createCategory(request);
        return ResponseEntity.ok(category);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<CourtCategory>> getAllCategories() {

        List<CourtCategory> categories = courtCategoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<CourtCategory> updateCategory(
            @PathVariable Integer id,
            @RequestBody CourtCategoryRequestDTO request) {

        CourtCategory updatedCategory =
                courtCategoryService.updateCategory(id, request);

        return ResponseEntity.ok(updatedCategory);
    }

    // DISABLE CATEGORY
    @PatchMapping("/{id}/disable")
    public ResponseEntity<CourtCategory> disableCategory(@PathVariable Integer id) {

        CourtCategory category = courtCategoryService.disableCategory(id);
        return ResponseEntity.ok(category);
    }

    // ENABLE CATEGORY
    @PatchMapping("/{id}/enable")
    public ResponseEntity<CourtCategory> enableCategory(@PathVariable Integer id) {

        CourtCategory category = courtCategoryService.enableCategory(id);
        return ResponseEntity.ok(category);
    }
}