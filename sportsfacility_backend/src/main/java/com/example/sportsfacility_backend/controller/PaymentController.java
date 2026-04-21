package com.example.sportsfacility_backend.controller;

import com.example.sportsfacility_backend.dto.VNPayCreateRequest;
import com.example.sportsfacility_backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Value("${app.frontend-url}")
    private String frontendUrl;

    @PostMapping("/vnpay/create")
    public ResponseEntity<Map<String, String>> createPayment(
            @RequestBody VNPayCreateRequest req,
            HttpServletRequest httpReq) {
        String ip = httpReq.getRemoteAddr();
        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) ip = "127.0.0.1";
        String url = paymentService.createPaymentUrl(req.getBookingId(), ip);
        Map<String, String> result = new HashMap<>();
        result.put("paymentUrl", url);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/vnpay/callback")
    public void handleCallback(
            @RequestParam Map<String, String> params,
            HttpServletResponse response) throws IOException {
        boolean success = paymentService.handleCallback(params);
        String redirectUrl = success
                ? frontendUrl + "/payment/success"
                : frontendUrl + "/payment/failed";
        response.sendRedirect(redirectUrl);
    }
}
