package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.entity.Booking;
import com.example.sportsfacility_backend.entity.enums.BookingStatus;
import com.example.sportsfacility_backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

@Service
public class CompleteBookingService {

    private final BookingRepository bookingRepository;

    public CompleteBookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public void complete(Long id){

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // chỉ cho complete khi đã CHECKED_IN
        if(booking.getStatus() != BookingStatus.CHECKED_IN){
            throw new RuntimeException("Chỉ có thể hoàn thành khi đã checkin");
        }

        booking.setStatus(BookingStatus.COMPLETED);

        bookingRepository.save(booking);
    }
}