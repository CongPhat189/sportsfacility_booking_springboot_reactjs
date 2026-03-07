package com.example.sportsfacility_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    //Xác thực tài khoản
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String link = "http://localhost:8080/auth/verify?token=" + token;


            String template = new String(Files.readAllBytes(
                    Paths.get(new ClassPathResource("templates/verification_email.html").getURI())
            ));


            String content = template.replace("{{link}}", link);


            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Xác thực tài khoản trên hệ thống SportArena");
            helper.setText(content, true);
            helper.setFrom("tpn18092004@gmail.com");

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi gửi email xác thực: " + e.getMessage());
        }
    }
}
