package com.example.sportsfacility_backend.dto;
import com.example.sportsfacility_backend.entity.enums.Role;

import org.springframework.web.multipart.MultipartFile;

public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private Role role;
    private MultipartFile avatarUrl;


    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
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
    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }
    public MultipartFile getAvatarUrl() {
        return avatarUrl;
    }
    public void setAvatarUrl(MultipartFile avatarUrl) {
        this.avatarUrl = avatarUrl;
    }









}