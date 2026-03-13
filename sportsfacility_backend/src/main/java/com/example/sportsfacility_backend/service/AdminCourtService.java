package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.CourtResponseDTO;
import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import com.example.sportsfacility_backend.repository.CourtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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