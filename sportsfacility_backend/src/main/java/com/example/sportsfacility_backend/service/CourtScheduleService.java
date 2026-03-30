package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.CourtScheduleRequest;
import com.example.sportsfacility_backend.dto.CourtScheduleResponse;
import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.CourtSchedule;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import com.example.sportsfacility_backend.repository.CourtRepository;
import com.example.sportsfacility_backend.repository.CourtScheduleRepository;
import com.example.sportsfacility_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourtScheduleService {

    @Autowired
    private CourtScheduleRepository scheduleRepository;

    @Autowired
    private CourtRepository courtRepository;

    @Autowired
    private UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User chưa đăng nhập");
        }

        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"))
                .getId();
    }

    // ================= VALIDATE TIME =================
    private void validateTime(
            Court court,
            Byte dayOfWeek,
            LocalTime start,
            LocalTime end,
            Long ignoreId
    ) {

        // end > start
        if (!end.isAfter(start)) {
            throw new RuntimeException("Giờ kết thúc phải lớn hơn giờ bắt đầu");
        }

        // convert Java day (1-7) -> DB day (0-6)
        int todayJava = LocalDate.now().getDayOfWeek().getValue(); // 1-7
        byte today = (byte) (todayJava % 7); // convert -> 0-6

        // nếu là hôm nay -> không cho quá khứ
        if (dayOfWeek == today) {
            LocalTime now = LocalTime.now();
            if (start.isBefore(now)) {
                throw new RuntimeException("Không thể tạo lịch trong quá khứ");
            }
        }

        // check overlap
        List<CourtSchedule> schedules =
                scheduleRepository.findByCourtIdAndDayOfWeek(court.getId(), dayOfWeek);

        for (CourtSchedule s : schedules) {

            if (ignoreId != null && s.getId().equals(ignoreId))
                continue;

            if (start.isBefore(s.getEndTime()) && s.getStartTime().isBefore(end)) {
                throw new RuntimeException(
                        "Khung giờ bị trùng: "
                                + s.getStartTime()
                                + " - "
                                + s.getEndTime()
                );
            }
        }
    }

    // ================= CREATE =================
    public CourtScheduleResponse create(CourtScheduleRequest request){

        Long userId = getCurrentUserId();

        Court court = courtRepository.findByIdAndStatus(
                request.getCourtId(),
                CourtStatus.ACTIVE
        ).orElseThrow(() ->
                new RuntimeException("Court không tồn tại hoặc không ACTIVE"));

        if (!court.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền tạo schedule cho sân này");
        }

        // validate
        validateTime(
                court,
                request.getDayOfWeek(),
                request.getStartTime(),
                request.getEndTime(),
                null
        );

        CourtSchedule schedule = new CourtSchedule();
        schedule.setCourt(court);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setPrice(request.getPrice());
        schedule.setIsActive(request.getIsActive());

        scheduleRepository.save(schedule);

        return mapToResponse(schedule);
    }

    // ================= GET ALL =================
    public List<CourtScheduleResponse> getAll(){
        Long userId = getCurrentUserId();

        return scheduleRepository.findByOwnerIdWithCourt(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ================= UPDATE =================
    @Transactional
    public CourtScheduleResponse update(Long id, CourtScheduleRequest request){

        Long userId = getCurrentUserId();

        CourtSchedule schedule = scheduleRepository.findByIdWithCourtAndOwner(id)
                .orElseThrow(() -> new RuntimeException("Schedule không tồn tại"));

        if (!schedule.getCourt().getOwner().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật schedule này");
        }

        // validate
        validateTime(
                schedule.getCourt(),
                request.getDayOfWeek(),
                request.getStartTime(),
                request.getEndTime(),
                schedule.getId()
        );

        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setPrice(request.getPrice());
        schedule.setIsActive(request.getIsActive());

        return mapToResponse(scheduleRepository.save(schedule));
    }

    // ================= DELETE =================
    public void delete(Long id){

        Long userId = getCurrentUserId();

        CourtSchedule schedule = scheduleRepository.findByIdWithCourtAndOwner(id)
                .orElseThrow(() -> new RuntimeException("Schedule không tồn tại"));

        if (!schedule.getCourt().getOwner().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa schedule này");
        }

        scheduleRepository.deleteById(id);
    }

    // ================= MAP =================
    private CourtScheduleResponse mapToResponse(CourtSchedule schedule){
        return new CourtScheduleResponse(
                schedule.getId(),
                schedule.getCourt().getId(),
                schedule.getCourt().getName(),
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getPrice(),
                schedule.getIsActive()
        );
    }
}