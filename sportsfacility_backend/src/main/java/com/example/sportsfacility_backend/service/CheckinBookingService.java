    package com.example.sportsfacility_backend.service;

    import com.example.sportsfacility_backend.entity.Booking;
    import com.example.sportsfacility_backend.entity.enums.BookingStatus;
    import com.example.sportsfacility_backend.repository.BookingRepository;
    import org.springframework.stereotype.Service;

    import java.time.Duration;
    import java.time.LocalDateTime;

    @Service
    public class CheckinBookingService {

        private final BookingRepository bookingRepository;

        public CheckinBookingService(BookingRepository bookingRepository) {
            this.bookingRepository = bookingRepository;
        }

        public void checkin(Long id){

            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

            // chỉ cho checkin khi đã CONFIRMED
            if(booking.getStatus() != BookingStatus.CONFIRMED){
                throw new RuntimeException("Booking chưa được xác nhận");
            }

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime bookingTime = booking.getBookingDateTime();

            long minutes = Duration.between(bookingTime, now).toMinutes();

            // chưa tới giờ
            if(minutes < 0){
                System.out.println(">>> CHUA TOI GIO <<<");
                throw new RuntimeException("Chưa tới giờ checkin");
            }

            // quá 30 phút → EXPIRED
            if(minutes > 30){
                booking.setStatus(BookingStatus.EXPIRED);
                bookingRepository.save(booking);
                throw new RuntimeException("Booking đã quá hạn checkin");
            }
            else {
                booking.setStatus(BookingStatus.CHECKED_IN);
            }

            bookingRepository.save(booking);
        }
    }