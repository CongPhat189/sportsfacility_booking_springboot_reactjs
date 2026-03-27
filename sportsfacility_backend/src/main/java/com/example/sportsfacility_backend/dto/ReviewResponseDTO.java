package com.example.sportsfacility_backend.dto;

import com.example.sportsfacility_backend.entity.Review;
import java.time.LocalDateTime;

public class ReviewResponseDTO {
    private Long id;
    private String courtName;
    private Byte rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewResponseDTO(Review r) {
        this.id = r.getId();
        this.courtName = r.getCourt().getName();
        this.rating = r.getRating();
        this.comment = r.getComment();
        this.createdAt = r.getCreatedAt();
    }

    public Long getId() { return id; }
    public String getCourtName() { return courtName; }
    public Byte getRating() { return rating; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
