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
    import java.util.List;

    @RestController
    @RequestMapping("/owner/courts")
    public class OwnerCourtController {

        @Autowired
        private CourtService courtService;

        @Autowired
        private CloudinaryService cloudinaryService;

        // ================= CREATE COURT =================
        @PostMapping(consumes = "multipart/form-data")
        public ResponseEntity<CourtResponse> createCourt(
                @RequestPart("court") CourtRequest request,
                @RequestPart(value = "file", required = false) MultipartFile file,
                Authentication authentication) throws IOException {

            String email = authentication.getName();

            if (file != null && !file.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(file);
                request.setImageUrl(imageUrl);
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
                @RequestPart("court") CourtRequest request,
                @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

            if (file != null && !file.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(file);
                request.setImageUrl(imageUrl);
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