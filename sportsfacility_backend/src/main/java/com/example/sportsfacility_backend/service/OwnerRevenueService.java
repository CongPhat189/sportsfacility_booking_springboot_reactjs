package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.RevenueResponseDTO;
import com.example.sportsfacility_backend.entity.enums.BookingStatus;
import com.example.sportsfacility_backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class OwnerRevenueService {

    private final BookingRepository bookingRepository;

    public OwnerRevenueService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public RevenueResponseDTO getRevenue(Long ownerId, int year, Integer month) {

        LocalDateTime startDate;
        LocalDateTime endDate;

        if (month != null) {
            startDate = LocalDateTime.of(year, month, 1, 0, 0, 0);
            endDate = startDate.plusMonths(1);
        } else {
            startDate = LocalDateTime.of(year, 1, 1, 0, 0, 0);
            endDate = startDate.plusYears(1);
        }

        // Lấy dữ liệu từ repository
        List<Object[]> results = bookingRepository.getOwnerRevenueByPeriod(
                ownerId, BookingStatus.COMPLETED, startDate, endDate
        );

        // Lấy kết quả đầu tiên (aggregate luôn trả 1 row)
        Object[] result = results.isEmpty() ? new Object[]{0L, 0.0, 0.0} : results.get(0);

        // ==== Thêm log debug ở đây ====
        System.out.println("Owner revenue result: " + Arrays.toString(result));
        // =================================

        // Chuyển đổi kết quả
        Long totalBookings = result[0] != null ? ((Number) result[0]).longValue() : 0L;
        Double totalAmount = result[1] != null ? ((Number) result[1]).doubleValue() : 0.0;
        Double revenueAfterCommission = result[2] != null ? ((Number) result[2]).doubleValue() : 0.0;

        return new RevenueResponseDTO(totalBookings, totalAmount, revenueAfterCommission);
    }
}