package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.entity.enums.Role;
import com.example.sportsfacility_backend.entity.enums.UserStatus;
import com.example.sportsfacility_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // lấy tất cả user trừ ADMIN
    public List<User> getAllUsers() {
        return userRepository.findByRoleNot(Role.ADMIN);
    }

    // khóa user
    public User lockUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.LOCKED);

        if(user.getRole() == Role.ADMIN){
            throw new RuntimeException("Cannot lock admin");
        }

        return userRepository.save(user);
    }

    // mở khóa user
    public User unlockUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(UserStatus.ACTIVE);

        return userRepository.save(user);
    }
    // xóa user
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        if (user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Không thể xóa tài khoản ADMIN");
        }

        userRepository.delete(user);
    }
}