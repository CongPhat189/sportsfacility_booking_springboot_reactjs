package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.CourtResponseDTO;
import com.example.sportsfacility_backend.service.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courts")
public class CourtController {

    @Autowired
    private CourtService courtService;

    @GetMapping("/search")
    public ResponseEntity<List<CourtResponseDTO>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId) {
        return ResponseEntity.ok(courtService.searchCourts(keyword, categoryId));
    }
}
