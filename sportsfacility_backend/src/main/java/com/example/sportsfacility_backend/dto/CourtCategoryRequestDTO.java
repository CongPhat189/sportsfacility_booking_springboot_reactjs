package com.example.sportsfacility_backend.dto;

public class CourtCategoryRequestDTO {

    private String name;
    private String description;
    private Boolean isActive;

    public CourtCategoryRequestDTO() {}

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}