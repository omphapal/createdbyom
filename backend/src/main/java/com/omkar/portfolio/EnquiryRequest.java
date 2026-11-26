package com.omkar.portfolio;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record EnquiryRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email @Size(max = 254) String email,
        @Size(max = 40) String phone,
        @Size(max = 150) String company,
        @NotBlank @Size(max = 5000) String message,
        List<@Size(max = 100) String> services,
        @Size(max = 100) String timeline,
        @Size(max = 100) String budget,
        @Size(max = 3000) String projectBrief,
        @Size(max = 200) String website
) {
}
