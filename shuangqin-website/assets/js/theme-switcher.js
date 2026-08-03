/* Theme Switcher - 双主题切换系统 */

(function() {
  'use strict';

  var STORAGE_KEY = 'siteTheme';
  var DEFAULT_THEME = 'purple';

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    } catch (e) {
      return DEFAULT_THEME;
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('[Theme] 无法保存主题偏好');
    }
    updateSwitcherUI(theme);
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    var next = current === 'purple' ? 'nature' : 'purple';
    setTheme(next);
  }

  function createSwitcher() {
    var switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', '主题切换');

    var purpleBtn = document.createElement('button');
    purpleBtn.className = 'theme-btn theme-btn-purple';
    purpleBtn.setAttribute('aria-label', '深紫科技主题');
    purpleBtn.setAttribute('data-theme', 'purple');
    purpleBtn.innerHTML = '⚡';
    purpleBtn.title = '深紫科技风';

    var natureBtn = document.createElement('button');
    natureBtn.className = 'theme-btn theme-btn-nature';
    natureBtn.setAttribute('aria-label', '绿色自然古风');
    natureBtn.setAttribute('data-theme', 'nature');
    natureBtn.innerHTML = '🌿';
    natureBtn.title = '绿色自然古风';

    purpleBtn.addEventListener('click', function() { setTheme('purple'); });
    natureBtn.addEventListener('click', function() { setTheme('nature'); });

    switcher.appendChild(purpleBtn);
    switcher.appendChild(natureBtn);

    document.body.appendChild(switcher);

    return { purpleBtn: purpleBtn, natureBtn: natureBtn };
  }

  function updateSwitcherUI(theme) {
    var switcher = document.querySelector('.theme-switcher');
    if (!switcher) return;

    var buttons = switcher.querySelectorAll('.theme-btn');
    buttons.forEach(function(btn) {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function init() {
    // Apply saved theme immediately (before DOM ready to prevent flash)
    var savedTheme = getSavedTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Create switcher when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        createSwitcher();
        updateSwitcherUI(savedTheme);
      });
    } else {
      createSwitcher();
      updateSwitcherUI(savedTheme);
    }
  }

  // Expose API
  window.ThemeSwitcher = {
    set: setTheme,
    toggle: toggleTheme,
    get: function() {
      return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    }
  };

  init();
})();
