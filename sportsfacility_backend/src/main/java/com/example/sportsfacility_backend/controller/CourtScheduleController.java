package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.CourtScheduleRequest;
import com.example.sportsfacility_backend.dto.CourtScheduleResponse;
import com.example.sportsfacility_backend.service.CourtScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner/schedules")
public class CourtScheduleController {

    @Autowired
    private CourtScheduleService scheduleService;

    @PostMapping
    public CourtScheduleResponse create(@RequestBody CourtScheduleRequest request){
        return scheduleService.create(request);
    }

    @GetMapping
    public List<CourtScheduleResponse> getAll(){
        return scheduleService.getAll();
    }

    @PutMapping("/{id}")
    public CourtScheduleResponse update(
            @PathVariable Long id,
            @RequestBody CourtScheduleRequest request){
        return scheduleService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        scheduleService.delete(id);
        return "Deleted successfully";
    }
}