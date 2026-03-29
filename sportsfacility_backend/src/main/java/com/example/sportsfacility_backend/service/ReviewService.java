package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.dto.ReviewRequestDTO;
import com.example.sportsfacility_backend.dto.ReviewResponseDTO;
import com.example.sportsfacility_backend.entity.Booking;
import com.example.sportsfacility_backend.entity.Review;
import com.example.sportsfacility_backend.entity.enums.BookingStatus;
import com.example.sportsfacility_backend.repository.BookingRepository;
import com.example.sportsfacility_backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private BookingRepository bookingRepository;

    @Transactional
    public ReviewResponseDTO submitReview(ReviewRequestDTO req, String customerEmail) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));

        if (!booking.getCustomer().getEmail().equals(customerEmail))
            throw new RuntimeException("Bạn không có quyền đánh giá booking này");

        if (booking.getStatus() != BookingStatus.COMPLETED)
            throw new RuntimeException("Chỉ có thể đánh giá sau khi hoàn thành");

        if (reviewRepository.existsByBookingId(req.getBookingId()))
            throw new RuntimeException("Bạn đã đánh giá booking này rồi");

        Review review = new Review();
        review.setBooking(booking);
        review.setCustomer(booking.getCustomer());
        review.setCourt(booking.getCourt());
        review.setRating(req.getRating());
        review.setComment(req.getComment());

        return new ReviewResponseDTO(reviewRepository.save(review));
    }

    @Transactional
    public Optional<ReviewResponseDTO> getReviewByBookingId(Long bookingId) {
        return reviewRepository.findByBookingId(bookingId)
                .map(ReviewResponseDTO::new);
    }

    @Transactional
    public List<ReviewResponseDTO> getReviewsByCourtId(Long courtId) {
        return reviewRepository.findByCourtIdOrderByCreatedAtDesc(courtId)
                .stream()
                .map(ReviewResponseDTO::new)
                .toList();
    }
}
