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
import com.example.sportsfacility_backend.repository.ReviewRepository;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourtService {

    @Autowired
    private CourtRepository courtRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CourtCategoryRepository categoryRepository;

    // ================= SEARCH COURTS =================
    @Transactional
    public List<CourtResponseDTO> searchCourts(String keyword, Integer categoryId, String sortBy) {
        List<CourtResponseDTO> dtos = courtRepository.search(keyword, categoryId, CourtStatus.ACTIVE)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        if ("rating".equals(sortBy)) {
                dtos.sort(Comparator.comparingDouble(
                dto -> -(dto.getAverageRating() != null ? dto.getAverageRating() : 0.0)
                ));
        }
        return dtos;
        }


    private CourtResponseDTO toDTO(Court court) {
        Double avg = reviewRepository.getAverageRatingByCourtId(court.getId());
        Long count = reviewRepository.countByCourtId(court.getId());
        return new CourtResponseDTO(court, avg, count);
        }

        public List<CourtResponseDTO> getTopRatedCourts(int limit) {
        return courtRepository.findByStatus(CourtStatus.ACTIVE)
                .stream().map(this::toDTO)
                .sorted(Comparator.comparingDouble(
                dto -> -(dto.getAverageRating() != null ? dto.getAverageRating() : 0.0)
                ))
                .limit(limit)
                .collect(Collectors.toList());
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
        court.setRejectReason(null); // mặc định null khi tạo mới

        courtRepository.save(court);

        return mapToCourtResponse(court);
    }

    // ================= GET ALL =================
    public List<CourtResponse> getAllCourts() {
        return courtRepository.findAll()
                .stream()
                .map(this::mapToCourtResponse)
                .collect(Collectors.toList());
    }

    // ================= InActive =================
    @Transactional
    public CourtResponse deactivateCourt(Long id) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sân không tồn tại!"));

        court.setStatus(CourtStatus.INACTIVE);  // đổi status thành INACTIVE
        // save không bắt buộc trong transactional, Hibernate tự flush
        return mapToCourtResponse(court);
    }

    // ================= Active =================
    @Transactional
    public CourtResponse activateCourt(Long id) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sân không tồn tại!"));
        court.setStatus(CourtStatus.ACTIVE);
        return mapToCourtResponse(court);
    }

    // ================= GET BY ID =================
    public CourtResponse getCourtById(Long id) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court không tồn tại"));

        return mapToCourtResponse(court);
    }

    // ================= UPDATE =================
    public CourtResponse updateCourt(Long id, CourtRequest request) {

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court không tồn tại"));

        CourtCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category không tồn tại"));

        // Cập nhật thông tin cơ bản
        court.setCategory(category);
        court.setName(request.getName());
        court.setAddress(request.getAddress());
        court.setDescription(request.getDescription());
        court.setImageUrl(request.getImageUrl());

        // Nếu trạng thái hiện tại là REJECTED thì đổi thành PENDING
        if (court.getStatus() == CourtStatus.REJECTED) {
            court.setStatus(CourtStatus.PENDING);
            court.setRejectReason(null); // reset lý do bị từ chối
        }

        courtRepository.save(court);

        return mapToCourtResponse(court);
    }

    // ================= GET BY OWNER =================
    public List<CourtResponse> getCourtsByOwner(String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner không tồn tại"));

        return courtRepository.findByOwnerId(owner.getId())
                .stream()
                .map(this::mapToCourtResponse)
                .collect(Collectors.toList());
    }

    // ================= PRIVATE MAPPER =================
    private CourtResponse mapToCourtResponse(Court court) {
        return new CourtResponse(
                court.getId(),
                court.getName(),
                court.getAddress(),
                court.getDescription(),
                court.getImageUrl(),
                court.getStatus().name(),
                court.getCategory().getId(),
                court.getCategory().getName(),
                court.getRejectReason() // <-- thêm rejectReason
        );
    }

    @Transactional
    public CourtResponseDTO getCourtDTOById(Long id) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân"));
        return new CourtResponseDTO(court);
    }
}