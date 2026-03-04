package com.example.sportsfacility_backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    // 1–5 sao
    @Column(nullable = false)
    private Byte rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ==================== Constructors ====================

    public Review() {}

    public Review(Long id, Booking booking, User customer, Court court,
                  Byte rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.booking = booking;
        this.customer = customer;
        this.court = court;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    // ==================== Getters ====================

    public Long getId() { return id; }

    public Booking getBooking() { return booking; }

    public User getCustomer() { return customer; }

    public Court getCourt() { return court; }

    public Byte getRating() { return rating; }

    public String getComment() { return comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    // ==================== Setters ====================

    public void setId(Long id) { this.id = id; }

    public void setBooking(Booking booking) { this.booking = booking; }

    public void setCustomer(User customer) { this.customer = customer; }

    public void setCourt(Court court) { this.court = court; }

    public void setRating(Byte rating) { this.rating = rating; }

    public void setComment(String comment) { this.comment = comment; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
