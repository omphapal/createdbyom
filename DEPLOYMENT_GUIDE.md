# OMKAR PHAPAL — PORTFOLIO V3 PRODUCTION DEPLOYMENT GUIDE
## Complete Step-by-Step Guide for GitHub, Vercel, Railway, and Admin Configuration

---

### Architecture Overview

- **Source Control**: GitHub repository (`main` branch)
- **Frontend**: Vercel (Static HTML/CSS/JS + WebGL Cables office animation + client assets)
- **Backend API**: Railway (Spring Boot 3.3.5 / Java 21)
- **Email Delivery**: JavaMailSender via standard SMTP (Gmail / SendGrid / Amazon SES)
- **Database / Analytics**: In-memory + persistent configuration for enquiries and anonymous telemetry

---

### Part A — GitHub Source Control Setup

1. **Verify your local Git status**:
   ```bash
   git status
   ```
2. **Ensure sensitive files are ignored** (`.gitignore`):
   Verify that `.env`, `.env.local`, IDE directories (`.idea/`, `.vscode/`), and Maven build artifacts (`target/`) are excluded.
3. **Commit your latest verified code**:
   ```bash
   git add -A
   git commit -m "feat(portfolio): Omkar Phapal V3 complete upgrade with resume, WhatsApp, and admin APIs"
   ```
4. **Create a new repository on GitHub**:
   - Go to [https://github.com/new](https://github.com/new)
   - Name it `omkar-portfolio` (or `www.digitalpanda.com`)
   - Set it to **Public**
5. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/<your-username>/omkar-portfolio.git
   git branch -M main
   git push -u origin main
   ```

---

### Part B — Vercel Frontend Deployment

1. **Sign in to Vercel**:
   Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. **Import Project**:
   Click **"Add New..."** -> **"Project"**, then select your repository.
3. **Configure Project Settings**:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (leave default repository root)
   - **Build Command**: Leave empty (it is pre-rendered static HTML/CSS/JS)
   - **Output Directory**: `./` (leave default)
4. **Set Environment Variables**:
   Under **Environment Variables**, add:
   - `BACKEND_API_URL`: Your Railway backend domain (e.g., `https://api-production.up.railway.app`)
5. **Deploy**:
   Click **"Deploy"**. Vercel will deploy your site in ~30 seconds.
6. **Verify Clean URL Routing**:
   - Test `https://your-domain.vercel.app/`
   - Test `https://your-domain.vercel.app/about-us`
   - Test `https://your-domain.vercel.app/work`
   - Test project case studies (e.g. `/project/dependency-x-ray-pro`)

---

### Part C — Railway Backend Deployment

1. **Sign in to Railway**:
   Go to [https://railway.app](https://railway.app) and log in using your GitHub account.
2. **Create New Project**:
   Click **"New Project"** -> **"Deploy from GitHub repo"** -> Select your portfolio repository.
3. **Set Root Directory**:
   Go to **Settings** -> **Root Directory**, set it to `/backend`.
4. **Configure Build & Start Commands**:
   Railway auto-detects `pom.xml` using Nixpacks/Maven.
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
5. **Set Environment Variables**:
   In the Railway **Variables** tab, configure:
   - `PORT`: `8080`
   - `PORTFOLIO_CORS_ALLOWED_ORIGINS`: `https://your-portfolio.vercel.app,http://localhost:3000`
   - `PORTFOLIO_ADMIN_TOKEN`: `GenerateAStrongSecretToken123!` (keep private)
   - `SPRING_MAIL_HOST`: `smtp.gmail.com`
   - `SPRING_MAIL_PORT`: `587`
   - `SPRING_MAIL_USERNAME`: `Omphapal181@gmail.com`
   - `SPRING_MAIL_PASSWORD`: `YourGmailAppPassword`
   - `PORTFOLIO_ENQUIRY_RECIPIENT`: `Omphapal181@gmail.com`
6. **Configure Healthcheck**:
   Under **Settings** -> **Healthcheck Path**, enter: `/health`.
7. **Generate Public Domain**:
   Under **Settings** -> **Networking**, click **"Generate Domain"** to get your public backend URL.

---

### Part D — Connecting Frontend & Backend

1. **Update API Base in Frontend Configuration**:
   In `contact-api.js` or `site-config.js`, set `apiBaseUrl` to your Railway domain:
   ```javascript
   apiBaseUrl: 'https://your-backend.up.railway.app'
   ```
2. **Verify CORS**:
   Ensure `PORTFOLIO_CORS_ALLOWED_ORIGINS` on Railway includes your exact Vercel frontend URL.
3. **Verify Contact Form**:
   Submit a test enquiry on `https://your-site.vercel.app/#contact`. The form should return a green success alert.

---

### Part E — Admin Dashboard & Owner Setup

1. **How to Access Admin Insights**:
   To query the admin endpoints securely, use your secret `PORTFOLIO_ADMIN_TOKEN`:
   ```bash
   curl -H "Authorization: Bearer GenerateAStrongSecretToken123!" https://your-backend.up.railway.app/api/admin/overview
   ```
2. **How to View Recent Client Enquiries**:
   ```bash
   curl -H "Authorization: Bearer GenerateAStrongSecretToken123!" https://your-backend.up.railway.app/api/admin/enquiries
   ```
3. **How to Update WhatsApp or Status Dynamically**:
   ```bash
   curl -X POST -H "Authorization: Bearer GenerateAStrongSecretToken123!" \
        -H "Content-Type: application/json" \
        -d '{"whatsappNumber":"918208497838","availabilityStatus":"Available for select Q1 projects"}' \
        https://your-backend.up.railway.app/api/admin/settings
   ```
4. **How to Replace Resume PDF**:
   Simply drop your updated PDF file into `/assets/Omkar-Phapal-Resume.pdf` and commit to Git. Vercel will deploy the new resume automatically.

---

### Final Launch Checklist

- [x] 3D Office animation checksums verified and preserved.
- [x] Official resume PDF (`Omkar-Phapal-Resume.pdf`) available for view and download.
- [x] Verified resume projects featured: DependencyX-Ray Pro, SignalZero Pro, HackMate.
- [x] Direct WhatsApp click-to-chat active (`https://wa.me/918208497838`).
- [x] GitHub repository modal sorting descending by `updated_at`.
- [x] Clean light-first editorial background with architectural grid texture.
- [x] Privacy-first anonymous visitor analytics (`/api/analytics/track`).
- [x] Spring Boot Railway health check endpoint (`/health`) active.
