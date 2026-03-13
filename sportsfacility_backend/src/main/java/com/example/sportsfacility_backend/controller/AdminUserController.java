package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.service.AdminUserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final AdminUserService adminService;

    public AdminUserController(AdminUserService adminService) {
        this.adminService = adminService;
    }

    // list user
    @GetMapping
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    // lock user
    @PutMapping("/{id}/lock")
    public User lockUser(@PathVariable Long id) {
        return adminService.lockUser(id);
    }

    // unlock user
    @PutMapping("/{id}/unlock")
    public User unlockUser(@PathVariable Long id) {
        return adminService.unlockUser(id);
    }

    // delete user
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return "Xóa user thành công";
    }
}