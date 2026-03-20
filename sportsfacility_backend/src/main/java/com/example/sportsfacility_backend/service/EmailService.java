package com.example.sportsfacility_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;
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



    // ===== APPROVE =====
    public void sendApproveCourtEmail(String to, String courtName, String fullName) {

        Context context = new Context();
        context.setVariable("courtName", courtName);
        context.setVariable("link", "http://localhost:3000/courts");
        context.setVariable("fullName", fullName);

        String html = templateEngine.process("email/approve-court", context);

        sendHtmlMail(to, "🎉 Sân đã được duyệt", html);
    }

    // ===== REJECT =====
    public void sendRejectCourtEmail(String to, String courtName, String reason, String fullName) {

        Context context = new Context();
        context.setVariable("courtName", courtName);
        context.setVariable("reason", reason);
        context.setVariable("fullName", fullName);


        String html = templateEngine.process("email/reject-court", context);

        sendHtmlMail(to, "❌ Sân bị từ chối", html);
    }
    public void sendBookingSuccessEmail(
            String to,
            String fullName,
            String courtName,
            String bookingDateTime,
            String totalAmount
    ) {

        Context context = new Context();
        context.setVariable("fullName", fullName);
        context.setVariable("courtName", courtName);
        context.setVariable("time", bookingDateTime);
        context.setVariable("totalAmount", totalAmount);

        String html = templateEngine.process("email/booking-success", context);

        sendHtmlMail(to, "✅ Đặt sân thành công", html);
    }

    private void sendHtmlMail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi gửi mail: " + e.getMessage());
        }
    }
}
