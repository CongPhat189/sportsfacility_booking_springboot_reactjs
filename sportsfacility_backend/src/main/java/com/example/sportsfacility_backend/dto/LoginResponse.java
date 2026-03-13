package com.example.sportsfacility_backend.dto;



public class LoginResponse {
    private Long id;
    private String token;
    private String role;
    private String fullName;
    private String phone;
    private String avatarUrl;

    public LoginResponse(Long id, String token, String role, String fullName, String phone, String avatarUrl) {
        this.id = id;
        this.token = token;
        this.role = role;
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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
    public String getAvatarUrl() {
        return avatarUrl;
    }
    public void setAvatar(String avatar) {
        this.avatarUrl = avatarUrl;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }


}
