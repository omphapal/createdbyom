package com.omkar.portfolio;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryEmailService emailService;
    private final AdminController adminController;

    public EnquiryController(EnquiryEmailService emailService, AdminController adminController) {
        this.emailService = emailService;
        this.adminController = adminController;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submit(@Valid @RequestBody EnquiryRequest enquiry) {
        if (enquiry.website() != null && !enquiry.website().isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "The enquiry could not be accepted.")
            );
        }

        emailService.send(enquiry);
        adminController.recordContactSubmission(enquiry);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
                Map.of("message", "Your project enquiry was sent.")
        );
    }
}
