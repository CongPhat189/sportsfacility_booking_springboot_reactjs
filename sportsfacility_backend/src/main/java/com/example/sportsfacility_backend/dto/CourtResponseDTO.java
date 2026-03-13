package com.example.sportsfacility_backend.dto;

import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CourtResponseDTO {

    private Long id;
    private Long ownerId;
    private String ownerName;
    private Integer categoryId;
    private String categoryName;
    private String name;
    private String address;
    private String description;
    private String imageUrl;
    private BigDecimal commissionRate;
    private CourtStatus status;
    private LocalDateTime createdAt;

    public CourtResponseDTO(Court court) {
        this.id = court.getId();
        this.ownerId = court.getOwner().getId();
        this.ownerName = court.getOwner().getFullName();
        this.categoryId = court.getCategory().getId();
        this.categoryName = court.getCategory().getName();
        this.name = court.getName();
        this.address = court.getAddress();
        this.description = court.getDescription();
        this.imageUrl = court.getImageUrl();
        this.commissionRate = court.getCommissionRate();
        this.status = court.getStatus();
        this.createdAt = court.getCreatedAt();
    }

    public Long getId() { return id; }
    public Long getOwnerId() { return ownerId; }
    public String getOwnerName() { return ownerName; }
    public Integer getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public BigDecimal getCommissionRate() { return commissionRate; }
    public CourtStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
