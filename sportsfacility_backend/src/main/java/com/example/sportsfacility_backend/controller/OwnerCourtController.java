package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.CourtRequest;
import com.example.sportsfacility_backend.dto.CourtResponse;
import com.example.sportsfacility_backend.service.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner/courts")
public class OwnerCourtController {

    @Autowired
    private CourtService courtService;

    // API test
    @PostMapping("/test")
    public String test(){
        return "POST OK";
    }

    // tạo sân
    @PostMapping
    public ResponseEntity<CourtResponse> createCourt(@RequestBody CourtRequest request){
        return ResponseEntity.ok(courtService.createCourt(request));
    }

    // lấy danh sách sân
    @GetMapping
    public ResponseEntity<List<CourtResponse>> getAllCourts(){
        return ResponseEntity.ok(courtService.getAllCourts());
    }

    // lấy chi tiết sân
    @GetMapping("/{id}")
    public ResponseEntity<CourtResponse> getCourt(@PathVariable Long id){
        return ResponseEntity.ok(courtService.getCourtById(id));
    }

    // update sân
    @PutMapping("/{id}")
    public ResponseEntity<CourtResponse> updateCourt(
            @PathVariable Long id,
            @RequestBody CourtRequest request){

        return ResponseEntity.ok(courtService.updateCourt(id, request));
    }

    // xoá sân
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourt(@PathVariable Long id){
        courtService.deleteCourt(id);
        return ResponseEntity.ok("Court deleted successfully");
    }
}