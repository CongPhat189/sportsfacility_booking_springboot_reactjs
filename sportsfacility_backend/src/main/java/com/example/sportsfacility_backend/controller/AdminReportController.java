package com.example.sportsfacility_backend.controller;


import com.example.sportsfacility_backend.dto.BookingPieDTO;
import com.example.sportsfacility_backend.dto.RevenueBarDTO;
import com.example.sportsfacility_backend.service.AdminReportService;
import com.example.sportsfacility_backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/reports")
public class AdminReportController {

    @Autowired
    private AdminReportService adminReportService;
    @Autowired
    private GeminiService geminiService;

    // ===== PIE =====
    @GetMapping("/booking-pie")
    public ResponseEntity<BookingPieDTO> getBookingPie(
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(
                adminReportService.getBookingPie(month, year)
        );
    }

    // ===== BAR =====
    @GetMapping("/revenue-3months")
    public ResponseEntity<List<RevenueBarDTO>> getRevenue3Months(
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(
                adminReportService.getRevenue3Months(month, year)
        );
    }

    // ===== AI ANALYSIS =====
    @PostMapping("/analyze")
    public String analyze(@RequestBody Map<String, Object> data) {

        // ===== Extract data =====
        int pending = (int) data.getOrDefault("pending", 0);
        int completed = (int) data.getOrDefault("completed", 0);
        int cancelled = (int) data.getOrDefault("cancelled", 0);

        Object revenue = data.get("revenue"); // list từ frontend

        // ===== Build prompt =====
        String prompt = buildPrompt(pending, completed, cancelled, revenue);

        // ===== Call AI =====
        return geminiService.analyzeReport(prompt);
    }

    // ===== PROMPT BUILDER =====
    private String buildPrompt(int pending, int completed, int cancelled, Object revenue) {

        return """
            Bạn là chuyên gia phân tích kinh doanh hệ thống đặt sân thể thao.

            Dữ liệu:
            - Pending: %d
            - Completed: %d
            - Cancelled: %d

            Doanh thu 3 tháng gần nhất:
            %s

            Hãy phân tích:
            1. Xu hướng booking (tốt hay xấu)
            2. Tỷ lệ huỷ có vấn đề không
            3. Doanh thu tăng hay giảm
            4. Đưa ra 2-3 đề xuất cải thiện

            Trả lời ngắn gọn, rõ ràng, dạng bullet point.
        """.formatted(pending, completed, cancelled, revenue);
    }
}
