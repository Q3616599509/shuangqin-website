/* Animations - 丰富的动态特效 */

document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  initCounterAnimation();
  initHeroParticles();
  initMouseGlow();
  initCardTilt();
  initGradientFlow();
  initParallaxScroll();
  initTextScramble();
  initMagneticButtons();
});

/* ===== 1. Scroll-triggered fade-in animations ===== */
function initScrollAnimations() {
  var animatedElements = document.querySelectorAll('.fade-in-up, .fade-in, .scale-in');
  if (animatedElements.length === 0) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });
}

/* ===== 2. Counter animation with enhanced easing ===== */
function initCounterAnimation() {
  var counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length === 0) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'));
        var duration = 2500;
        var startTime = null;

        function easeOutExpo(t) {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function updateCounter(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = easeOutExpo(progress);
          var current = Math.floor(eased * target);
          el.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target.toLocaleString();
            el.classList.add('counter-done');
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(counter) {
    observer.observe(counter);
  });
}

/* ===== 3. Enhanced Hero Particles with connection lines ===== */
function initHeroParticles() {
  var container = document.querySelector('.hero-particles');
  if (!container) return;

  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  container.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount = 60;
  var connectionDistance = 120;
  var mouse = { x: null, y: null };

  function resize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Track mouse
  container.addEventListener('mousemove', function(e) {
    var rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  container.addEventListener('mouseleave', function() {
    mouse.x = null;
    mouse.y = null;
  });

  // Create particles
  for (var i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          var force = (100 - dist) / 100;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + p.opacity + ')';
      ctx.fill();
    }

    // Draw connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          var opacity = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(184, 134, 11, ' + opacity + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ===== 4. Mouse Glow Effect ===== */
function initMouseGlow() {
  var hero = document.querySelector('.hero');
  if (!hero) return;

  var glow = document.createElement('div');
  glow.className = 'mouse-glow';
  glow.style.cssText = 'position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle, var(--theme-glow-color) 0%, transparent 70%);pointer-events:none;transform:translate(-50%,-50%);transition:opacity 0.3s;opacity:0;z-index:1;';
  hero.appendChild(glow);

  hero.addEventListener('mousemove', function(e) {
    var rect = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top = (e.clientY - rect.top) + 'px';
    glow.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', function() {
    glow.style.opacity = '0';
  });
}

/* ===== 5. 3D Card Tilt Effect ===== */
function initCardTilt() {
  var cards = document.querySelectorAll('.card, .stat-card, .client-item');

  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = (y - centerY) / 10;
      var rotateY = (centerX - x) / 10;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(10px)';
      card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.transition = 'transform 0.5s ease-out';
    });
  });
}

/* ===== 6. Gradient Flow Background ===== */
function initGradientFlow() {
  var sections = document.querySelectorAll('.section-primary, .hero');

  sections.forEach(function(section) {
    var flow = document.createElement('div');
    flow.className = 'gradient-flow';
    flow.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;';
    section.style.position = 'relative';
    section.insertBefore(flow, section.firstChild);

    // Move existing content above flow
    var children = Array.from(section.children);
    children.forEach(function(child) {
      if (child !== flow) {
        child.style.position = 'relative';
        child.style.zIndex = '1';
      }
    });

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
    flow.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var time = 0;

    function resize() {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var gradient = ctx.createRadialGradient(
        canvas.width * (0.3 + Math.sin(time) * 0.2),
        canvas.height * (0.3 + Math.cos(time * 0.7) * 0.2),
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      );

      gradient.addColorStop(0, 'rgba(75, 0, 130, 0.3)');
      gradient.addColorStop(0.5, 'rgba(123, 45, 142, 0.15)');
      gradient.addColorStop(1, 'rgba(26, 26, 46, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Second flowing orb
      var gradient2 = ctx.createRadialGradient(
        canvas.width * (0.7 + Math.cos(time * 0.8) * 0.2),
        canvas.height * (0.6 + Math.sin(time * 0.6) * 0.2),
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.6
      );

      gradient2.addColorStop(0, 'rgba(184, 134, 11, 0.1)');
      gradient2.addColorStop(1, 'rgba(26, 26, 46, 0)');

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(draw);
    }
    draw();
  });
}

/* ===== 7. Parallax Scroll Effect ===== */
function initParallaxScroll() {
  var parallaxElements = document.querySelectorAll('.section-header, .hero-content');

  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;

    parallaxElements.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var speed = 0.3;
      var offset = (window.innerHeight - rect.top) * speed;
      el.style.transform = 'translateY(' + (offset * 0.05) + 'px)';
    });
  });
}

/* ===== 8. Text Scramble Effect for Hero Title ===== */
function initTextScramble() {
  var title = document.querySelector('.hero-title');
  if (!title) return;

  var chars = '!<>-_\\/[]{}—=+*^?#________';
  var originalText = title.innerHTML;
  var isScrambling = false;

  function scramble() {
    if (isScrambling) return;
    isScrambling = true;

    var iterations = 0;
    var maxIterations = 15;

    var interval = setInterval(function() {
      title.innerHTML = originalText.replace(/<[^>]*>/g, function(tag) {
        return tag;
      }).replace(/[^<\/>]/g, function(char, index) {
        if (index < iterations) {
          return originalText.replace(/<[^>]*>/g, '')[index] || char;
        }
        return chars[Math.floor(Math.random() * chars.length)];
      });

      iterations += 1;
      if (iterations > maxIterations) {
        clearInterval(interval);
        title.innerHTML = originalText;
        isScrambling = false;
      }
    }, 50);
  }

  // Trigger scramble on load after a delay
  setTimeout(scramble, 800);

  // Trigger on hover
  title.addEventListener('mouseenter', scramble);
}

/* ===== 9. Magnetic Button Effect ===== */
function initMagneticButtons() {
  var buttons = document.querySelectorAll('.btn, .client-cat-btn');

  buttons.forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });

    btn.addEventListener('mouseleave', function() {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.3s ease-out';
    });

    btn.addEventListener('mouseenter', function() {
      btn.style.transition = 'transform 0.1s ease-out';
    });
  });
}
