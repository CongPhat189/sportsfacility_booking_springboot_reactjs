package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.RevenueItemDTO;
import com.example.sportsfacility_backend.dto.RevenueResponseDTO;
import com.example.sportsfacility_backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerRevenueService {

    private final BookingRepository bookingRepository;

    public OwnerRevenueService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public RevenueResponseDTO getRevenue(Long ownerId, int year, Integer month){

        List<Object[]> result = bookingRepository.getOwnerRevenueSeparate(ownerId, year, month);

        if(result.isEmpty()){
            return new RevenueResponseDTO(
                    new RevenueItemDTO(0L, 0.0, 0.0),
                    new RevenueItemDTO(0L, 0.0, 0.0),
                    new RevenueItemDTO(0L, 0.0, 0.0)
            );
        }

        Object[] r = result.get(0);

        RevenueItemDTO completed = new RevenueItemDTO(
                toLong(r[0]),
                toDouble(r[1]),
                toDouble(r[2])
        );

        RevenueItemDTO cancelled = new RevenueItemDTO(
                toLong(r[3]),
                toDouble(r[4]),
                toDouble(r[5])
        );

        RevenueItemDTO expired = new RevenueItemDTO(
                toLong(r[6]),
                toDouble(r[7]),
                toDouble(r[8])
        );

        return new RevenueResponseDTO(completed, cancelled, expired);
    }

    // 🔥 tránh null + lỗi cast
    private Double toDouble(Object o){
        return o == null ? 0.0 : ((Number) o).doubleValue();
    }

    private Long toLong(Object o){
        return o == null ? 0L : ((Number) o).longValue();
    }
}