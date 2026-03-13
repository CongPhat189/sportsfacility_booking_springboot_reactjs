package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.CourtResponseDTO;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import com.example.sportsfacility_backend.repository.CourtRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourtService {

    @Autowired
    private CourtRepository courtRepository;

    @Transactional
    public List<CourtResponseDTO> searchCourts(String keyword, Integer categoryId) {
        return courtRepository.search(keyword, categoryId, CourtStatus.ACTIVE)
                .stream()
                .map(CourtResponseDTO::new)
                .toList();
    }
}
