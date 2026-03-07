package com.example.sportsfacility_backend.entity;

import com.example.sportsfacility_backend.entity.enums.Role;
import com.example.sportsfacility_backend.entity.enums.UserStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 15)
    private String phone;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role role = Role.CUSTOMER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private UserStatus status = UserStatus.INACTIVE;

    @Column(name = "is_verified")
    private boolean isVerified;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "token_expires_at")
    private Timestamp tokenExpiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ==================== Constructors ====================



    public User() {}

    public User(Long id, String fullName, String email, String password, String phone,
                String avatarUrl, Role role, UserStatus status, boolean isVerified,
                String verificationToken, Timestamp tokenExpiresAt,
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.role = role;
        this.status = status;
        this.isVerified = isVerified;
        this.verificationToken = verificationToken;
        this.tokenExpiresAt = tokenExpiresAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ==================== Getters ====================

    public Long getId() { return id; }

    public String getFullName() { return fullName; }

    public String getEmail() { return email; }

    public String getPassword() { return password; }

    public String getPhone() { return phone; }

    public String getAvatarUrl() { return avatarUrl; }

    public Role getRole() { return role; }

    public UserStatus getStatus() { return status; }

    public boolean isVerified() { return isVerified; }

    public String getVerificationToken() { return verificationToken; }

    public Timestamp getTokenExpiresAt() { return tokenExpiresAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ==================== Setters ====================

    public void setId(Long id) { this.id = id; }

    public void setFullName(String fullName) { this.fullName = fullName; }

    public void setEmail(String email) { this.email = email; }

    public void setPassword(String password) { this.password = password; }

    public void setPhone(String phone) { this.phone = phone; }

    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public void setRole(Role role) { this.role = role; }

    public void setStatus(UserStatus status) { this.status = status; }

    public void setVerified(boolean verified) { isVerified = verified; }

    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public void setTokenExpiresAt(Timestamp tokenExpiresAt) { this.tokenExpiresAt = tokenExpiresAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
