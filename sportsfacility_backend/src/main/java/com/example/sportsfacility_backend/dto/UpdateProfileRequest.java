package com.example.sportsfacility_backend.dto;

import org.springframework.web.multipart.MultipartFile;

;


public class UpdateProfileRequest {

    private String fullName;
    private String phone;
    private MultipartFile avatarUrl;





    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public MultipartFile getAvatarUrl() {
        return avatarUrl;
    }
    public void setAvatarUrl(MultipartFile avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

}