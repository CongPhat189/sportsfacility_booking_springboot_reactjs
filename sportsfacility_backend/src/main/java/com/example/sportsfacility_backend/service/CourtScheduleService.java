package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.CourtScheduleRequest;
import com.example.sportsfacility_backend.dto.CourtScheduleResponse;
import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.CourtSchedule;
import com.example.sportsfacility_backend.repository.CourtRepository;
import com.example.sportsfacility_backend.repository.CourtScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourtScheduleService {

    @Autowired
    private CourtScheduleRepository scheduleRepository;

    @Autowired
    private CourtRepository courtRepository;

    public CourtScheduleResponse create(CourtScheduleRequest request){

        Court court = courtRepository.findById(request.getCourtId())
                .orElseThrow(() -> new RuntimeException("Court không tồn tại"));

        CourtSchedule schedule = new CourtSchedule();
        schedule.setCourt(court);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setPrice(request.getPrice());
        schedule.setIsActive(request.getIsActive());

        scheduleRepository.save(schedule);

        return new CourtScheduleResponse(
                schedule.getId(),
                court.getId(),
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getPrice(),
                schedule.getIsActive()
        );
    }

    public List<CourtScheduleResponse> getAll(){
        return scheduleRepository.findAll().stream()
                .map(s -> new CourtScheduleResponse(
                        s.getId(),
                        s.getCourt().getId(),
                        s.getDayOfWeek(),
                        s.getStartTime(),
                        s.getEndTime(),
                        s.getPrice(),
                        s.getIsActive()
                ))
                .collect(Collectors.toList());
    }

    public CourtScheduleResponse update(Long id, CourtScheduleRequest request){

        CourtSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule không tồn tại"));

        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setPrice(request.getPrice());
        schedule.setIsActive(request.getIsActive());

        scheduleRepository.save(schedule);

        return new CourtScheduleResponse(
                schedule.getId(),
                schedule.getCourt().getId(),
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getPrice(),
                schedule.getIsActive()
        );
    }

    public void delete(Long id){
        scheduleRepository.deleteById(id);
    }
}