package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.BookingRequestDTO;
import com.example.sportsfacility_backend.dto.BookingResponseDTO;
import com.example.sportsfacility_backend.dto.CancelBookingRequest;
import com.example.sportsfacility_backend.dto.CancelBookingResponse;
import com.example.sportsfacility_backend.dto.ScheduleResponseDTO;
import com.example.sportsfacility_backend.entity.Booking;
import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.CourtSchedule;
import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.entity.enums.BookingStatus;
import com.example.sportsfacility_backend.repository.BookingRepository;
import com.example.sportsfacility_backend.repository.CourtRepository;
import com.example.sportsfacility_backend.repository.CourtScheduleRepository;
import com.example.sportsfacility_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class BookingService {

    @Autowired private CourtScheduleRepository scheduleRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private CourtRepository courtRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;

    @Transactional
    public List<ScheduleResponseDTO> getAvailableSlots(Long courtId, LocalDate date) {
        Byte dayOfWeek = (byte) (date.getDayOfWeek().getValue() % 7); // 1=Mon..6=Sat, 0=Sun
        return scheduleRepository.findAvailableSlots(courtId, dayOfWeek, date)
                .stream()
                .map(ScheduleResponseDTO::new)
                .toList();
    }

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO req, String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Court court = courtRepository.findById(req.getCourtId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân"));

        CourtSchedule schedule = scheduleRepository.findById(req.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch"));

        // check slot
        Byte dayOfWeek = (byte) (req.getDate().getDayOfWeek().getValue() % 7);

        boolean available = scheduleRepository
                .findAvailableSlots(req.getCourtId(), dayOfWeek, req.getDate())
                .stream()
                .anyMatch(s -> s.getId().equals(req.getScheduleId()));

        if (!available) {
            throw new RuntimeException("Khung giờ này đã được đặt");
        }

        // tạo booking
        LocalDateTime bookingDateTime = req.getDate().atTime(schedule.getStartTime());

        BigDecimal totalAmount = schedule.getPrice();
        BigDecimal depositAmount = totalAmount.multiply(new BigDecimal("0.5"));

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setCourt(court);
        booking.setSchedule(schedule);
        booking.setBookingDateTime(bookingDateTime);
        booking.setTotalAmount(totalAmount);
        booking.setDepositAmount(depositAmount);
        booking.setNote(req.getNote());


        Booking savedBooking = bookingRepository.save(booking);

        //FORMAT
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");
        String formattedTime = savedBooking.getBookingDateTime().format(timeFormatter);

        NumberFormat currency = NumberFormat.getInstance(new Locale("vi", "VN"));
        String formattedMoney = currency.format(savedBooking.getTotalAmount());

        // SEND MAIL SAFE
        try {
            emailService.sendBookingSuccessEmail(
                    savedBooking.getCustomer().getEmail(),
                    savedBooking.getCustomer().getFullName(),
                    savedBooking.getCourt().getName(),
                    formattedTime,
                    formattedMoney
            );
        } catch (Exception e) {
            System.out.println("Send mail failed: " + e.getMessage());
        }

        return new BookingResponseDTO(savedBooking);
    }

    @Transactional
    public CancelBookingResponse cancelBooking(Long bookingId, CancelBookingRequest req, String customerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));

        if (!booking.getCustomer().getEmail().equals(customerEmail)) {
            throw new RuntimeException("Bạn không có quyền hủy booking này");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking này đã bị hủy trước đó");
        }

        boolean refundEligible = LocalDateTime.now()
                .isBefore(booking.getBookingDateTime().minusHours(24));

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelReason(req.getCancelReason());

        if (refundEligible) {
            booking.setRefundBankName(req.getBankName());
            booking.setRefundAccountNumber(req.getAccountNumber());
            booking.setRefundAccountHolder(req.getAccountHolder());
        }

        bookingRepository.save(booking);

        String message = refundEligible
                ? "Hủy thành công. Tiền cọc sẽ được hoàn trả trong 3-5 ngày làm việc."
                : "Hủy thành công. Tiền cọc không được hoàn do hủy trong vòng 24 giờ.";

        return new CancelBookingResponse(bookingId, BookingStatus.CANCELLED, refundEligible, message);
    }

    @Transactional
    public List<BookingResponseDTO> getBookingHistory(String customerEmail) {
        return bookingRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail)
                .stream()
                .map(BookingResponseDTO::new)
                .toList();
    }
}
