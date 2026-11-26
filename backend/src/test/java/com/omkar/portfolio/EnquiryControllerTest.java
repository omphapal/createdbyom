package com.omkar.portfolio;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailSendException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class EnquiryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    @Test
    void sendsValidEnquiryAndConfirmsDelivery() throws Exception {
        mockMvc.perform(post("/api/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Asha Client",
                                  "email": "asha@example.com",
                                  "phone": "+91 98765 43210",
                                  "company": "Example Studio",
                                  "message": "I need a Spring Boot API.",
                                  "services": ["Backend Development"],
                                  "timeline": "1-3 months",
                                  "budget": "I need an estimate",
                                  "projectBrief": "",
                                  "website": ""
                                }
                                """))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.message").value("Your project enquiry was sent."));

        ArgumentCaptor<SimpleMailMessage> email = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(email.capture());
        assertEquals("Omphapal181@gmail.com", email.getValue().getTo()[0]);
        assertEquals("asha@example.com", email.getValue().getReplyTo());
        assertTrue(email.getValue().getText().contains("Backend Development"));
        assertTrue(email.getValue().getText().contains("I need a Spring Boot API."));
    }

    @Test
    void rejectsInvalidEmailWithoutSendingMail() throws Exception {
        mockMvc.perform(post("/api/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Asha Client",
                                  "email": "not-an-email",
                                  "message": "I need a website."
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value("Check the enquiry fields and try again."));

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void rejectsHoneypotSubmissionWithoutSendingMail() throws Exception {
        mockMvc.perform(post("/api/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Asha Client",
                                  "email": "asha@example.com",
                                  "message": "I need a website.",
                                  "website": "spam.example"
                                }
                                """))
                .andExpect(status().isBadRequest());

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void reportsMailDeliveryFailureInsteadOfSuccess() throws Exception {
        doThrow(new MailSendException("SMTP unavailable"))
                .when(mailSender).send(any(SimpleMailMessage.class));

        mockMvc.perform(post("/api/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Asha Client",
                                  "email": "asha@example.com",
                                  "message": "I need a Spring Boot API."
                                }
                                """))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.detail")
                        .value("We could not send your enquiry right now. Please try again later."));
    }

    @Test
    void allowsLocalPortfolioOrigin() throws Exception {
        mockMvc.perform(options("/api/enquiries")
                        .header("Origin", "http://localhost:8000")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:8000"));
    }

    @Test
    void allowsIpv6LocalPortfolioOrigin() throws Exception {
        mockMvc.perform(options("/api/enquiries")
                        .header("Origin", "http://[::1]:8000")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://[::1]:8000"));
    }
}
