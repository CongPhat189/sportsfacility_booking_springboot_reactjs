package com.example.sportsfacility_backend.config;

import com.example.sportsfacility_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Autowired
    private UserService userService;

//    @Bean
//    CommandLineRunner initAdmin() {
//        return args -> {
//            userService.createAdmin(null);
//        };
//    }
}