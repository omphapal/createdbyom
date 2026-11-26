package com.omkar.portfolio;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AdminController adminController;

    public AnalyticsController(AdminController adminController) {
        this.adminController = adminController;
    }

    @PostMapping("/track")
    public ResponseEntity<Map<String, String>> track(@RequestBody(required = false) Map<String, Object> event) {
        if (event != null && event.containsKey("type")) {
            String type = String.valueOf(event.get("type"));
            if ("whatsapp_click".equalsIgnoreCase(type)) {
                adminController.recordWhatsAppClick();
            } else {
                adminController.recordPageView();
            }
        }
        return ResponseEntity.ok(Map.of("status", "recorded"));
    }
}
