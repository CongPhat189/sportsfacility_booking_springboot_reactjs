package com.example.sportsfacility_backend.dto;

public class CourtResponse {

    private Long id;

    private String name;
    private String address;
    private String description;
    private String imageUrl;
    private String status;
    private String rejectReason;
    private Integer  categoryId;
    private String categoryName;

    public CourtResponse(Long id, String name, String address,
                         String description, String imageUrl, String status,
                         Integer  categoryId, String categoryName,  String rejectReason) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.description = description;
        this.imageUrl = imageUrl;
        this.status = status;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.rejectReason = rejectReason;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public String getStatus() { return status; }

    public Integer  getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public String getRejectReason() { return rejectReason; }
}