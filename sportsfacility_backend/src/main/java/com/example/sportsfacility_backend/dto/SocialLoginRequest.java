package com.example.sportsfacility_backend.dto;

public record SocialLoginRequest(
        String email,
        String fullName,
        String avatarUrl,
        String provider // "GOOGLE" hoặc "FACEBOOK"
) {}