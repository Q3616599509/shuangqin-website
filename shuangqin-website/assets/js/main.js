/* Main JavaScript - Navigation & Core Interactions */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initSmoothScroll();
  initActiveNavLink();
});

/* Navigation */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  // Scroll shadow
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });

    // Close menu on link click
    menu.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }
}

/* Smooth scroll for anchor links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = document.querySelector('.nav').offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* Active nav link based on scroll position */
function initActiveNavLink() {
  var sections = document.querySelectorAll('section[id], [data-nav-section]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  window.addEventListener('scroll', function() {
    var current = '';
    var navHeight = document.querySelector('.nav').offsetHeight;

    sections.forEach(function(section) {
      var sectionTop = section.offsetTop - navHeight - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}
