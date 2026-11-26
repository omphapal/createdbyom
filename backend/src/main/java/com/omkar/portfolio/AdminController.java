package com.omkar.portfolio;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Value("${portfolio.admin.token:}")
    private String adminToken;

    private final AtomicLong pageViews = new AtomicLong(0);
    private final AtomicLong whatsappClicks = new AtomicLong(0);
    private final AtomicLong contactSubmissions = new AtomicLong(0);
    private final List<Map<String, Object>> recentEnquiries = Collections.synchronizedList(new ArrayList<>());
    private final Map<String, String> settings = new ConcurrentHashMap<>();

    public AdminController() {
        settings.put("whatsappNumber", "918208497838");
        settings.put("availabilityStatus", "Available for freelance projects");
        settings.put("contactEmail", "Omphapal181@gmail.com");
    }

    private boolean isAuthorized(String authHeader) {
        if (adminToken == null || adminToken.isBlank()) {
            return false;
        }
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7).trim();
        return adminToken.equals(token);
    }

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!isAuthorized(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("status", "healthy");
        data.put("totalPageViews", pageViews.get());
        data.put("whatsappClicks", whatsappClicks.get());
        data.put("contactSubmissions", contactSubmissions.get());
        data.put("recentEnquiriesCount", recentEnquiries.size());
        data.put("settings", settings);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/enquiries")
    public ResponseEntity<?> getEnquiries(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!isAuthorized(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        return ResponseEntity.ok(recentEnquiries);
    }

    @PostMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                            @RequestBody Map<String, String> newSettings) {
        if (!isAuthorized(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access."));
        }
        if (newSettings != null) {
            settings.putAll(newSettings);
        }
        return ResponseEntity.ok(Map.of("message", "Settings updated successfully", "settings", settings));
    }

    public void recordPageView() {
        pageViews.incrementAndGet();
    }

    public void recordWhatsAppClick() {
        whatsappClicks.incrementAndGet();
    }

    public void recordContactSubmission(EnquiryRequest enquiry) {
        contactSubmissions.incrementAndGet();
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", UUID.randomUUID().toString());
        item.put("name", enquiry.name());
        item.put("email", enquiry.email());
        item.put("message", enquiry.message());
        item.put("timestamp", System.currentTimeMillis());
        recentEnquiries.add(0, item);
        if (recentEnquiries.size() > 50) {
            recentEnquiries.remove(recentEnquiries.size() - 1);
        }
    }
}
