package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.RevenueItemDTO;
import com.example.sportsfacility_backend.dto.RevenueResponseDTO;
import com.example.sportsfacility_backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class OwnerRevenueService {

    private final BookingRepository bookingRepository;

    public OwnerRevenueService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public RevenueResponseDTO getRevenue(Long ownerId, int year, Integer month) {
        // 1. Lấy dữ liệu tài chính
        List<Object[]> result = bookingRepository.getOwnerRevenueSeparate(ownerId, year, month);

        RevenueItemDTO completed, cancelled, expired;

        if (result.isEmpty() || result.get(0)[0] == null && result.get(0)[3] == null) {
            completed = new RevenueItemDTO(0L, 0.0, 0.0);
            cancelled = new RevenueItemDTO(0L, 0.0, 0.0);
            expired = new RevenueItemDTO(0L, 0.0, 0.0);
        } else {
            Object[] r = result.get(0);
            completed = new RevenueItemDTO(toLong(r[0]), toDouble(r[1]), toDouble(r[2]));
            cancelled = new RevenueItemDTO(toLong(r[3]), toDouble(r[4]), toDouble(r[5]));
            expired = new RevenueItemDTO(toLong(r[6]), toDouble(r[7]), toDouble(r[8]));
        }

        // 2. Lấy sân được đặt nhiều nhất
        RevenueResponseDTO.TopItemDTO topCourt = null;
        List<Object[]> courtRes = bookingRepository.findTopCourt(ownerId, year, month);
        if (!courtRes.isEmpty()) {
            topCourt = new RevenueResponseDTO.TopItemDTO(
                    String.valueOf(courtRes.get(0)[0]),
                    toLong(courtRes.get(0)[1])
            );
        }

        // 3. Lấy khung giờ được đặt nhiều nhất
        RevenueResponseDTO.TopSlotDTO topSlot = null;
        List<Object[]> slotRes = bookingRepository.findTopSlot(ownerId, year, month);

        if (!slotRes.isEmpty()) {
            Object[] row = slotRes.get(0);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

            String startStr = "00:00";
            String endStr = "00:00";

            // Xử lý an toàn cho startTime (row[0])
            if (row[0] instanceof Time sqlTime) {
                startStr = sqlTime.toLocalTime().format(formatter);
            } else if (row[0] instanceof LocalTime lt) {
                startStr = lt.format(formatter);
            }

            // Xử lý an toàn cho endTime (row[1])
            if (row[1] instanceof Time sqlTime) {
                endStr = sqlTime.toLocalTime().format(formatter);
            } else if (row[1] instanceof LocalTime lt) {
                endStr = lt.format(formatter);
            }

            topSlot = new RevenueResponseDTO.TopSlotDTO(startStr + " - " + endStr, toLong(row[2]));
        }

        return new RevenueResponseDTO(completed, cancelled, expired, topCourt, topSlot);
    }

    private Double toDouble(Object o) {
        return o == null ? 0.0 : ((Number) o).doubleValue();
    }

    private Long toLong(Object o) {
        return o == null ? 0L : ((Number) o).longValue();
    }
}