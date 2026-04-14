    package com.example.sportsfacility_backend.controller;

    import com.example.sportsfacility_backend.dto.CourtRequest;
    import com.example.sportsfacility_backend.dto.CourtResponse;
    import com.example.sportsfacility_backend.service.CourtService;
    import com.example.sportsfacility_backend.service.CloudinaryService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.core.Authentication;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;

    import java.io.IOException;
    import java.util.ArrayList;
    import java.util.List;

    @RestController
    @RequestMapping("/owner/courts")
    public class OwnerCourtController {

        @Autowired
        private CourtService courtService;

        @Autowired
        private CloudinaryService cloudinaryService;

        // ================= CREATE COURT (Sửa lại để nhận 3 ảnh) =================
        @PostMapping(consumes = "multipart/form-data")
        public ResponseEntity<CourtResponse> createCourt(
                @ModelAttribute CourtRequest request, // Dùng ModelAttribute để nhận List<MultipartFile> bên trong DTO
                Authentication authentication) throws IOException {

            String email = authentication.getName();

            // Xử lý upload danh sách file ảnh
            if (request.getImageFiles() != null && !request.getImageFiles().isEmpty()) {
                List<String> uploadedUrls = new ArrayList<>();

                // Chỉ lấy tối đa 3 ảnh
                int limit = Math.min(request.getImageFiles().size(), 3);
                for (int i = 0; i < limit; i++) {
                    MultipartFile file = request.getImageFiles().get(i);
                    if (file != null && !file.isEmpty()) {
                        String url = cloudinaryService.uploadImage(file);
                        uploadedUrls.add(url);
                    }
                }

                // Nối các link thành "link1,link2,link3" và gán vào imageUrl của request
                if (!uploadedUrls.isEmpty()) {
                    request.setImageUrl(String.join(",", uploadedUrls));
                }
            }

            return ResponseEntity.ok(courtService.createCourt(request, email));
        }

        // ================= GET ALL COURTS =================
        @GetMapping
        public ResponseEntity<List<CourtResponse>> getAllCourts(Authentication authentication) {
            String email = authentication.getName();
            return ResponseEntity.ok(courtService.getCourtsByOwner(email));
        }

        // ================= GET COURT BY ID =================
        @GetMapping("/{id}")
        public ResponseEntity<CourtResponse> getCourt(@PathVariable Long id) {
            return ResponseEntity.ok(courtService.getCourtById(id));
        }

        // ================= UPDATE COURT =================
        @PutMapping(value = "/{id}", consumes = "multipart/form-data")
        public ResponseEntity<CourtResponse> updateCourt(
                @PathVariable Long id,
                @ModelAttribute CourtRequest request) throws IOException {

            if (request.getImageFiles() != null && !request.getImageFiles().isEmpty()) {
                List<String> uploadedUrls = new ArrayList<>();
                int limit = Math.min(request.getImageFiles().size(), 3);
                for (int i = 0; i < limit; i++) {
                    MultipartFile file = request.getImageFiles().get(i);
                    if (file != null && !file.isEmpty()) {
                        uploadedUrls.add(cloudinaryService.uploadImage(file));
                    }
                }
                request.setImageUrl(String.join(",", uploadedUrls));
            }

            return ResponseEntity.ok(courtService.updateCourt(id, request));
        }

        // ================= INACTIVE COURT =================
        @PutMapping("/{id}/deactivate")
        public ResponseEntity<CourtResponse> deactivateCourt(@PathVariable Long id) {
            // gọi service để set status = INACTIVE
            return ResponseEntity.ok(courtService.deactivateCourt(id));
        }
        // ================= ACTIVE COURT =================
        @PutMapping("/{id}/activate")
        public ResponseEntity<CourtResponse> activateCourt(@PathVariable Long id) {
            return ResponseEntity.ok(courtService.activateCourt(id));
        }
    }