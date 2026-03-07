package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.LoginRequest;
import com.example.sportsfacility_backend.dto.LoginResponse;
import com.example.sportsfacility_backend.dto.RegisterRequest;
import com.example.sportsfacility_backend.entity.User;
import com.example.sportsfacility_backend.entity.enums.Role;
import com.example.sportsfacility_backend.entity.enums.UserStatus;
import com.example.sportsfacility_backend.repository.UserRepository;
import com.example.sportsfacility_backend.service.JwtService;
import com.example.sportsfacility_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;




    @PostMapping("/register")
    public ResponseEntity<?> register(@ModelAttribute RegisterRequest req) {
        try {
            userService.registerUser(req);
            return ResponseEntity.ok(Map.of("message", "Đăng ký thành công. Vui lòng kiểm tra email để xác thực."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }




    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 1. Xác thực tài khoản
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 2. Lấy thông tin user
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // 3. Kiểm tra xác thực email
            if (!user.isVerified()) {
                return ResponseEntity.badRequest().body("Tài khoản chưa xác thực email.");
            }

            // 4. Kiểm tra tài khoản bị khóa
            if (user.getStatus() == UserStatus.LOCKED) {
                return ResponseEntity.badRequest().body("Tài khoản đã bị khóa.");
            }


            // 5. Kiểm tra vai trò
            Role expectedRole;
            try {
                expectedRole = request.getRole();
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Vai trò không hợp lệ.");
            }

            if (user.getRole() != expectedRole) {
                return ResponseEntity.badRequest().body("Bạn không thuộc vai trò: " + request.getRole());
            }

            // 7. Trả về JWT token
            String token = jwtService.generateToken(user);
            LoginResponse response = new LoginResponse(user.getId(),token, user.getRole().name(), user.getFullName(), user.getAvatarUrl());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu.");
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token) {
        try {
            userService.verifyEmail(token);
            return ResponseEntity.ok("Xác thực tài khoản thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
