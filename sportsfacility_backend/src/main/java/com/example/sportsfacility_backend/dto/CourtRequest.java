package com.example.sportsfacility_backend.dto;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class CourtRequest {

    private Integer categoryId;
    private String name;
    private String address;
    private String description;
    private String imageUrl;

    // Thêm trường này để nhận danh sách file thực tế từ Frontend
    private List<MultipartFile> imageFiles;

    public List<MultipartFile> getImageFiles() { return imageFiles; }
    public void setImageFiles(List<MultipartFile> imageFiles) { this.imageFiles = imageFiles; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}