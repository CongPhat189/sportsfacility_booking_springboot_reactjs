package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.entity.CourtCategory;
import com.example.sportsfacility_backend.repository.CourtCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourtCategoryService {

    @Autowired CourtCategoryRepository courtCategoryRepository;

    // CREATE
    public CourtCategory createCategory(CourtCategory category) {

        courtCategoryRepository.findByName(category.getName())
                .ifPresent(c -> {
                    throw new RuntimeException("Danh mục đã tồn tại");
                });

        return courtCategoryRepository.save(category);
    }

    // READ ALL
    public List<CourtCategory> getAllCategories() {
        return courtCategoryRepository.findAll();
    }


    // UPDATE
    public CourtCategory updateCategory(Integer id, CourtCategory req) {

        CourtCategory category = courtCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        category.setName(req.getName());
        category.setDescription(req.getDescription());
        category.setIsActive(req.getIsActive());

        return courtCategoryRepository.save(category);
    }

    // DELETE (disable)
    public CourtCategory disableCategory(Integer id) {

        CourtCategory category = courtCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        category.setIsActive(false);

        return courtCategoryRepository.save(category);
    }

    public CourtCategory enableCategory(Integer id) {

        CourtCategory category = courtCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        category.setIsActive(true);

        return courtCategoryRepository.save(category);
    }
}