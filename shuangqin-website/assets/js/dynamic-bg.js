/* Dynamic Background - 高级动态背景系统 */

(function() {
  'use strict';

  var canvas = null;
  var ctx = null;
  var orbs = [];
  var waves = [];
  var particles = [];
  var mouse = { x: -1000, y: -1000 };
  var animationId = null;

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'purple';
  }

  function getThemeColors() {
    var theme = getTheme();
    if (theme === 'nature') {
      return {
        orbColors: [
          'rgba(45, 90, 39, 0.25)',
          'rgba(74, 138, 63, 0.2)',
          'rgba(196, 149, 106, 0.2)',
          'rgba(212, 184, 150, 0.15)'
        ],
        particleColor: 'rgba(74, 138, 63, 0.4)',
        lineColor: 'rgba(74, 138, 63, ',
        waveColors: [
          'rgba(45, 90, 39, 0.08)',
          'rgba(74, 138, 63, 0.06)',
          'rgba(196, 149, 106, 0.05)'
        ],
        bgColor1: '#f5f2eb',
        bgColor2: '#ede8de'
      };
    }
    return {
      orbColors: [
        'rgba(75, 0, 130, 0.25)',
        'rgba(123, 45, 142, 0.2)',
        'rgba(184, 134, 11, 0.2)',
        'rgba(212, 168, 67, 0.15)'
      ],
      particleColor: 'rgba(123, 45, 142, 0.4)',
      lineColor: 'rgba(184, 134, 11, ',
      waveColors: [
        'rgba(75, 0, 130, 0.08)',
        'rgba(123, 45, 142, 0.06)',
        'rgba(184, 134, 11, 0.05)'
      ],
      bgColor1: '#f8f9fa',
      bgColor2: '#f0f0f5'
    };
  }

  function init() {
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);

    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    createOrbs();
    createWaves();
    createParticles();
    animate();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /* 浮动光斑 - 大型模糊光球 */
  function createOrbs() {
    orbs = [];
    var colors = getThemeColors().orbColors;
    for (var i = 0; i < 5; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 150 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: colors[i % colors.length],
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  /* 波浪线条 - 底部流动波浪 */
  function createWaves() {
    waves = [];
    var colors = getThemeColors().waveColors;
    for (var i = 0; i < 3; i++) {
      waves.push({
        amplitude: 30 + i * 20,
        frequency: 0.005 + i * 0.002,
        speed: 0.02 + i * 0.01,
        offset: i * 100,
        color: colors[i],
        yOffset: canvas.height - 100 - i * 40
      });
    }
  }

  /* 粒子网络 - 小型连线粒子 */
  function createParticles() {
    particles = [];
    var count = Math.min(50, Math.floor(canvas.width / 30));
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.3
      });
    }
  }

  function animate() {
    var colors = getThemeColors();

    // 清除画布 - 渐变背景
    var bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, colors.bgColor1);
    bgGrad.addColorStop(1, colors.bgColor2);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制浮动光斑
    orbs.forEach(function(orb) {
      orb.x += orb.vx;
      orb.y += orb.vy;
      orb.pulse += 0.02;

      if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
      if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
      if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

      var pulseRadius = orb.radius + Math.sin(orb.pulse) * 20;
      var grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, pulseRadius);
      grad.addColorStop(0, orb.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 绘制波浪
    var time = Date.now() * 0.001;
    waves.forEach(function(wave) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (var x = 0; x <= canvas.width; x += 5) {
        var y = wave.yOffset + Math.sin(x * wave.frequency + time * wave.speed * 10) * wave.amplitude;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
    });

    // 绘制粒子网络
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // 鼠标吸引
      var dx = mouse.x - p.x;
      var dy = mouse.y - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        var force = (150 - dist) / 150;
        p.vx += (dx / dist) * force * 0.02;
        p.vy += (dy / dist) * force * 0.02;
      }

      // 限速
      var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1) {
        p.vx = (p.vx / speed) * 1;
        p.vy = (p.vy / speed) * 1;
      }

      // 画粒子
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = colors.particleColor.replace(/[\d.]+\)$/, p.opacity + ')');
      ctx.fill();
    });

    // 画连线
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          var opacity = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = colors.lineColor + opacity + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  // 主题切换时重新创建
  window._refreshDynamicBackground = function() {
    if (!canvas) return;
    createOrbs();
    createWaves();
    createParticles();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
