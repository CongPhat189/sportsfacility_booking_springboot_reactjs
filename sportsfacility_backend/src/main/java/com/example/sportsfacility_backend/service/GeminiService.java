package com.example.sportsfacility_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.model}")
    private String model;

    private final RestTemplate restTemplate;

    // ===== Constructor với timeout =====
    public GeminiService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        this.restTemplate = new RestTemplate(factory);
    }

    public String analyzeReport(String prompt) {
        try {

            String fullUrl = apiUrl + "/models/" + model + ":generateContent?key=" + apiKey;

            // ===== Request body =====
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", prompt)
                                    )
                            )
                    )


            );

            // ===== Headers =====
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(requestBody, headers);

            // ===== Call API =====
            ResponseEntity<Map> response = restTemplate.exchange(
                    fullUrl,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            // Debug (có thể xóa sau)
            // System.out.println(response.getBody());

            // ===== Parse response =====
            return extractText(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return "AI phân tích thất bại: " + e.getMessage();
        }
    }

    // ===== Parse JSON Gemini =====
    private String extractText(Map<String, Object> body) {
        try {
            if (body == null) return "AI không phản hồi";

            Object candidatesObj = body.get("candidates");
            if (!(candidatesObj instanceof List<?> candidates) || candidates.isEmpty()) {
                return "AI không trả về kết quả";
            }

            Object firstCandidate = candidates.get(0);
            if (!(firstCandidate instanceof Map<?, ?> candidateMap)) {
                return "Sai format response";
            }

            Object contentObj = candidateMap.get("content");
            if (!(contentObj instanceof Map<?, ?> contentMap)) {
                return "Không có content";
            }

            Object partsObj = contentMap.get("parts");
            if (!(partsObj instanceof List<?> parts) || parts.isEmpty()) {
                return "AI trả về rỗng";
            }

            Object firstPart = parts.get(0);
            if (!(firstPart instanceof Map<?, ?> partMap)) {
                return "Sai format part";
            }

            Object text = partMap.get("text");
            return text != null ? text.toString() : "Không có nội dung";

        } catch (Exception e) {
            return "Lỗi parse AI response";
        }
    }
}