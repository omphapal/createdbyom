(function (global) {
  'use strict';

  /**
   * Omkar Phapal — Portfolio Master Configuration V3
   * Verified single source of truth for personal data, verified projects, and settings.
   */
  global.OMKAR_SITE_CONFIG = Object.assign({
    name: 'Omkar Phapal',
    brand: 'Omkar Phapal — Freelance Developer',
    role: 'BCA Graduate | Java & Spring Boot Developer',
    location: 'Pune, Maharashtra, India',
    email: 'Omphapal181@gmail.com',
    phone: '8208497838',
    whatsapp: {
      enabled: true,
      number: '918208497838',
      defaultMessage: 'Hello Omkar, I visited your portfolio and would like to discuss a project.',
      floatingShortcut: true
    },
    githubUser: 'omphapal',
    githubUrl: 'https://github.com/omphapal',
    linkedin: 'https://linkedin.com/in/omkarphapal01',
    bookingUrl: '',
    resumeUrl: '/assets/Omkar-Phapal-Resume.pdf',
    siteUrl: '',
    availability: {
      available: true,
      label: 'Available for freelance projects',
      detail: 'Accepting websites, Java & Spring Boot backends, REST APIs, and business web applications'
    }
  }, global.OMKAR_SITE_CONFIG || {});

  /**
   * Verified projects from actual resume and source files.
   */
  global.OMKAR_PROJECTS = [
    {
      slug: 'dependency-x-ray-pro',
      title: 'DependencyX-Ray Pro',
      category: 'Full-Stack & Security',
      categories: ['Full-Stack', 'Backend & APIs', 'Security'],
      tagline: 'Vulnerability scanner analyzing Java project dependencies with an explainable risk engine.',
      summary: 'A full-stack web application that scans uploaded Java projects (ZIP, standalone pom.xml or Git repo) and reports vulnerable direct and transitive dependencies with evidence-backed upgrade advisories.',
      problem: 'Developers often unknowingly inherit high-risk CVE vulnerabilities through deep transitive Maven dependencies without clear visibility into fix compatibility.',
      solution: 'Parses project metadata in a restricted Docker container, matches direct and transitive libraries against OSV and NVD advisories, and provides an interactive dependency graph with upgrade recommendations.',
      features: [
        'Maven metadata analyzer building complete direct & transitive dependency inventories',
        'Automated matching against public security advisories (OSV / NVD / CVE)',
        'Explainable risk prioritization engine scoring by severity, path, and fix availability',
        'Interactive React dependency graph with downloadable scan reports',
        'Restricted Docker container execution treating every project upload as untrusted input'
      ],
      stack: ['Java', 'Spring Boot', 'Maven', 'React', 'Vite', 'MySQL', 'Docker', 'REST APIs'],
      repoUrl: 'https://github.com/omphapal',
      demoUrl: '',
      screenshots: []
    },
    {
      slug: 'signalzero-pro',
      title: 'SignalZero Pro',
      category: 'Mobile & Offline Mesh',
      categories: ['Mobile', 'Backend & APIs'],
      tagline: 'Offline-first Android SOS relay app communicating over Bluetooth LE and Wi-Fi Direct.',
      summary: 'An offline-first emergency message relay application enabling communication during cellular outages using Bluetooth LE and Wi-Fi Direct mesh store-and-forward protocols.',
      problem: 'During natural disasters and cellular network failures, victims cannot transmit emergency SOS messages to nearby responders or family.',
      solution: 'Engineered an offline store-and-forward mesh relay protocol with duplicate detection, cryptographic message integrity, and local SQLite (Room) persistence.',
      features: [
        'Device-to-device SOS dispatch over Bluetooth LE, Wi-Fi Direct, and QR exchange',
        'Store-and-forward relay protocol with unique ID, TTL expiry, and priority rules',
        'Local SQLite (Room) storage for emergency contacts, instructions, and offline maps',
        'Cryptographic message encryption with sender signing-key authentication',
        'Optional Spring Boot sync backend that uploads telemetry when connectivity returns'
      ],
      stack: ['Kotlin', 'Android', 'Room (SQLite)', 'Spring Boot', 'Bluetooth LE', 'Wi-Fi Direct'],
      repoUrl: 'https://github.com/omphapal',
      demoUrl: '',
      screenshots: []
    },
    {
      slug: 'hackmate',
      title: 'HackMate (In Progress)',
      category: 'Full-Stack & Collaboration',
      categories: ['Full-Stack', 'Backend & APIs'],
      tagline: 'Real-time team collaboration platform for hackathon squads with tasks and messaging.',
      summary: 'A purpose-built team collaboration workspace designed for hackathons, featuring team formation, real-time messaging, deadline tracking, and task delegation.',
      problem: 'Hackathon participants lose crucial time juggling scattered Discord channels, Kanban boards, and polling tools during tight 24-48 hour sprints.',
      solution: 'Developing an all-in-one workspace uniting WebSocket chat, task delegation, team invites, and deadline coordination powered by Spring Boot and React.',
      features: [
        'Real-time team communication and group messaging via WebSockets',
        'Task assignment board with instant status updates and deadline reminders',
        'Team invitations, join requests, and member role coordination',
        'Interactive team polls for rapid architecture decisions under pressure',
        'JWT token authentication with Spring Security and MySQL relational persistence'
      ],
      stack: ['Java', 'Spring Boot', 'React', 'WebSocket', 'Spring Security', 'JWT', 'MySQL'],
      repoUrl: 'https://github.com/omphapal',
      demoUrl: '',
      screenshots: []
    },
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
      stack: ['Java', 'Spring Boot', 'REST APIs', 'React', 'MySQL', 'Kafka', 'Redis'],
      repoUrl: 'https://github.com/omphapal',
      demoUrl: '',
      screenshots: []
    },
    {
      slug: 'crm-application',
      title: 'CRM Business Application',
      category: 'Business Software',
      categories: ['Full-Stack', 'Backend & APIs'],
      tagline: 'Customer relationship and lead management platform with pipeline tracking.',
      summary: 'A customer relationship management tool built to organize leads, monitor deal pipelines, record interactions, and automate client follow-ups for service businesses.',
      problem: 'Small businesses lose client leads and follow-up opportunities when enquiry details are buried across unstructured inboxes and notes.',
      solution: 'Engineered a unified lead capture pipeline with status tracking, client timeline history, and notification triggers using Spring Boot and SQL.',
      features: [
        'Lead and customer record management with pipeline stages',
        'Interaction history logging and scheduled follow-up alerts',
        'Searchable database with stage filters and export capabilities',
        'RESTful service layer designed for web and mobile frontends'
      ],
      stack: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'JavaScript', 'HTML5', 'CSS3'],
      repoUrl: 'https://github.com/omphapal',
      demoUrl: '',
      screenshots: []
    }
  ];

})(typeof window !== 'undefined' ? window : this);
