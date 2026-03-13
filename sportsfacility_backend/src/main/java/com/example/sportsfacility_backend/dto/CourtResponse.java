package com.example.sportsfacility_backend.dto;

public class CourtResponse {

    private Long id;
    private String name;
    private String address;
    private String description;
    private String imageUrl;
    private String status;

    public CourtResponse(Long id, String name, String address,
                         String description, String imageUrl, String status) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.description = description;
        this.imageUrl = imageUrl;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getStatus() {
        return status;
    }
}