package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.ChangePasswordRequest;
import com.example.sportsfacility_backend.dto.UpdateProfileRequest;
import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public User getProfile(Authentication authentication) {

        String email = authentication.getName();

        return userService.getCurrentUser(email);
    }

    @PutMapping("/profile")
    public User updateProfile(Authentication authentication,
                              @RequestBody UpdateProfileRequest req) throws Exception {

        String email = authentication.getName();

        return userService.updateProfile(email, req);
    }

    @PatchMapping("/change-password")
    public String changePassword(Authentication authentication,
                                 @RequestBody ChangePasswordRequest req) {

        String email = authentication.getName();

        return userService.changePassword(email, req);
    }
}