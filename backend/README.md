# Spring Boot enquiry API

This backend sends project enquiries from the static portfolio to the configured email address.

## Requirements

- Java 21 or newer
- A Gmail App Password, or SMTP credentials from another mail provider

## Configure SMTP on Windows

For Gmail, enable 2-Step Verification and create an App Password. Do not use your regular Gmail password.

In Command Prompt, set the SMTP credentials for the current session:

```bat
set MAIL_USERNAME=your-sending-address@gmail.com
set MAIL_PASSWORD=your-gmail-app-password
set MAIL_RECIPIENT=Omphapal181@gmail.com
```

Optional settings:

```bat
set MAIL_HOST=smtp.gmail.com
set MAIL_PORT=587
set PORTFOLIO_ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
```

## Run

From the website root, start the portfolio frontend in a terminal:

```bat
npm run dev
```

In a second terminal, from this `backend` folder, start the API:

```bat
mvnw.cmd spring-boot:run
```

Open `http://localhost:8000`. The API listens on `http://localhost:8080/api/enquiries`.

The API returns HTTP 202 only after the SMTP sender accepts the message. Invalid requests return HTTP 400; email delivery failures return HTTP 503. The backend does not store enquiries.

## Production

Set `PORTFOLIO_ALLOWED_ORIGINS` to the exact HTTPS website origin. Keep SMTP credentials in the hosting provider's secret environment variables. If the website and API use different origins, add the API origin to the website's `window.OMKAR_SITE_CONFIG.apiBaseUrl` in its configuration script.

URL-based canonical metadata, sitemap, and RSS feed are omitted until the public domain is configured. Add them back with the production domain before launch.
