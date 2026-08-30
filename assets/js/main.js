/**
 * KIDER — Kids Daycare & Childcare Center
 * Main JavaScript
 * ============================================================
 * Pattern: burger toggle, active nav, [data-year],
 *   IntersectionObserver for .reveal, [data-form] handling,
 *   prefers-reduced-motion support.
 * ============================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------
     1. Reduced Motion Preference
     -------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* --------------------------------------------------------
     2. Burger Toggle
     -------------------------------------------------------- */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close nav on link click (mobile)
    var navLinks = nav.querySelectorAll('.nav__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        nav.classList.remove('active');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (
        nav.classList.contains('active') &&
        !nav.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        burger.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------
     3. Active Navigation Link
     -------------------------------------------------------- */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var navLinkEls = document.querySelectorAll('.nav__link');

  navLinkEls.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });

  /* --------------------------------------------------------
     4. [data-year] Auto-Fill
     -------------------------------------------------------- */
  var yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --------------------------------------------------------
     5. IntersectionObserver — .reveal Animations
     -------------------------------------------------------- */
  if (!prefersReducedMotion) {
    var revealEls = document.querySelectorAll(
      '.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger'
    );

    if ('IntersectionObserver' in window && revealEls.length > 0) {
      var observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
      };

      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback: show everything immediately
      revealEls.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  } else {
    // Reduced motion: show all elements without animation
    var allReveals = document.querySelectorAll(
      '.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger'
    );
    allReveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --------------------------------------------------------
     6. [data-form] Form Handling
     -------------------------------------------------------- */
  var forms = document.querySelectorAll('[data-form]');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var okMsg = form.querySelector('.form-ok');
      var errMsg = form.querySelector('.form-err');
      var submitBtn = form.querySelector('[type="submit"]');

      // Reset messages
      if (okMsg) okMsg.classList.remove('visible');
      if (errMsg) errMsg.classList.remove('visible');

      // Basic validation
      var requiredFields = form.querySelectorAll('[required]');
      var allValid = true;

      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          allValid = false;
          field.style.borderColor = '#DC2626';
        } else {
          field.style.borderColor = '';
        }
      });

      // Email validation
      var emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          allValid = false;
          emailField.style.borderColor = '#DC2626';
        }
      }

      // Phone validation (optional but if provided, basic check)
      var phoneField = form.querySelector('input[type="tel"]');
      if (phoneField && phoneField.value) {
        var phoneClean = phoneField.value.replace(/[\s\-\(\)\.]/g, '');
        if (phoneClean.length < 7) {
          allValid = false;
          phoneField.style.borderColor = '#DC2626';
        }
      }

      if (!allValid) {
        if (errMsg) errMsg.classList.add('visible');
        return;
      }

      // Simulate submission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        }

        if (okMsg) {
          okMsg.classList.add('visible');
        }

        form.reset();

        // Hide success after 6 seconds
        setTimeout(function () {
          if (okMsg) okMsg.classList.remove('visible');
        }, 6000);
      }, 1200);
    });

    // Clear error borders on input
    var inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  });

  /* --------------------------------------------------------
     7. Smooth Scroll for Anchor Links
     -------------------------------------------------------- */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    });
  });

  /* --------------------------------------------------------
     8. Counter Animation for Stats
     -------------------------------------------------------- */
  var counterEls = document.querySelectorAll('[data-count]');

  if (counterEls.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.getAttribute('data-count'), 10);
            var duration = prefersReducedMotion ? 0 : 1500;
            var startTime = null;

            function animateCounter(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);

              // Ease out cubic
              var eased = 1 - Math.pow(1 - progress, 3);
              var current = Math.floor(eased * target);

              el.textContent = current.toLocaleString() + (el.dataset.suffix || '');

              if (progress < 1) {
                requestAnimationFrame(animateCounter);
              } else {
                el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
              }
            }

            if (duration === 0) {
              el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
            } else {
              requestAnimationFrame(animateCounter);
            }

            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* --------------------------------------------------------
     9. Header Scroll Effect
     -------------------------------------------------------- */
  var header = document.querySelector('.header');
  if (header) {
    var lastScroll = 0;

    window.addEventListener(
      'scroll',
      function () {
        var currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
          header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
          header.style.boxShadow = '';
        }

        lastScroll = currentScroll;
      },
      { passive: true }
    );
  }
})();
