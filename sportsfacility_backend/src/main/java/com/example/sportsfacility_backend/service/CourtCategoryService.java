package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.CourtCategoryRequestDTO;
import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.CourtCategory;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import com.example.sportsfacility_backend.repository.CourtCategoryRepository;
import com.example.sportsfacility_backend.repository.CourtRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourtCategoryService {

    @Autowired
    private CourtCategoryRepository courtCategoryRepository;
    @Autowired
    private CourtRepository courtRepository;

    // CREATE
    public CourtCategory createCategory(CourtCategoryRequestDTO req) {

        courtCategoryRepository.findByName(req.getName())
                .ifPresent(c -> {
                    throw new RuntimeException("Danh mục đã tồn tại");
                });

        CourtCategory category = new CourtCategory();
        category.setName(req.getName());
        category.setDescription(req.getDescription());
        category.setIsActive(true);

        return courtCategoryRepository.save(category);
    }

    // READ ALL
    public List<CourtCategory> getAllCategories() {
        return courtCategoryRepository.findAll();
    }

    // UPDATE
    public CourtCategory updateCategory(Integer id, CourtCategoryRequestDTO req) {

        CourtCategory category = courtCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        category.setName(req.getName());
        category.setDescription(req.getDescription());

        if (req.getIsActive() != null) {
            category.setIsActive(req.getIsActive());
        }

        return courtCategoryRepository.save(category);
    }

    // DISABLE
    @Transactional
    public CourtCategory disableCategory(Integer id) {

        CourtCategory category = courtCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        category.setIsActive(false);
        List<Court> courts = courtRepository.findByCategoryId(id);
        for (Court c : courts) {
            c.setStatus(CourtStatus.INACTIVE);
        }

        return category;
    }

    // ENABLE
    @Transactional
    public CourtCategory enableCategory(Integer id) {

        CourtCategory category = courtCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        category.setIsActive(true);
        List<Court> courts = courtRepository.findByCategoryId(id);
        for (Court c : courts) {
            c.setStatus(CourtStatus.ACTIVE);
        }

        return category;
    }

    //Delete
    public void deleteCategory(Integer id) {

        CourtCategory category = courtCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        boolean hasCourt = courtRepository.existsByCategoryId(id);

        if (hasCourt) {
            throw new RuntimeException("Không thể xóa vì còn sân thuộc danh mục này");
        }

        courtCategoryRepository.delete(category);
    }
}