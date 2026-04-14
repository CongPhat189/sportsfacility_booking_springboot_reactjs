package com.example.sportsfacility_backend.service;

import com.example.sportsfacility_backend.entity.Court;
import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.entity.enums.CourtStatus;
import com.example.sportsfacility_backend.entity.enums.Role;
import com.example.sportsfacility_backend.entity.enums.UserStatus;
import com.example.sportsfacility_backend.repository.CourtRepository;
import com.example.sportsfacility_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourtRepository courtRepository;


    // lấy tất cả user trừ ADMIN
    public List<User> getAllUsers() {
        return userRepository.findByRoleNot(Role.ADMIN);
    }

    // khóa user
    @Transactional
    public User lockUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(user.getRole() == Role.ADMIN){
            throw new RuntimeException("Cannot lock admin");
        }

        user.setStatus(UserStatus.LOCKED);

        List<Court> courts = courtRepository.findByOwnerId(id);
        for (Court c : courts) {
            c.setStatus(CourtStatus.INACTIVE);
        }

        return user;
    }

    // mở khóa user
    @Transactional
    public User unlockUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(UserStatus.ACTIVE);

        List<Court> courts = courtRepository.findByOwnerId(id);
        for (Court c : courts) {
            c.setStatus(CourtStatus.ACTIVE);
        }

        return user;
    }
    // xóa user
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        if (user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Không thể xóa tài khoản ADMIN");
        }

        if (user.getRole() == Role.OWNER) {
            courtRepository.deleteByOwnerId(id);
        }

        userRepository.delete(user);
    }
}