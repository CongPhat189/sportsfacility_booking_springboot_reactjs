package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.entity.CourtCategory;
import com.example.sportsfacility_backend.service.CourtCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/court-categories")
public class AdminCourtCategoryController {

    @Autowired
    private CourtCategoryService courtCategoryService;

    // CREATE
    @PostMapping
    public CourtCategory create(@RequestBody CourtCategory category) {
        return courtCategoryService.createCategory(category);
    }

    // GET ALL
    @GetMapping
    public List<CourtCategory> getAll() {
        return courtCategoryService.getAllCategories();
    }


    // UPDATE
    @PutMapping("/{id}")
    public CourtCategory update(@PathVariable Integer id,
                                @RequestBody CourtCategory category) {
        return courtCategoryService.updateCategory(id, category);
    }

    // DISABLE CATEGORY
    @PatchMapping("/{id}/disable")
    public CourtCategory disableCategory(@PathVariable Integer id) {
        return courtCategoryService.disableCategory(id);
    }

    // ENABLE CATEGORY
    @PatchMapping("/{id}/enable")
    public CourtCategory enableCategory(@PathVariable Integer id) {
        return courtCategoryService.enableCategory(id);
    }
}