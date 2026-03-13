package com.example.sportsfacility_backend.repository;

import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.entity.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // lấy tất cả user trừ admin
    List<User> findByRoleNot(Role role);

}
