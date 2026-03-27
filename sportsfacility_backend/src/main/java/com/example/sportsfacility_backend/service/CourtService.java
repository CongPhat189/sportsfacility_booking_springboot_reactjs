package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.CourtRequest;
import com.example.sportsfacility_backend.dto.CourtResponse;
import com.example.sportsfacility_backend.dto.CourtResponseDTO;
import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.CourtCategory;
import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import com.example.sportsfacility_backend.repository.CourtCategoryRepository;
import com.example.sportsfacility_backend.repository.CourtRepository;
import com.example.sportsfacility_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourtService {

    @Autowired
    private CourtRepository courtRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourtCategoryRepository categoryRepository;


    @Transactional
    public List<CourtResponseDTO> searchCourts(String keyword, Integer categoryId) {
        return courtRepository.search(keyword, categoryId, CourtStatus.ACTIVE)
                .stream()
                .map(CourtResponseDTO::new)
                .toList();
    }

    // ================= CREATE =================
    public CourtResponse createCourt(CourtRequest request, String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner không tồn tại"));

        CourtCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category không tồn tại"));

        Court court = new Court();
        court.setOwner(owner);
        court.setCategory(category);
        court.setName(request.getName());
        court.setAddress(request.getAddress());
        court.setDescription(request.getDescription());
        court.setImageUrl(request.getImageUrl());
        court.setStatus(CourtStatus.PENDING);

        courtRepository.save(court);

        return new CourtResponse(
                court.getId(),
                court.getName(),
                court.getAddress(),
                court.getDescription(),
                court.getImageUrl(),
                court.getStatus().name(),
                court.getCategory().getId(),
                court.getCategory().getName()
        );
    }

    // ================= GET ALL =================
    public List<CourtResponse> getAllCourts() {
        return courtRepository.findAll()
                .stream()
                .map(c -> new CourtResponse(
                        c.getId(),
                        c.getName(),
                        c.getAddress(),
                        c.getDescription(),
                        c.getImageUrl(),
                        c.getStatus().name(),
                        c.getCategory().getId(),
                        c.getCategory().getName()
                ))
                .collect(Collectors.toList());
    }

    // ================= DELETE =================
    public void deleteCourt(Long id) {
        courtRepository.deleteById(id);
    }

    // ================= GET BY ID =================
    public CourtResponse getCourtById(Long id){

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court không tồn tại"));

        return new CourtResponse(
                court.getId(),
                court.getName(),
                court.getAddress(),
                court.getDescription(),
                court.getImageUrl(),
                court.getStatus().name(),
                court.getCategory().getId(),
                court.getCategory().getName()
        );
    }

    // ================= UPDATE =================
    public CourtResponse updateCourt(Long id, CourtRequest request) {

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court không tồn tại"));

        CourtCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category không tồn tại"));

        court.setCategory(category);
        court.setName(request.getName());
        court.setAddress(request.getAddress());
        court.setDescription(request.getDescription());
        court.setImageUrl(request.getImageUrl());

        court.setStatus(CourtStatus.PENDING);

        courtRepository.save(court);

        return new CourtResponse(
                court.getId(),
                court.getName(),
                court.getAddress(),
                court.getDescription(),
                court.getImageUrl(),
                court.getStatus().name(),
                court.getCategory().getId(),
                court.getCategory().getName()
        );
    }

    // ================= GET BY OWNER =================
    public List<CourtResponse> getCourtsByOwner(String email){

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner không tồn tại"));

        return courtRepository.findByOwnerId(owner.getId())
                .stream()
                .map(c -> new CourtResponse(
                        c.getId(),
                        c.getName(),
                        c.getAddress(),
                        c.getDescription(),
                        c.getImageUrl(),
                        c.getStatus().name(),
                        c.getCategory().getId(),
                        c.getCategory().getName()
                ))
                .collect(Collectors.toList());
    }
}