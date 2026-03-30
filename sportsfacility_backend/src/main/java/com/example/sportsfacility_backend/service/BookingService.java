package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.BookingRequestDTO;
import com.example.sportsfacility_backend.dto.BookingResponseDTO;
import com.example.sportsfacility_backend.dto.CancelBookingRequest;
import com.example.sportsfacility_backend.dto.CancelBookingResponse;
import com.example.sportsfacility_backend.dto.ScheduleResponseDTO;
import com.example.sportsfacility_backend.dto.TimeRangeDTO;
import com.example.sportsfacility_backend.entity.Booking;
import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.CourtSchedule;
import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.entity.enums.BookingStatus;
import com.example.sportsfacility_backend.repository.BookingRepository;
import com.example.sportsfacility_backend.repository.CourtRepository;
import com.example.sportsfacility_backend.repository.CourtScheduleRepository;
import com.example.sportsfacility_backend.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
        Byte dayOfWeek = (byte) (date.getDayOfWeek().getValue() % 7);
        List<CourtSchedule> slots = scheduleRepository.findAllActiveSlots(courtId, dayOfWeek);

        return slots.stream().map(slot -> {
            List<Booking> bookings = bookingRepository.findBookingsInSlot(courtId, date, slot.getId());
            List<TimeRangeDTO> bookedRanges = bookings.stream()
                    .map(b -> new TimeRangeDTO(b.getStartTime(), b.getEndTime()))
                    .toList();
            return new ScheduleResponseDTO(slot, bookedRanges);
        }).toList();
    }


    @Transactional(isolation = Isolation.SERIALIZABLE)
    public BookingResponseDTO createBooking(BookingRequestDTO req, String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Court court = courtRepository.findById(req.getCourtId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân"));

        LocalTime startTime = req.getStartTime();
        LocalTime endTime = req.getEndTime();

        if (!endTime.isAfter(startTime)) {
            throw new RuntimeException("Giờ kết thúc phải sau giờ bắt đầu");
        }

        // Tìm khung giờ của owner bao phủ khoảng giờ customer chọn
        Byte dayOfWeek = (byte) (req.getDate().getDayOfWeek().getValue() % 7);
        CourtSchedule schedule = scheduleRepository
                .findCoveringSlot(req.getCourtId(), dayOfWeek, startTime, endTime)
                .orElseThrow(() -> new RuntimeException("Khoảng giờ không hợp lệ hoặc chưa được cấu hình"));

        // Kiểm tra trùng lịch
        boolean overlap = bookingRepository.hasTimeOverlap(req.getCourtId(), req.getDate(), startTime, endTime);
        if (overlap) {
            throw new RuntimeException("Khoảng giờ này đã có người đặt");
        }

        // Tính tiền: số giờ × giá/giờ của khung
        long minutes = java.time.temporal.ChronoUnit.MINUTES.between(startTime, endTime);
        double hours = minutes / 60.0;
        BigDecimal totalAmount = schedule.getPrice().multiply(BigDecimal.valueOf(hours));
        BigDecimal depositAmount = totalAmount.multiply(new BigDecimal("0.5"));

        // Tạo booking
        LocalDateTime bookingDateTime = req.getDate().atTime(startTime);

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setCourt(court);
        booking.setSchedule(schedule);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setBookingDateTime(bookingDateTime);
        booking.setTotalAmount(totalAmount);
        booking.setDepositAmount(depositAmount);
        booking.setNote(req.getNote());

        Booking savedBooking = bookingRepository.save(booking);

        // Gửi mail
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");
        String formattedTime = savedBooking.getBookingDateTime().format(timeFormatter);
        NumberFormat currency = NumberFormat.getInstance(new Locale("vi", "VN"));
        String formattedMoney = currency.format(savedBooking.getTotalAmount());

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
        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.EXPIRED) {
            throw new RuntimeException("Booking này đã bị hủy trước đó");
        }


        BookingStatus originalStatus = booking.getStatus();
        booking.setCancelReason(req.getCancelReason());

        String message;
        boolean refundEligible = false;
        BookingStatus newStatus;

        if (originalStatus == BookingStatus.PENDING) {
            newStatus = BookingStatus.CANCELLED;
            message = "Hủy thành công. Bạn chưa thanh toán nên không mất phí.";
        } else {
            boolean within24h = LocalDateTime.now()
                    .isBefore(booking.getCreatedAt().plusHours(24));
            if (within24h) {
                newStatus = BookingStatus.CANCELLED;
                refundEligible = true;
                booking.setRefundBankName(req.getBankName());
                booking.setRefundAccountNumber(req.getAccountNumber());
                booking.setRefundAccountHolder(req.getAccountHolder());
                message = "Hủy thành công. Tiền cọc sẽ được hoàn trả đầy đủ trong 3-5 ngày làm việc.";
            } else {
                newStatus = BookingStatus.EXPIRED;
                message = "Hủy thành công. Tiền cọc không được hoàn do quá thời gian quy định.";
            }
        }

        booking.setStatus(newStatus);
        bookingRepository.save(booking);

        return new CancelBookingResponse(bookingId, newStatus, refundEligible, message);


    }

    @Transactional
    public List<BookingResponseDTO> getBookingHistory(String customerEmail) {
        return bookingRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail)
                .stream()
                .map(BookingResponseDTO::new)
                .toList();
    }
}
