package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import com.example.sportsfacility_backend.repository.CourtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminCourtService {

    @Autowired
    private CourtRepository courtRepository;

    // Lấy danh sách sân pending
    public List<Court> getPendingCourts() {
        return courtRepository.findByStatus(CourtStatus.PENDING);
    }

    // Duyệt sân
    public Court approveCourt(Integer id) {

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân"));

        court.setStatus(CourtStatus.ACTIVE);

        return courtRepository.save(court);
    }

    // Từ chối sân
    public Court rejectCourt(Integer id, String reason) {

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân"));

        court.setStatus(CourtStatus.REJECTED);
        court.setRejectReason(reason);

        return courtRepository.save(court);
    }

}