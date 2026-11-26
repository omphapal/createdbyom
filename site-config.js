(function (global) {
  'use strict';

  /**
   * Central configuration for Omkar Phapal's freelance portfolio.
   * Update `availability`, `siteUrl`, or project links here without editing HTML templates.
   */
  global.OMKAR_SITE_CONFIG = Object.assign({
    name: 'Omkar Phapal',
    brand: 'Omkar Phapal — Freelance Developer',
    role: 'BCA Graduate | Java & Spring Boot Developer',
    location: 'Pune, Maharashtra, India',
    email: 'Omphapal181@gmail.com',
    phone: '918208497838',
    githubUser: 'omphapal',
    githubUrl: 'https://github.com/omphapal',
    linkedin: 'https://linkedin.com/in/omkarphapal01',
    bookingUrl: '',
    resumeUrl: '/assets/omkar-phapal-cv.pdf',
    apiBaseUrl: '',
    // Set your production HTTPS domain (e.g. 'https://omkarphapal.dev') to emit canonical/og:url tags.
    siteUrl: '',
    availability: {
      available: true,
      label: 'Available for freelance projects',
      detail: 'Accepting websites, Android apps, SaaS products, Java/Spring Boot backends, and REST API projects'
    }
  }, global.OMKAR_SITE_CONFIG || {});

  /**
   * Editable single source of truth for portfolio projects.
   * Fill in `repoUrl`, `demoUrl`, or `screenshots` as public links/assets become available.
   */
  global.OMKAR_PROJECTS = [
    {
      slug: 'learning-management-system',
      title: 'Learning Management System (LMS)',
      category: 'Full-Stack',
      categories: ['Full-Stack', 'Backend & APIs'],
      tagline: 'Modular education platform with centralized API gateway and student lifecycle modules.',
      summary: 'A full-stack Learning Management System uniting learning content, assignments, attendance, assessments, analytics, and placement workflows behind a centralized API gateway.',
      problem: 'Institutions and training cohorts often rely on disconnected spreadsheets and separate tools for attendance, assignments, exams, and placement tracking.',
      solution: 'Structured modular backend services in Java and Spring Boot paired with a React interface, event-driven messaging, and relational persistence.',
      features: [
        'Centralized API gateway routing across learning modules',
        'Course delivery, assignments, and assessment tracking',
        'Attendance logging and student progress analytics',
        'Placement coordination module for graduating cohorts'
      ],
      stack: ['Java', 'Spring Boot', 'REST APIs', 'React', 'MySQL', 'Kafka', 'Redis', 'Docker', 'Kubernetes'],
      repoUrl: '',
      demoUrl: '',
      needsInputNote: 'Add verified GitHub repository URL, live demo URL, and screenshots when ready.',
      caseStudyUrl: '/project/learning-management-system'
    },
    {
      slug: 'crm-application',
      title: 'CRM Application',
      category: 'Full-Stack',
      categories: ['Full-Stack', 'Backend & APIs'],
      tagline: 'Customer, lead, and follow-up management system built for growing businesses.',
      summary: 'A practical Customer Relationship Management application designed to track leads, client communications, follow-up tasks, and sales pipeline status in one clean interface.',
      problem: 'Small teams lose track of client inquiries and follow-ups when contact notes are scattered across emails and spreadsheets.',
      solution: 'Built a Spring Boot REST backend backed by relational SQL storage and a responsive HTML/CSS/JavaScript frontend for quick daily pipeline updates.',
      features: [
        'Lead and customer directory with status stages',
        'Interaction notes and follow-up task tracking',
        'Validated REST endpoints for search, filtering, and updates',
        'Structured SQL schema for reliable reporting'
      ],
      stack: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'HTML', 'CSS', 'JavaScript'],
      repoUrl: '',
      demoUrl: '',
      needsInputNote: 'Add verified GitHub repository URL, live demo URL, and screenshots when ready.',
      caseStudyUrl: '/project/crm-application'
    },
    {
      slug: 'payment-gateway',
      title: 'Payment Gateway Platform',
      category: 'Backend & APIs',
      categories: ['Backend & APIs', 'Full-Stack'],
      tagline: 'Microservices payment processing architecture with merchant dashboards and transaction analytics.',
      summary: 'A Razorpay-inspired personal project exploring a microservices payment platform, secure transaction APIs, merchant dashboards, and payment status analytics.',
      problem: 'Payment workflows require strict separation of concerns, reliable state transitions, and clear merchant visibility into transaction lifecycles.',
      solution: 'Designed independent Spring Boot and Spring Cloud services communicating via REST and Kafka, backed by MySQL and Redis with a React merchant console.',
      features: [
        'Microservices architecture using Spring Boot and Spring Cloud',
        'Secure REST APIs for payment initiation and status tracking',
        'Merchant dashboard for viewing transactions and analytics',
        'Asynchronous event handling and caching with Kafka and Redis'
      ],
      stack: ['Java', 'Spring Boot', 'Spring Cloud', 'REST APIs', 'React', 'Kafka', 'Redis', 'MySQL'],
      repoUrl: '',
      demoUrl: '',
      needsInputNote: 'Add verified GitHub repository URL, live demo URL, and screenshots when ready.',
      caseStudyUrl: '/project/payment-gateway'
    },
    {
      slug: 'expense-tracker-api',
      title: 'Expense Tracker API',
      category: 'Backend & APIs',
      categories: ['Backend & APIs'],
      tagline: 'Clean RESTful Spring Boot service for tracking expenses, categories, and budget summaries.',
      summary: 'A backend REST API built with Java and Spring Boot to record daily expenses, organize spending categories, filter transactions by date range, and summarize totals.',
      problem: 'Personal finance and small-business expense tools need dependable validation, clean API contracts, and accurate category-level SQL aggregation.',
      solution: 'Implemented layered Spring Boot controllers, service validation, global error handling, and SQL-backed persistence.',
      features: [
        'RESTful CRUD endpoints for expenses and categories',
        'Date-range and category filtering queries',
        'Input validation and structured error responses',
        'Relational SQL persistence for accurate summaries'
      ],
      stack: ['Java', 'Spring Boot', 'REST APIs', 'SQL'],
      repoUrl: '',
      demoUrl: '',
      needsInputNote: 'Add verified GitHub repository URL or API documentation link when ready.',
      caseStudyUrl: '/project/expense-tracker-api'
    },
    {
      slug: 'duplicate-file-name-finder',
      title: 'Duplicate File Name Finder',
      category: 'Tools & Utilities',
      categories: ['Tools & Utilities'],
      tagline: 'Lightweight Python utility for scanning directories and surfacing duplicate file names.',
      summary: 'A practical Python command-line utility that recursively scans folder trees to identify duplicate file names and keep large workspaces organized.',
      problem: 'Accumulated downloads, backups, and project folders frequently hide identically named files across nested subdirectories.',
      solution: 'Wrote a fast directory-walking Python script that groups file paths by filename and highlights duplicates clearly.',
      features: [
        'Recursive directory traversal across nested folders',
        'Groups duplicate file names with full path reporting',
        'Simple, dependency-free Python execution'
      ],
      stack: ['Python'],
      repoUrl: 'https://github.com/omphapal/duplicate-file-name-finder',
      demoUrl: '',
      needsInputNote: '',
      caseStudyUrl: '/project/duplicate-file-name-finder'
    }
  ];

  // Emit canonical and og:url dynamically only when an explicit HTTPS domain is configured
  // or when running on a non-local HTTPS host.
  (function applyCanonical() {
    var configured = (global.OMKAR_SITE_CONFIG.siteUrl || '').replace(/\/+$/, '');
    var origin = configured || (location.protocol === 'https:' && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) ? location.origin : '');
    if (!origin) return;

    var canonicalHref = origin + location.pathname;
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;

    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalHref);
  })();
})(window);
