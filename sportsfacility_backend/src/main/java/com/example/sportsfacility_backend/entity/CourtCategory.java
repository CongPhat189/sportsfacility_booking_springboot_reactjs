package com.example.sportsfacility_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "court_categories")
public class CourtCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // ==================== Constructors ====================

    public CourtCategory() {}

    public CourtCategory(Integer id, String name, String description, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isActive = isActive;
    }

    // ==================== Getters ====================

    public Integer getId() { return id; }

    public String getName() { return name; }

    public String getDescription() { return description; }

    public Boolean getIsActive() { return isActive; }

    // ==================== Setters ====================

    public void setId(Integer id) { this.id = id; }

    public void setName(String name) { this.name = name; }

    public void setDescription(String description) { this.description = description; }

    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
