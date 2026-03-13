package com.example.sportsfacility_backend.entity;

import com.example.sportsfacility_backend.entity.enums.CourtStatus;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "courts")
public class Court {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)

    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CourtCategory category;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "commission_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal commissionRate = new BigDecimal("10.00");

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private CourtStatus status = CourtStatus.PENDING;

    @Column(name = "reject_reason", columnDefinition = "TEXT")
    private String rejectReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ==================== Constructors ====================

    public Court() {}

    public Court(Long id, User owner, CourtCategory category, String name, String address,
                 String description, String imageUrl, BigDecimal commissionRate,
                 CourtStatus status, String rejectReason,
                 LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.owner = owner;
        this.category = category;
        this.name = name;
        this.address = address;
        this.description = description;
        this.imageUrl = imageUrl;
        this.commissionRate = commissionRate;
        this.status = status;
        this.rejectReason = rejectReason;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ==================== Getters ====================

    public Long getId() { return id; }

    public User getOwner() { return owner; }

    public CourtCategory getCategory() { return category; }

    public String getName() { return name; }

    public String getAddress() { return address; }

    public String getDescription() { return description; }

    public String getImageUrl() { return imageUrl; }

    public BigDecimal getCommissionRate() { return commissionRate; }

    public CourtStatus getStatus() { return status; }

    public String getRejectReason() { return rejectReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ==================== Setters ====================

    public void setId(Long id) { this.id = id; }

    public void setOwner(User owner) { this.owner = owner; }

    public void setCategory(CourtCategory category) { this.category = category; }

    public void setName(String name) { this.name = name; }

    public void setAddress(String address) { this.address = address; }

    public void setDescription(String description) { this.description = description; }

    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }

    public void setStatus(CourtStatus status) { this.status = status; }

    public void setRejectReason(String rejectReason) { this.rejectReason = rejectReason; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
