(function () {
  'use strict';

  var CONFIG = window.OMKAR_SITE_CONFIG || {};
  var PROJECTS = window.OMKAR_PROJECTS || [];
  var CACHE_KEY = 'omkar-github-repos-v3';
  var CACHE_TTL = 6 * 60 * 60 * 1000;

  function safeUrl(value) {
    if (!value) return '';
    try {
      var url = new URL(value, location.origin);
      return ['http:', 'https:'].indexOf(url.protocol) >= 0 ? url.href : '';
    } catch (e) {
      return '';
    }
  }

  function escapeHtml(value) {
    var div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
  }

  function createDialog() {
    var dialog = document.createElement('dialog');
    dialog.id = 'op-enhancements-dialog';
    dialog.className = 'op-enhancements-dialog';
    dialog.setAttribute('aria-labelledby', 'op-dialog-title');
    dialog.innerHTML = [
      '<div class="op-enhancements-dialog__inner">',
      '  <div class="op-enhancements-dialog__head">',
      '    <h2 id="op-dialog-title"></h2>',
      '    <button type="button" class="op-enhancements-dialog__close" aria-label="Close dialog">Close</button>',
      '  </div>',
      '  <div id="op-dialog-content"></div>',
      '</div>'
    ].join('');
    document.body.appendChild(dialog);
    dialog.querySelector('.op-enhancements-dialog__close').addEventListener('click', function () {
      dialog.close();
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    return dialog;
  }

  function openDialog(title, html) {
    var dialog = document.getElementById('op-enhancements-dialog') || createDialog();
    dialog.querySelector('#op-dialog-title').textContent = title;
    dialog.querySelector('#op-dialog-content').innerHTML = html;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  }

  function findProject(slug) {
    for (var i = 0; i < PROJECTS.length; i++) {
      if (PROJECTS[i].slug === slug) return PROJECTS[i];
    }
    return null;
  }

  function openProjectModal(project) {
    if (!project) return;
    var featuresHtml = (project.features || []).map(function (item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join('');
    var stackHtml = (project.stack || []).map(function (tech) {
      return '<span>' + escapeHtml(tech) + '</span>';
    }).join('');

    var actions = [];
    if (project.caseStudyUrl) {
      actions.push('<a href="' + escapeHtml(project.caseStudyUrl) + '">Open full case study</a>');
    }
    var repo = safeUrl(project.repoUrl);
    if (repo) {
      actions.push('<a href="' + escapeHtml(repo) + '" target="_blank" rel="noopener noreferrer">View on GitHub</a>');
    }
    var demo = safeUrl(project.demoUrl);
    if (demo) {
      actions.push('<a href="' + escapeHtml(demo) + '" target="_blank" rel="noopener noreferrer">Live Demo</a>');
    }

    var noteHtml = project.needsInputNote
      ? '<p class="op-editable-note">' + escapeHtml(project.needsInputNote) + '</p>'
      : '';

    openDialog(project.title, [
      '<div class="op-enhancements-grid">',
      '  <section>',
      '    <h3>Overview</h3>',
      '    <p>' + escapeHtml(project.summary) + '</p>',
      '    <h3>Problem It Solves</h3>',
      '    <p>' + escapeHtml(project.problem) + '</p>',
      '    <h3>Implementation</h3>',
      '    <p>' + escapeHtml(project.solution) + '</p>',
      '  </section>',
      '  <section>',
      '    <h3>Key Features</h3>',
      '    <ul>' + featuresHtml + '</ul>',
      '    <h3>Technologies Used</h3>',
      '    <div class="op-tags">' + stackHtml + '</div>',
      (actions.length ? '<div class="op-enhancements-actions">' + actions.join('') + '</div>' : ''),
      noteHtml,
      '  </section>',
      '</div>'
    ].join(''));
  }

  function initProjectFilters() {
    var filterBars = document.querySelectorAll('[data-op-filter-bar]');
    filterBars.forEach(function (bar) {
      var targetSelector = bar.getAttribute('data-op-filter-target') || '[data-op-project-grid]';
      var grid = document.querySelector(targetSelector);
      if (!grid) return;

      var buttons = bar.querySelectorAll('[data-filter]');
      var cards = grid.querySelectorAll('[data-categories]');
      var statusEl = document.querySelector('[data-op-filter-status]');

      function applyFilter(category) {
        var visibleCount = 0;
        cards.forEach(function (card) {
          var cats = (card.getAttribute('data-categories') || '').split(',').map(function (c) {
            return c.trim();
          });
          var match = category === 'All' || cats.indexOf(category) !== -1;
          card.hidden = !match;
          if (match) visibleCount++;
        });
        buttons.forEach(function (btn) {
          var active = btn.getAttribute('data-filter') === category;
          btn.setAttribute('aria-pressed', active ? 'true' : 'false');
          btn.classList.toggle('is-active', active);
        });
        if (statusEl) {
          statusEl.textContent = 'Showing ' + visibleCount + (visibleCount === 1 ? ' project' : ' projects') +
            (category === 'All' ? '.' : ' in ' + category + '.');
        }
      }

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          applyFilter(btn.getAttribute('data-filter') || 'All');
        });
      });
    });

    document.querySelectorAll('[data-op-project-modal]').forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        var project = findProject(trigger.getAttribute('data-op-project-modal'));
        openProjectModal(project);
      });
    });
  }

  function initGithubRepos() {
    var container = document.querySelector('[data-op-github-repos]');
    if (!container || !CONFIG.githubUser) return;

    var status = container.querySelector('[data-op-github-status]');
    var listEl = container.querySelector('[data-op-github-list]');
    if (!listEl) return;

    function render(repos, note) {
      if (status) status.textContent = note;
      listEl.innerHTML = '';
      if (!repos || !repos.length) {
        listEl.innerHTML = '<p class="op-section__subtitle">Public repositories can be explored directly on <a href="' +
          escapeHtml(CONFIG.githubUrl || 'https://github.com/omphapal') + '" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>';
        return;
      }
      repos.forEach(function (repo) {
        var card = document.createElement('article');
        card.className = 'op-project-card';

        var top = document.createElement('div');
        top.className = 'op-project-card__top';
        var badge = document.createElement('span');
        badge.className = 'op-project-card__cat';
        badge.textContent = repo.language || 'Repository';
        top.appendChild(badge);

        var title = document.createElement('h3');
        title.className = 'op-project-card__title';
        title.textContent = repo.name;

        var desc = document.createElement('p');
        desc.className = 'op-project-card__desc';
        desc.textContent = repo.description || 'Public repository by Omkar Phapal.';

        var actions = document.createElement('div');
        actions.className = 'op-project-card__actions';
        var url = safeUrl(repo.html_url);
        if (url) {
          var a = document.createElement('a');
          a.className = 'op-link-btn op-link-btn--accent';
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = 'View on GitHub';
          actions.appendChild(a);
        }

        card.appendChild(top);
        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(actions);
        listEl.appendChild(card);
      });
    }

    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cached && Date.now() - cached.savedAt < CACHE_TTL && Array.isArray(cached.data)) {
        render(cached.data, 'Public GitHub repositories for @' + CONFIG.githubUser + '.');
        return;
      }
    } catch (e) {}

    fetch('https://api.github.com/users/' + encodeURIComponent(CONFIG.githubUser) + '/repos?per_page=12&sort=updated', {
      headers: { 'Accept': 'application/vnd.github+json' }
    }).then(function (response) {
      if (!response.ok) throw new Error('GitHub request failed');
      return response.json();
    }).then(function (repos) {
      var filtered = (repos || []).filter(function (r) { return !r.fork && !r.archived; }).slice(0, 6);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data: filtered }));
      } catch (e) {}
      render(filtered, 'Public GitHub repositories for @' + CONFIG.githubUser + '.');
    }).catch(function () {
      render([{
        name: 'duplicate-file-name-finder',
        language: 'Python',
        description: 'Python utility project for finding duplicate file names across directories.',
        html_url: 'https://github.com/omphapal/duplicate-file-name-finder'
      }], 'Showing verified public GitHub repository while live GitHub API is offline.');
    });
  }

  function initCopyButtons() {
    document.querySelectorAll('[data-op-copy]').forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-op-copy') || CONFIG.email || 'Omphapal181@gmail.com';
        var original = button.textContent;

        function confirmCopied() {
          button.textContent = 'Copied!';
          button.classList.add('is-copied');
          setTimeout(function () {
            button.textContent = original;
            button.classList.remove('is-copied');
          }, 2200);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(confirmCopied).catch(function () {
            fallbackCopy(value, confirmCopied);
          });
        } else {
          fallbackCopy(value, confirmCopied);
        }
      });
    });

    function fallbackCopy(text, done) {
      var area = document.createElement('textarea');
      area.value = text;
      area.className = 'op-sr-only';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
        done();
      } catch (e) {}
      area.remove();
    }
  }

  function initEstimator() {
    var host = document.querySelector('.nav-form__headline');
    if (!host || document.querySelector('[data-op-estimator-trigger]')) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'op-enhancements-button';
    button.setAttribute('data-op-estimator-trigger', 'true');
    button.textContent = 'Build a quick project brief';
    host.insertAdjacentElement('afterend', button);

    button.addEventListener('click', function () {
      openDialog('Project Brief Builder', [
        '<div class="op-field-row">',
        '  <label>Project type<select id="op-est-type">',
        '    <option>Website Development</option>',
        '    <option>Java &amp; Spring Boot Backend</option>',
        '    <option>REST API &amp; Integrations</option>',
        '    <option>Business Web Application</option>',
        '    <option>Database Design &amp; SQL</option>',
        '    <option>Website Improvements &amp; Maintenance</option>',
        '  </select></label>',
        '  <label>Budget range<select id="op-est-budget">',
        '    <option>Under ₹25,000 / $300</option>',
        '    <option>₹25,000 – ₹75,000 / $300 – $900</option>',
        '    <option>₹75,000+ / $900+</option>',
        '    <option>Prefer to discuss scope first</option>',
        '  </select></label>',
        '  <label>Expected timeline<select id="op-est-timeline">',
        '    <option>2–4 weeks</option>',
        '    <option>1–3 months</option>',
        '    <option>3–6 months</option>',
        '    <option>Flexible</option>',
        '  </select></label>',
        '  <label>Primary goal<input id="op-est-goals" type="text" placeholder="e.g. Launch client portal or REST API"></label>',
        '</div>',
        '<div class="op-enhancements-actions">',
        '  <button type="button" id="op-est-apply">Apply to enquiry form</button>',
        '  <button type="button" id="op-est-copy">Copy summary</button>',
        '</div>',
        '<div id="op-est-output" class="op-estimator-output" role="status">Select options above to prepare a clear project brief.</div>'
      ].join(''));

      var dialog = document.getElementById('op-enhancements-dialog');
      function buildSummary() {
        var type = dialog.querySelector('#op-est-type').value;
        var budget = dialog.querySelector('#op-est-budget').value;
        var timeline = dialog.querySelector('#op-est-timeline').value;
        var goals = dialog.querySelector('#op-est-goals').value.trim() || 'Not specified';
        var summary = 'Project type: ' + type + '\nGoal: ' + goals + '\nBudget range: ' + budget + '\nExpected timeline: ' + timeline;
        dialog.querySelector('#op-est-output').textContent = summary;
        return { summary: summary, budget: budget };
      }

      dialog.querySelector('#op-est-apply').addEventListener('click', function () {
        var result = buildSummary();
        document.querySelectorAll('#nav-contact-form, #email-form').forEach(function (form) {
          var brief = form.querySelector('[name="project_brief"]');
          if (brief) brief.value = result.summary;
          var budgetField = form.querySelector('[name="budget"]');
          if (budgetField && budgetField.tagName === 'SELECT') {
            for (var i = 0; i < budgetField.options.length; i++) {
              if (budgetField.options[i].value === result.budget || budgetField.options[i].text === result.budget) {
                budgetField.selectedIndex = i;
                break;
              }
            }
          }
        });
        dialog.close();
      });

      dialog.querySelector('#op-est-copy').addEventListener('click', function () {
        var result = buildSummary();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(result.summary).catch(function () {});
        }
      });
    });
  }

  function initMobileMenu() {
    var header = document.querySelector('.header');
    var menu = header && header.querySelector('.nav-menu');
    var openBtn = header && header.querySelector('[data-nav-open="menu"]');
    var closeBtn = header && header.querySelector('[data-nav-close]');
    if (!header || !menu || !openBtn) return;

    function setOpen(open) {
      header.classList.toggle('is-menu-open', open);
      menu.classList.toggle('is-open', open);
      openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    openBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(!header.classList.contains('is-menu-open'));
    }, true);

    if (closeBtn) {
      closeBtn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setOpen(false);
      }, true);
    }

    menu.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('is-menu-open')) {
        setOpen(false);
      }
    });
  }

  function initDrawerTriggers() {
    // Allow any custom CTA with [data-op-open-contact] to open the slide-out drawer or scroll to #contact
    document.querySelectorAll('[data-op-open-contact]').forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        var drawerTrigger = document.querySelector('[data-navform-open="bar"]');
        var inlineContact = document.getElementById('contact');
        if (drawerTrigger) {
          event.preventDefault();
          drawerTrigger.click();
        } else if (inlineContact) {
          event.preventDefault();
          inlineContact.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function initHeroCopy() {
    var hero = document.querySelector('.hero-statement');
    var copy = document.querySelector('.op-hero-content');
    if (!hero || !copy) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var frame = 0;

    function place() {
      frame = 0;
      var top = hero.getBoundingClientRect().top;
      var away = top < -window.innerHeight * 0.42;
      copy.classList.toggle('is-cleared', away);
      if (reduce && away) copy.style.transition = 'none';
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(place);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    place();
  }

  function initParallax() {
    var nodes = document.querySelectorAll('[data-op-parallax]');
    if (!nodes.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var frame = 0;

    function update() {
      frame = 0;
      var vh = window.innerHeight || 1;
      nodes.forEach(function (el) {
        if (el.closest('#glcanvas, .anim--wrapper, .hero-statement, .statement--wrapper')) return;
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > vh + 80) return;
        var depth = parseFloat(el.getAttribute('data-op-parallax')) || 0.1;
        var progress = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
        el.style.setProperty('--op-shift', (progress * depth * -70).toFixed(2) + 'px');
      });
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function initRevealObserver() {
    var items = document.querySelectorAll('[data-op-reveal]');
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    document.documentElement.classList.add('op-reveal-ready');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  function initVisibilityFailsafe() {
    // Guarantees text is never trapped hidden if third-party Webflow IX3 fails or is slow.
    setTimeout(function () {
      if (!document.documentElement.classList.contains('w-mod-ix3')) {
        document.documentElement.classList.add('w-mod-ix3');
      }
    }, 1500);
  }

  function initAvailability() {
    if (!CONFIG.availability) return;
    document.querySelectorAll('[data-op-availability-label]').forEach(function (el) {
      el.textContent = CONFIG.availability.label || 'Available for freelance projects';
    });
  }

  function initStudio() {
    document.querySelectorAll('[data-op-stage]').forEach(function (stage) {
      var buttons = stage.querySelectorAll('[data-op-view]');
      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          var view = button.getAttribute('data-op-view');
          stage.setAttribute('data-view', view);
          buttons.forEach(function (other) {
            other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
          });
        });
      });
    });
  }

  
  function renderCvHtml() {
    return [
      '<div class="op-cv-view">',
      '  <div class="op-cv-header">',
      '    <div>',
      '      <h3 class="op-cv-name">Omkar Phapal</h3>',
      '      <p class="op-cv-tagline">BCA Graduate | Java &amp; Spring Boot Developer | Freelance Software Engineer</p>',
      '      <p class="op-cv-meta"><span>Pune, Maharashtra, India</span> · <span>Omphapal181@gmail.com</span> · <span>+91 82084 97838</span></p>',
      '    </div>',
      '    <div class="op-cv-actions-top">',
      '      <a href="/assets/omkar-phapal-cv.pdf" download="Omkar-Phapal-CV.pdf" class="op-btn op-btn--primary op-btn--sm">Download PDF ↓</a>',
      '    </div>',
      '  </div>',
      '  <div class="op-cv-grid">',
      '    <section class="op-cv-section">',
      '      <h4>Technical Summary</h4>',
      '      <p>Results-driven freelance developer with a strong foundation in Java, Spring Boot, REST APIs, SQL, and modern web development. Experienced in building responsive websites, structured backend services, and practical enterprise workflows like CRMs and LMS platforms.</p>',
      '    </section>',
      '    <section class="op-cv-section">',
      '      <h4>Core Competencies</h4>',
      '      <ul class="op-cv-list">',
      '        <li><strong>Backend:</strong> Java, Spring Boot, RESTful APIs, Spring MVC, Microservices Architecture, Maven</li>',
      '        <li><strong>Database:</strong> SQL, MySQL, Schema Design, Relational Modeling, Query Optimization</li>',
      '        <li><strong>Frontend:</strong> HTML5, CSS3, Modern JavaScript (ES6+), Responsive Design, UI Components</li>',
      '        <li><strong>Tools:</strong> Git, GitHub, IntelliJ IDEA, VS Code, Postman, Linux CLI</li>',
      '      </ul>',
      '    </section>',
      '    <section class="op-cv-section">',
      '      <h4>Education</h4>',
      '      <p><strong>Bachelor of Computer Applications (BCA)</strong><br>Tilak Maharashtra Vidyapeeth, Pune, Maharashtra</p>',
      '    </section>',
      '    <section class="op-cv-section">',
      '      <h4>Verified Projects</h4>',
      '      <div class="op-cv-proj">',
      '        <h5>Learning Management System (LMS)</h5>',
      '        <p>Full-stack learning platform with API gateway, assignment tracking, and student attendance analytics in Java &amp; Spring Boot.</p>',
      '      </div>',
      '      <div class="op-cv-proj">',
      '        <h5>CRM Business Application</h5>',
      '        <p>Customer relationship &amp; lead pipeline manager featuring contact tracking, interaction logs, and automated follow-ups.</p>',
      '      </div>',
      '      <div class="op-cv-proj">',
      '        <h5>Payment Gateway Platform</h5>',
      '        <p>Secure transaction processing engine with HMAC signature verification, idempotent execution, and webhooks.</p>',
      '      </div>',
      '      <div class="op-cv-proj">',
      '        <h5>Expense Tracker REST API</h5>',
      '        <p>RESTful expense tracking backend with category analytics, date-range summaries, and token authentication.</p>',
      '      </div>',
      '      <div class="op-cv-proj">',
      '        <h5>Duplicate File Name Finder</h5>',
      '        <p>Desktop utility in Java for recursive directory scanning and filename collision management.</p>',
      '      </div>',
      '    </section>',
      '  </div>',
      '  <div class="op-cv-footer">',
      '    <a href="/assets/omkar-phapal-cv.pdf" download="Omkar-Phapal-CV.pdf" class="op-btn op-btn--primary">Download Official CV (PDF)</a>',
      '    <a href="/#contact" data-op-open-contact="1" class="op-btn op-btn--line">Hire Omkar</a>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function openCvModal() {
    openDialog('Curriculum Vitae — Omkar Phapal', renderCvHtml());
  }

  function initCvButtons() {
    document.querySelectorAll('[data-op-open-cv]').forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        openCvModal();
      });
    });
  }

  
  function initMagneticCards() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    var cards = document.querySelectorAll('.op-project-card, .op-service-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  function init() {
    initVisibilityFailsafe();
    initAvailability();
    initMobileMenu();
    initProjectFilters();
    initGithubRepos();
    initCopyButtons();
    initEstimator();
    initDrawerTriggers();
    initHeroCopy();
    initParallax();
    initStudio();
    initRevealObserver();
    initCvButtons();
    initMagneticCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
