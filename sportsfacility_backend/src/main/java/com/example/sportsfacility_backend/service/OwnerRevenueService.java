package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.RevenueItemDTO;
import com.example.sportsfacility_backend.dto.RevenueResponseDTO;
import com.example.sportsfacility_backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OwnerRevenueService {

    private final BookingRepository bookingRepository;

    public OwnerRevenueService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public RevenueResponseDTO getRevenue(Long ownerId, int year, Integer month) {

        // 1. Dữ liệu tổng hợp doanh thu
        List<Object[]> result = bookingRepository.getOwnerRevenueSeparate(ownerId, year, month);
        RevenueItemDTO completed, cancelled, expired;

        if (result.isEmpty() || result.get(0) == null || result.get(0)[0] == null) {
            completed = new RevenueItemDTO(0L, 0.0, 0.0);
            cancelled = new RevenueItemDTO(0L, 0.0, 0.0);
            expired = new RevenueItemDTO(0L, 0.0, 0.0);
        } else {
            Object[] r = result.get(0);
            completed = new RevenueItemDTO(toLong(r[0]), toDouble(r[1]), toDouble(r[2]));
            cancelled = new RevenueItemDTO(toLong(r[3]), toDouble(r[4]), toDouble(r[5]));
            expired   = new RevenueItemDTO(toLong(r[6]), toDouble(r[7]), toDouble(r[8]));
        }

        // 2. Thống kê Sân (Duyệt toàn bộ list)
        List<RevenueResponseDTO.TopItemDTO> courtStats = new ArrayList<>();
        List<Object[]> courtRes = bookingRepository.findAllCourtsStat(ownerId, year, month);
        for (Object[] row : courtRes) {
            courtStats.add(new RevenueResponseDTO.TopItemDTO(
                    String.valueOf(row[0]),
                    toLong(row[1])
            ));
        }

        // 3. Thống kê Khung giờ (Duyệt toàn bộ list)
        List<RevenueResponseDTO.TopSlotDTO> slotStats = new ArrayList<>();
        List<Object[]> slotRes = bookingRepository.findAllSlotsStat(ownerId, year, month);
        for (Object[] row : slotRes) {
            String timeRange = row[0] + " - " + row[1];
            slotStats.add(new RevenueResponseDTO.TopSlotDTO(timeRange, toLong(row[2])));
        }

        return new RevenueResponseDTO(completed, cancelled, expired, courtStats, slotStats);
    }

    private Double toDouble(Object o) {
        return o == null ? 0.0 : ((Number) o).doubleValue();
    }

    private Long toLong(Object o) {
        return o == null ? 0L : ((Number) o).longValue();
    }
}