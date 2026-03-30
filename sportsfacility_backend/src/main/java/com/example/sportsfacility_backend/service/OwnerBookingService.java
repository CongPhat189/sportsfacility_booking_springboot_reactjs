package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.BookingRequest;
import com.example.sportsfacility_backend.dto.BookingResponse;
import com.example.sportsfacility_backend.entity.Booking;
import com.example.sportsfacility_backend.entity.enums.BookingStatus;
import com.example.sportsfacility_backend.repository.BookingRepository;
import com.example.sportsfacility_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OwnerBookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public OwnerBookingService(BookingRepository bookingRepository,
                               UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    // ================= GET CURRENT USER =================
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("User chưa đăng nhập");
        }

        String email;

        Object principal = auth.getPrincipal();

        // ✅ Nếu dùng UserDetails
        if (principal instanceof org.springframework.security.core.userdetails.User) {
            email = ((org.springframework.security.core.userdetails.User) principal).getUsername();
        }
        // ✅ Nếu bạn dùng custom User entity
        else if (principal instanceof com.example.sportsfacility_backend.entity.User) {
            email = ((com.example.sportsfacility_backend.entity.User) principal).getEmail();
        }
        // fallback
        else {
            email = auth.getName();
        }

        System.out.println("🔥 Current user email: " + email);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"))
                .getId();
    }

    // ================= CHECK OWNER =================
    private Booking getBookingAndCheckOwner(Long id) {
        Long ownerId = getCurrentUserId();

        Booking booking = bookingRepository.findByIdWithCourtAndOwner(id);

        if (booking == null) {
            throw new RuntimeException("Booking không tồn tại");
        }

        if (!booking.getCourt().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Bạn không có quyền thao tác booking này");
        }

        return booking;
    }

    // ================= GET ALL =================
    public List<BookingResponse> getAllBookings() {

        Long ownerId = getCurrentUserId();

        return bookingRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ================= GET BY ID =================
    public BookingResponse getBookingById(Long id) {
        return mapToResponse(getBookingAndCheckOwner(id));
    }

    // ================= UPDATE =================
    public BookingResponse updateBooking(Long id, BookingRequest request) {

        Booking booking = getBookingAndCheckOwner(id);

        if (request.getStatus() != null) {
            booking.setStatus(request.getStatus());
        }

        if (request.getCancelReason() != null) {
            booking.setCancelReason(request.getCancelReason());
        }

        bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    // ================= DELETE =================
    public void deleteBooking(Long id) {
        Booking booking = getBookingAndCheckOwner(id);
        bookingRepository.delete(booking);
    }

    // ================= CONFIRM =================
    public BookingResponse confirmBooking(Long id) {

        Booking booking = getBookingAndCheckOwner(id);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể xác nhận khi booking đang PENDING");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    // ================= REJECT =================
    public BookingResponse rejectBooking(Long id) {

        Booking booking = getBookingAndCheckOwner(id);

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Chỉ có thể từ chối khi booking đang CONFIRMED");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    // ================= MAP =================
    private BookingResponse mapToResponse(Booking booking) {

        return new BookingResponse(
                booking.getId(),
                booking.getCourt().getId(),
                booking.getSchedule().getId(),
                booking.getStatus().name(),              // ✅ status đúng vị trí
                booking.getTotalAmount(),
                booking.getDepositAmount(),
                booking.getBookingDateTime(),
                booking.getCancelReason(),
                booking.getCustomer().getFullName(),
                booking.getCourt().getName()             // ✅ courtName để cuối
        );
    }
}