package com.example.sportsfacility_backend.service;


import com.example.sportsfacility_backend.dto.BookingPieDTO;
import com.example.sportsfacility_backend.dto.RevenueBarDTO;
import com.example.sportsfacility_backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminReportService {

    @Autowired
    private BookingRepository bookingRepository;

    // ===== PIE =====
    public BookingPieDTO getBookingPie(int month, int year) {
        return bookingRepository.getBookingPie(month, year);
    }

    // ===== BAR =====
    public List<RevenueBarDTO> getRevenue3Months(int month, int year) {

        List<Object[]> results = bookingRepository.getRevenueLast3Months(month, year);

        // Map kết quả từ DB
        Map<String, BigDecimal> revenueMap = new HashMap<>();

        for (Object[] row : results) {
            int m = ((Number) row[0]).intValue();
            int y = ((Number) row[1]).intValue();
            BigDecimal revenue = row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO;

            revenueMap.put(m + "/" + y, revenue);
        }

        // 3 tháng gần nhất
        List<RevenueBarDTO> list = new ArrayList<>();

        for (int i = 2; i >= 0; i--) {
            int m = month - i;
            int y = year;

            if (m <= 0) {
                m += 12;
                y -= 1;
            }

            String key = m + "/" + y;

            list.add(new RevenueBarDTO(
                    key,
                    revenueMap.getOrDefault(key, BigDecimal.ZERO)
            ));
        }

        return list;
    }
}