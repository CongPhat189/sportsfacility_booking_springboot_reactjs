package com.example.sportsfacility_backend.service;


import com.example.sportsfacility_backend.dto.RegisterRequest;
import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.entity.enums.*;
import com.example.sportsfacility_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private CloudinaryService cloudinaryService;
    @Autowired private EmailService emailService;

    public void registerUser(RegisterRequest req) throws Exception {

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        // Upload avatar lên Cloudinary (nếu có)
        String avatarUrl = null;
        if (req.getAvatarUrl() != null && !req.getAvatarUrl().isEmpty()) {
            avatarUrl = cloudinaryService.uploadImage(req.getAvatarUrl());
        }

        // Tạo token xác thực
        String token = UUID.randomUUID().toString();

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(req.getPassword()));
        user.setFullName(req.getFullName());

        user.setAvatarUrl(avatarUrl);
        user.setRole(req.getRole());
        user.setVerified(false);
        user.setStatus(UserStatus.INACTIVE);
        user.setVerificationToken(token);
        user.setTokenExpiresAt(Timestamp.valueOf(LocalDateTime.now().plusHours(24)));
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()).toLocalDateTime());

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), token);
    }


        public void createAdmin(RegisterRequest req) {
        if (userRepository.existsByEmail("admin@ou.edu.vn")) {
            throw new IllegalArgumentException("Tài khoản admin đã tồn tại.");
        }
        User admin = new User();
        admin.setEmail("admin@gmail.com");
        admin.setFullName("Quản trị viên hệ thống SportArena");
        admin.setPassword(new BCryptPasswordEncoder().encode("admin123"));
        admin.setRole(Role.ADMIN);
        admin.setVerified(true);
        admin.setStatus(UserStatus.ACTIVE);
        admin.setCreatedAt(new Timestamp(System.currentTimeMillis()).toLocalDateTime());
        userRepository.save(admin);
    }

    public void verifyEmail(String token) {
        User user = userRepository.findAll().stream()
                .filter(u -> token.equals(u.getVerificationToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ."));

        user.setVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        user.setVerificationToken(null);
        user.setTokenExpiresAt(null);
        userRepository.save(user);
    }
    // current user
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }


}
