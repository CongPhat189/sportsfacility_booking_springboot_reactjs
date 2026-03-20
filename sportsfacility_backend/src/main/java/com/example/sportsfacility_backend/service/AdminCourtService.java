package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.CourtResponseDTO;
import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import com.example.sportsfacility_backend.repository.CourtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminCourtService {

    @Autowired
    private CourtRepository courtRepository;

    // Lấy danh sách sân pending
    @Transactional(readOnly = true)
    public List<CourtResponseDTO> getPendingCourts() {

        return courtRepository
                .findByStatus(CourtStatus.PENDING)
                .stream()
                .map(CourtResponseDTO::new)
                .toList();
    }

    // Lấy danh sách sân active
    @Transactional(readOnly = true)
    public List<CourtResponseDTO> getActiveCourts() {
        return courtRepository
                .findByStatus(CourtStatus.ACTIVE)
                .stream()
                .map(CourtResponseDTO::new)
                .toList();
    }

    // Lấy chi tiết sân
    @Transactional(readOnly = true)
    public CourtResponseDTO getCourtDetails(Long id) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân"));

        return new CourtResponseDTO(court);
    }

    // Chỉnh sửa Commission
    @Transactional
    public CourtResponseDTO updateCommission(Long id, BigDecimal commission) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân"));

        court.setCommissionRate(commission);

        Court savedCourt = courtRepository.save(court);

        return new CourtResponseDTO(savedCourt);
    }

    // Duyệt sân
    @Transactional
    public CourtResponseDTO approveCourt(Long id) {

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân"));

        court.setStatus(CourtStatus.ACTIVE);

        Court savedCourt = courtRepository.save(court);

        return new CourtResponseDTO(savedCourt);
    }

    // Từ chối sân
    @Transactional
    public CourtResponseDTO rejectCourt(Long id, String reason) {

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân"));

        court.setStatus(CourtStatus.REJECTED);
        court.setRejectReason(reason);

        Court savedCourt = courtRepository.save(court);

        return new CourtResponseDTO(savedCourt);
    }
}