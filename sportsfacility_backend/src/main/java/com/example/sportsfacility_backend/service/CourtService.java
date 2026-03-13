package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.CourtRequest;
import com.example.sportsfacility_backend.dto.CourtResponse;
import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.CourtCategory;
import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import com.example.sportsfacility_backend.repository.CourtCategoryRepository;
import com.example.sportsfacility_backend.repository.CourtRepository;
import com.example.sportsfacility_backend.repository.UserRepository;
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

    public CourtResponse createCourt(CourtRequest request) {

        User owner = userRepository.findById(request.getOwnerId())
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
                court.getStatus().name()
        );
    }

    public List<CourtResponse> getAllCourts() {
        return courtRepository.findAll()
                .stream()
                .map(c -> new CourtResponse(
                        c.getId(),
                        c.getName(),
                        c.getAddress(),
                        c.getDescription(),
                        c.getImageUrl(),
                        c.getStatus().name()
                ))
                .collect(Collectors.toList());
    }

    public void deleteCourt(Long id) {
        courtRepository.deleteById(id);
    }
    public CourtResponse getCourtById(Long id){

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court không tồn tại"));

        return new CourtResponse(
                court.getId(),
                court.getName(),
                court.getAddress(),
                court.getDescription(),
                court.getImageUrl(),
                court.getStatus().name()
        );
    }
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

        courtRepository.save(court);

        return new CourtResponse(
                court.getId(),
                court.getName(),
                court.getAddress(),
                court.getDescription(),
                court.getImageUrl(),
                court.getStatus().name()
        );
    }
}