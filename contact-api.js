(function () {
  'use strict';

  function getEndpoint() {
    var config = window.OMKAR_SITE_CONFIG || {};
    if (config.apiBaseUrl) {
      return config.apiBaseUrl.replace(/\/+$/, '') + '/api/enquiries';
    }
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '[::1]') {
      return 'http://localhost:8080/api/enquiries';
    }
    return location.origin + '/api/enquiries';
  }

  function field(form, selector) {
    return form.querySelector(selector);
  }

  function fieldValue(form, selectors) {
    for (var i = 0; i < selectors.length; i++) {
      var input = field(form, selectors[i]);
      if (input && typeof input.value === 'string') {
        var val = input.value.trim();
        if (val) return val;
      }
    }
    return '';
  }

  function selectedLabel(input) {
    var label = input.labels && input.labels[0];
    var visibleLabel = label && label.querySelector('.chip__label');
    return (visibleLabel || label || input).textContent.trim();
  }

  function collectServices(form) {
    var services = [];
    [].forEach.call(form.querySelectorAll('input[type="checkbox"]:checked'), function (input) {
      if (input.name !== 'website') {
        services.push(selectedLabel(input));
      }
    });
    var projectType = form.elements.project_type || form.querySelector('[data-name="Project type"]');
    if (projectType && projectType.value && projectType.value.trim()) {
      var typeVal = projectType.value.trim();
      if (services.indexOf(typeVal) === -1) services.push(typeVal);
    }
    return services;
  }

  function createPayload(form) {
    var selectedTimelineRadio = form.querySelector('input[type="radio"]:checked');
    var timelineSelect = form.elements.timeline || form.querySelector('[data-name="Timeline"]');
    var timeline = selectedTimelineRadio
      ? selectedLabel(selectedTimelineRadio)
      : (timelineSelect && timelineSelect.value ? timelineSelect.value.trim() : '');

    return {
      name: fieldValue(form, ['[data-name="Name"]', '[name="name"]']),
      email: fieldValue(form, ['[data-name="Email"]', '[name="email"]']),
      phone: fieldValue(form, ['[data-name="Phone number"]', '[name="phone"]']),
      company: fieldValue(form, ['[data-name="Company"]', '[name="business_name"]', '[name="company"]']),
      message: fieldValue(form, ['[data-name="Message"]', '[name="message"]']),
      services: collectServices(form),
      timeline: timeline,
      budget: fieldValue(form, ['[name="budget"]', '[data-name="Budget"]']),
      projectBrief: fieldValue(form, ['[data-name="Project brief"]', '[name="project_brief"]']),
      website: form.elements.website ? form.elements.website.value.trim() : ''
    };
  }

  function showState(form, selector, message) {
    var container = form.closest('.w-form') || form.parentElement;
    var state = container && container.querySelector(selector);
    if (!state) return;

    state.textContent = message;
    state.setAttribute('role', selector === '.w-form-done' ? 'status' : 'alert');
    state.setAttribute('tabindex', '-1');
    state.style.display = 'block';
    state.focus();
  }

  function setSubmitting(form, isSubmitting) {
    var button = form.querySelector('input[type="submit"], button[type="submit"]');
    if (!button) return;

    if (isSubmitting) {
      button.dataset.originalValue = button.tagName === 'INPUT' ? button.value : button.textContent;
      button.disabled = true;
      if (button.tagName === 'INPUT') button.value = 'Sending...';
      else button.textContent = 'Sending...';
      return;
    }

    button.disabled = false;
    if (button.dataset.originalValue) {
      if (button.tagName === 'INPUT') button.value = button.dataset.originalValue;
      else button.textContent = button.dataset.originalValue;
      delete button.dataset.originalValue;
    }
  }

  function handleSubmit(form, event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var payload = createPayload(form);
    if (payload.website) {
      showState(form, '.w-form-fail', 'The enquiry could not be accepted.');
      return;
    }

    var container = form.closest('.w-form') || form.parentElement;
    var success = container && container.querySelector('.w-form-done');
    var failure = container && container.querySelector('.w-form-fail');
    if (success) success.style.display = 'none';
    if (failure) failure.style.display = 'none';

    setSubmitting(form, true);
    form.setAttribute('aria-busy', 'true');

    fetch(getEndpoint(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.json().catch(function () {
        return {};
      }).then(function (body) {
        if (!response.ok) {
          throw new Error(body.detail || body.message || 'The enquiry could not be sent.');
        }
        if (!body.message) {
          throw new Error('The server did not confirm delivery.');
        }
        return body;
      });
    }).then(function (body) {
      form.reset();
      form.hidden = true;
      var email = (window.OMKAR_SITE_CONFIG && window.OMKAR_SITE_CONFIG.email) || 'Omphapal181@gmail.com';
      showState(form, '.w-form-done', body.message + ' Thank you — I will reply to your email (' + payload.email + ') soon, or you can reach me at ' + email + '.');
    }).catch(function (error) {
      console.error('Project enquiry submission failed:', error);
      var email = (window.OMKAR_SITE_CONFIG && window.OMKAR_SITE_CONFIG.email) || 'Omphapal181@gmail.com';
      showState(
        form,
        '.w-form-fail',
        (error && error.message ? error.message + ' ' : '') + 'Please try again or email ' + email + ' directly.'
      );
    }).finally(function () {
      form.removeAttribute('aria-busy');
      setSubmitting(form, false);
    });
  }

  function init() {
    document.querySelectorAll('#nav-contact-form, #email-form').forEach(function (form) {
      ['Phone number', 'Company'].forEach(function (dataName) {
        var optionalField = field(form, '[data-name="' + dataName + '"]');
        if (optionalField) optionalField.required = false;
      });

      form.addEventListener('submit', function (event) {
        handleSubmit(form, event);
      }, true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
