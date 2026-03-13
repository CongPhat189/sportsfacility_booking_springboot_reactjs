package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.BookingRequest;
import com.example.sportsfacility_backend.dto.BookingResponse;
import com.example.sportsfacility_backend.entity.Booking;
import com.example.sportsfacility_backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OwnerBookingService {

    private final BookingRepository bookingRepository;

    public OwnerBookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // GET ALL
    public List<BookingResponse> getAllBookings(){

        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public BookingResponse getBookingById(Long id){

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        return mapToResponse(booking);
    }

    // UPDATE STATUS
    public BookingResponse updateBooking(Long id, BookingRequest request){

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        if(request.getStatus() != null){
            booking.setStatus(request.getStatus());
        }

        if(request.getCancelReason() != null){
            booking.setCancelReason(request.getCancelReason());
        }

        bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    // DELETE
    public void deleteBooking(Long id){

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        bookingRepository.delete(booking);
    }

    // MAP ENTITY -> DTO
    private BookingResponse mapToResponse(Booking booking){

        return new BookingResponse(
                booking.getId(),
                booking.getCourt().getId(),
                booking.getSchedule().getId(),
                booking.getStatus().name(),
                booking.getTotalAmount(),
                booking.getDepositAmount(),
                booking.getBookingDateTime(),
                booking.getCancelReason()
        );
    }
}