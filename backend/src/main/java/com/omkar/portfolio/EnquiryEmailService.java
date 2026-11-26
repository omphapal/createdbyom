package com.omkar.portfolio;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnquiryEmailService {

    private static final Logger logger = LoggerFactory.getLogger(EnquiryEmailService.class);

    private final JavaMailSender mailSender;
    private final String recipient;
    private final String senderAddress;

    public EnquiryEmailService(
            JavaMailSender mailSender,
            @Value("${portfolio.mail.recipient}") String recipient,
            @Value("${spring.mail.username:}") String senderAddress) {
        this.mailSender = mailSender;
        this.recipient = recipient;
        this.senderAddress = senderAddress;
    }

    public void send(EnquiryRequest enquiry) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipient);
        email.setReplyTo(enquiry.email().trim());
        if (!senderAddress.isBlank()) {
            email.setFrom(senderAddress);
        }
        email.setSubject("New project enquiry from " + enquiry.name().trim());
        email.setText(formatMessage(enquiry));

        try {
            mailSender.send(email);
        } catch (MailException exception) {
            logger.warn("Project enquiry email delivery failed ({})",
                    exception.getClass().getSimpleName());
            throw new EnquiryDeliveryException(exception);
        }
    }

    private String formatMessage(EnquiryRequest enquiry) {
        return """
                Name: %s
                Email: %s
                Phone: %s
                Company: %s
                Services: %s
                Timeline: %s
                Budget: %s

                Project details:
                %s

                Project brief:
                %s
                """.formatted(
                enquiry.name().trim(),
                enquiry.email().trim(),
                valueOrNotProvided(enquiry.phone()),
                valueOrNotProvided(enquiry.company()),
                listOrNotProvided(enquiry.services()),
                valueOrNotProvided(enquiry.timeline()),
                valueOrNotProvided(enquiry.budget()),
                enquiry.message().trim(),
                valueOrNotProvided(enquiry.projectBrief())
        );
    }

    private String valueOrNotProvided(String value) {
        return value == null || value.isBlank() ? "Not provided" : value.trim();
    }

    private String listOrNotProvided(List<String> values) {
        return values == null || values.isEmpty()
                ? "Not provided"
                : String.join(", ", values);
    }
}
