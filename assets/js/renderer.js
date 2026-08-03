/* Renderer - 通用渲染引擎 */

var Renderer = (function() {

  // 获取当前页面名称
  function getCurrentPage() {
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';
    return filename;
  }

  // ===== 导航栏渲染 =====
  function renderNavigation(data) {
    var container = document.getElementById('nav-container');
    if (!container) return;

    var currentPage = getCurrentPage();
    var navLinks = [
      { id: 'home', label: '首页', href: 'index.html' },
      { id: 'about', label: '关于我们', href: 'about.html' },
      { id: 'services', label: '核心业务', href: 'services.html' },
      { id: 'qinboshi', label: '勤博士中心', href: 'qinboshi.html' },
      { id: 'contact', label: '联系我们', href: 'contact.html' }
    ];

    var linksHtml = navLinks.map(function(link) {
      var isActive = (currentPage === link.href) ? ' active' : '';
      return '<a href="' + link.href + '" class="nav-link' + isActive + '">' + link.label + '</a>';
    }).join('');

    container.innerHTML =
      '<nav class="nav">' +
        '<div class="nav-inner">' +
          '<a href="index.html" class="nav-logo">' +
            '<img src="assets/images/logo.png?v=3" alt="' + data.site.name + '" class="nav-logo-img">' +
            '<div class="nav-logo-text">' +
              '<span class="nav-logo-main">' + data.site.name + '</span>' +
              '<span class="nav-logo-sub">' + data.site.subtitle + '</span>' +
            '</div>' +
          '</a>' +
          '<div class="nav-menu">' +
            linksHtml +
          '</div>' +
          '<div class="nav-toggle"><span></span><span></span><span></span></div>' +
        '</div>' +
      '</nav>';
  }

  // ===== Footer 渲染 =====
  function renderFooter(data) {
    var container = document.getElementById('footer-container');
    if (!container) return;

    var columns = [
      {
        title: '关于爽勤',
        links: [
          { label: '公司简介', href: 'about.html' },
          { label: '创始人', href: 'about.html#founder' },
          { label: '核心团队', href: 'about.html#team' },
          { label: '发展历程', href: 'about.html#history' }
        ]
      },
      {
        title: '核心业务',
        links: [
          { label: '管理咨询', href: 'services.html#consulting' },
          { label: '数字化转型', href: 'services.html#digital' },
          { label: '技术支撑', href: 'services.html#tech' },
          { label: '勤博士中心', href: 'qinboshi.html' }
        ]
      },
      {
        title: '联系我们',
        links: [
          { label: '在线咨询', href: 'contact.html' },
          { label: '联系方式', href: 'contact.html#info' },
          { label: '加入我们', href: '#' },
          { label: '隐私政策', href: '#' }
        ]
      }
    ];

    var colsHtml = columns.map(function(col) {
      var linksHtml = col.links.map(function(l) {
        return '<a href="' + l.href + '" class="footer-link">' + l.label + '</a>';
      }).join('');
      return '<div><h4 class="footer-col-title">' + col.title + '</h4><div class="footer-links">' + linksHtml + '</div></div>';
    }).join('');

    container.innerHTML =
      '<footer class="footer">' +
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div class="footer-brand">' +
              '<a href="index.html" class="nav-logo">' +
                '<img src="assets/images/logo.png?v=3" alt="' + data.site.name + '" class="nav-logo-img">' +
                '<div class="nav-logo-text">' +
                  '<span class="nav-logo-main" style="color:var(--color-white)">' + data.site.name + '</span>' +
                  '<span class="nav-logo-sub">' + data.site.subtitle + '</span>' +
                '</div>' +
              '</a>' +
              '<p class="footer-brand-desc">' + data.site.footerDescription + '</p>' +
            '</div>' +
            colsHtml +
          '</div>' +
          '<div class="footer-bottom">' +
            '<span>' + data.site.copyright + '</span>' +
            '<span>' + data.site.icp + '</span>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  // ===== Hero 区域 =====
  function renderHero(data) {
    var container = document.getElementById('hero-container');
    if (!container) return;
    var h = data.hero;
    var buttonsHtml = h.buttons.map(function(b) {
      return '<a href="' + b.href + '" class="btn ' + b.class + '">' + b.label + '</a>';
    }).join('');
    container.innerHTML =
      '<section class="hero" id="home">' +
        '<div class="hero-particles"></div>' +
        '<div class="hero-content">' +
          '<div class="hero-badge fade-in-up">' + h.badge + '</div>' +
          '<h1 class="hero-title fade-in-up stagger-1">' + h.titleHtml + '</h1>' +
          '<p class="hero-subtitle fade-in-up stagger-2">' + h.subtitle.replace(/\n/g, '<br>') + '</p>' +
          '<div class="hero-actions fade-in-up stagger-3">' + buttonsHtml + '</div>' +
        '</div>' +
      '</section>';
  }

  // ===== 统计数字 =====
  function renderStats(data) {
    var container = document.getElementById('stats-container');
    if (!container || !data.stats) return;
    var html = '';
    data.stats.forEach(function(stat, i) {
      var numberHtml = stat.suffix
        ? '<span class="stat-number counter" data-target="' + stat.number + '">' + stat.number + '</span><span>' + stat.suffix + '</span>'
        : '<span class="stat-number counter" data-target="' + stat.number + '">' + stat.number + '</span>';
      html += '<div class="stat-card fade-in-up stagger-' + i + '">' +
        '<div class="stat-icon">' + stat.icon + '</div>' +
        '<div class="stat-number">' + numberHtml + '</div>' +
        '<div class="stat-label">' + stat.label + '</div>' +
      '</div>';
    });
    container.innerHTML = html;
  }

  // ===== 通用卡片渲染（核心业务、产品等） =====
  function renderCards(containerId, items, linkType, parentId) {
    var container = document.getElementById(containerId);
    if (!container || !items) return;

    var html = '';
    items.forEach(function(item, i) {
      var linkHref;
      if (linkType === 'business') {
        linkHref = 'detail.html?type=business&id=' + item.id;
      } else if (linkType === 'product') {
        linkHref = 'detail.html?type=product&id=' + item.id;
      } else if (linkType === 'sub' && parentId) {
        linkHref = 'detail.html?type=sub&id=' + item.id + '&parent=' + parentId;
      } else {
        linkHref = item.linkHref || '#';
      }

      html += '<div class="card fade-in-up stagger-' + i + '">' +
        '<div class="card-icon purple">' + item.icon + '</div>' +
        '<h3 class="card-title">' + item.title + '</h3>' +
        '<p class="card-desc">' + item.description + '</p>' +
        '<a href="' + linkHref + '" class="card-link">了解更多 →</a>' +
      '</div>';
    });
    container.innerHTML = html;
  }

  // ===== 产品卡片 =====
  function renderProducts(data) {
    renderCards('products-container', data.products, 'product');
  }

  // ===== 核心业务卡片 =====
  function renderCoreBusinesses(data) {
    renderCards('core-business-container', data.coreBusinesses, 'business');
  }

  // ===== 合作客户 =====
  function renderClients(data) {
    var container = document.getElementById('clients-container');
    if (!container || !data.clients) return;

    // 分类按钮
    var catContainer = document.getElementById('client-categories');
    if (catContainer && data.clients.categories) {
      catContainer.innerHTML = data.clients.categories.map(function(cat, i) {
        return '<button class="client-cat-btn' + (i === 0 ? ' active' : '') + '">' + cat + '</button>';
      }).join('');
      // 绑定筛选事件
      catContainer.querySelectorAll('.client-cat-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          catContainer.querySelectorAll('.client-cat-btn').forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          filterClients(btn.textContent, data.clients);
        });
      });
    }

    renderClientItems(data.clients.items);

    function filterClients(category, clientsData) {
      var filtered = category === '全部' ? clientsData.items : clientsData.items.filter(function(c) { return c.category === category; });
      renderClientItems(filtered);
    }

    function renderClientItems(items) {
      container.innerHTML = items.map(function(item) {
        var logoHtml = item.logo
          ? '<img src="' + item.logo + '" alt="' + item.name + '" class="client-logo-img">'
          : '<div class="client-logo-placeholder">' + item.name.charAt(0) + '</div>';
        return '<div class="client-item" data-category="' + item.category + '">' +
          '<div class="client-item-inner">' +
            '<div class="client-item-front">' + logoHtml + '</div>' +
            '<div class="client-item-back">' +
              '<div style="text-align:center;">' +
                '<div class="client-name">' + item.name + '</div>' +
                '<div class="client-name-sub">' + item.category + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }
  }

  // ===== 核心优势 =====
  function renderAdvantages(data) {
    var container = document.getElementById('advantages-container');
    if (!container || !data.advantages) return;
    container.innerHTML = data.advantages.map(function(a, i) {
      return '<div class="advantage-card fade-in-up stagger-' + i + '">' +
        '<div class="advantage-icon">' + a.icon + '</div>' +
        '<h3 class="advantage-title">' + a.title + '</h3>' +
        '<p class="advantage-desc">' + a.description + '</p>' +
      '</div>';
    }).join('');
  }

  // ===== 三步走战略时间线 =====
  function renderTimeline(data) {
    var container = document.getElementById('timeline-container');
    if (!container) return;
    var strategy = data.qinboshi ? data.qinboshi.strategy : data.strategy;
    if (!strategy) return;

    container.innerHTML = strategy.map(function(s, i) {
      return '<div class="timeline-item fade-in-up stagger-' + i + '">' +
        '<div class="timeline-dot"></div>' +
        '<div class="timeline-content">' +
          '<div class="timeline-step">' + s.step + '</div>' +
          '<h3 class="timeline-title">' + s.title + '</h3>' +
          '<p class="timeline-desc">' + s.description + '</p>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ===== 双轮驱动 =====
  function renderDualDrive(data) {
    var container = document.getElementById('dual-drive-container');
    if (!container) return;
    var dd = data.qinboshi ? data.qinboshi.dualDrive : data.dualDrive;
    if (!dd) return;

    var renderDrive = function(drive, cls) {
      var itemsHtml = drive.items.map(function(item) { return '<li>' + item + '</li>'; }).join('');
      return '<div class="drive-card ' + cls + '">' +
        '<div class="drive-label">' + drive.label + '</div>' +
        '<h3 class="drive-title">' + drive.title + '</h3>' +
        '<ul class="drive-list">' + itemsHtml + '</ul>' +
      '</div>';
    };

    container.innerHTML = renderDrive(dd.business, 'business') + renderDrive(dd.consumer, 'consumer');
  }

  // ===== 联系信息 =====
  function renderContactInfo(data) {
    var container = document.getElementById('contact-info-container');
    if (!container || !data.contact) return;
    container.innerHTML =
      '<div class="contact-info-item"><div class="contact-info-icon">📍</div><div><div class="contact-info-title">公司地址</div><div class="contact-info-text">' + data.contact.address + '</div></div></div>' +
      '<div class="contact-info-item"><div class="contact-info-icon">📧</div><div><div class="contact-info-title">电子邮箱</div><div class="contact-info-text">' + data.contact.email + '</div></div></div>' +
      '<div class="contact-info-item"><div class="contact-info-icon">📞</div><div><div class="contact-info-title">联系电话</div><div class="contact-info-text">' + data.contact.phone + '</div></div></div>' +
      '<div class="contact-info-item"><div class="contact-info-icon">🕐</div><div><div class="contact-info-title">服务时间</div><div class="contact-info-text">' + data.contact.serviceHours + '<br>' + data.contact.emergencyHours + '</div></div></div>';
  }

  // ===== 关于我们：公司简介 =====
  function renderAboutIntro(data) {
    var container = document.getElementById('about-intro-container');
    if (!container || !data.about) return;
    container.innerHTML =
      '<p style="font-size:var(--font-size-lg);color:var(--color-gray-600);line-height:1.8;margin-bottom:var(--spacing-lg);">' + data.about.intro.paragraph1 + '</p>' +
      '<p style="font-size:var(--font-size-lg);color:var(--color-gray-600);line-height:1.8;">' + data.about.intro.paragraph2 + '</p>';
  }

  // ===== 关于我们：组织架构 =====
  function renderDepartments(data) {
    var container = document.getElementById('departments-container');
    if (!container || !data.about || !data.about.departments) return;
    container.innerHTML = data.about.departments.map(function(d, i) {
      return '<div class="card fade-in-up stagger-' + i + '">' +
        '<div class="card-icon purple">' + d.icon + '</div>' +
        '<h3 class="card-title">' + d.title + '</h3>' +
        '<p class="card-desc">' + d.description + '</p>' +
      '</div>';
    }).join('');
  }

  // ===== 关于我们：创始人 =====
  function renderFounder(data) {
    var container = document.getElementById('founder-container');
    if (!container || !data.about || !data.about.founder) return;
    var f = data.about.founder;
    var statsHtml = f.stats.map(function(s) {
      return '<div class="stat-card"><div class="stat-number">' + s.number + '</div><div class="stat-label">' + s.label + '</div></div>';
    }).join('');

    container.innerHTML =
      '<div style="background:var(--color-white);border-radius:var(--border-radius-lg);padding:var(--spacing-2xl);box-shadow:var(--shadow-md);margin-bottom:var(--spacing-xl);">' +
        '<h2 style="font-size:var(--font-size-3xl);font-weight:700;color:var(--color-primary);margin-bottom:var(--spacing-xs);">' + f.name + '</h2>' +
        '<p style="color:var(--color-primary);font-weight:600;margin-bottom:var(--spacing-lg);">' + f.title + '</p>' +
        '<p style="color:var(--color-gray-600);line-height:1.8;margin-bottom:var(--spacing-md);">' + f.description1 + '</p>' +
        '<p style="color:var(--color-gray-600);line-height:1.8;">' + f.description2 + '</p>' +
      '</div>' +
      '<div class="stats-bar">' + statsHtml + '</div>';
  }

  // ===== 关于我们：服务能力 =====
  function renderCapabilities(data) {
    var container = document.getElementById('capabilities-container');
    if (!container || !data.about || !data.about.capabilities) return;
    container.innerHTML = data.about.capabilities.map(function(c, i) {
      return '<div class="card fade-in-up stagger-' + i + '">' +
        '<div class="card-icon purple">' + c.icon + '</div>' +
        '<h3 class="card-title">' + c.title + '</h3>' +
        '<p class="card-desc">' + c.description + '</p>' +
      '</div>';
    }).join('');
  }

  // ===== 勤博士中心：使命 =====
  function renderQinboshiMission(data) {
    var container = document.getElementById('qinboshi-mission-container');
    if (!container || !data.qinboshi) return;
    container.innerHTML = '<p style="font-size:var(--font-size-lg);color:var(--color-gray-600);line-height:1.8;text-align:center;">' + data.qinboshi.mission + '</p>';
  }

  // ===== 勤博士中心：生态节点 =====
  function renderEcosystem(data) {
    var container = document.getElementById('ecosystem-container');
    if (!container || !data.qinboshi || !data.qinboshi.ecosystem) return;
    var nodes = data.qinboshi.ecosystem.nodes;
    var nodesHtml = '';
    nodes.forEach(function(node, i) {
      if (i > 0) nodesHtml += '<div class="eco-connector"></div>';
      nodesHtml += '<div class="eco-node">' + node + '</div>';
    });
    container.innerHTML = nodesHtml + '<div class="eco-connector"></div><div class="eco-center">AI数字<br>共创中心</div>';
  }

  // ===== 勤博士中心：生态卡片 =====
  function renderEcosystemCards(data) {
    var container = document.getElementById('ecosystem-cards-container');
    if (!container || !data.qinboshi || !data.qinboshi.ecosystem) return;
    container.innerHTML = data.qinboshi.ecosystem.cards.map(function(c, i) {
      return '<div class="card fade-in-up stagger-' + i + '">' +
        '<div class="card-icon purple">🎓</div>' +
        '<h3 class="card-title">' + c.title + '</h3>' +
        '<p class="card-desc">' + c.description + '</p>' +
      '</div>';
    }).join('');
  }

  // ===== 勤博士中心：商业模式 =====
  function renderBusinessModel(data) {
    var container = document.getElementById('business-model-container');
    if (!container || !data.qinboshi || !data.qinboshi.businessModel) return;
    container.innerHTML = data.qinboshi.businessModel.map(function(b, i) {
      return '<div class="card fade-in-up stagger-' + i + '">' +
        '<div class="card-icon purple">' + b.icon + '</div>' +
        '<h3 class="card-title">' + b.title + '</h3>' +
        '<p class="card-desc">' + b.description + '</p>' +
      '</div>';
    }).join('');
  }

  // ===== 交付保障 =====
  function renderDelivery(data) {
    var container = document.getElementById('delivery-container');
    if (!container || !data.delivery) return;
    container.innerHTML = data.delivery.map(function(d, i) {
      return '<div class="card fade-in-up stagger-' + i + '">' +
        '<div class="card-icon purple">' + d.icon + '</div>' +
        '<h3 class="card-title">' + d.title + '</h3>' +
        '<p class="card-desc">' + d.description + '</p>' +
      '</div>';
    }).join('');
  }

  // ===== 合作对象（带 logo） =====
  function renderPartners(data) {
    var container = document.getElementById('partners-container');
    if (!container || !data.partners) return;
    container.innerHTML = data.partners.map(function(p, i) {
      var logoHtml = p.logo
        ? '<img src="' + p.logo + '" alt="' + p.title + '" class="partner-logo-img" style="width:64px;height:64px;object-fit:contain;margin-bottom:var(--spacing-md);">'
        : '<div class="card-icon purple" style="width:64px;height:64px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">' + p.icon + '</div>';
      return '<div class="card fade-in-up stagger-' + i + '" style="text-align:center;">' +
        logoHtml +
        '<h3 class="card-title">' + p.title + '</h3>' +
        '<p class="card-desc">' + p.description + '</p>' +
      '</div>';
    }).join('');
  }

  // ===== 页面初始化（通用入口） =====
  function initPage(renderCallback) {
    DataLoader.load().then(function(data) {
      renderNavigation(data);
      renderFooter(data);
      if (renderCallback) renderCallback(data);
      // 重新初始化动画和导航
      if (typeof initNavigation === 'function') initNavigation();
      if (typeof initScrollAnimations === 'function') initScrollAnimations();
      if (typeof initCounterAnimation === 'function') initCounterAnimation();
      if (typeof initHeroParticles === 'function') initHeroParticles();
      if (typeof initContactForms === 'function') initContactForms();
    }).catch(function(err) {
      console.error('[Renderer] 页面初始化失败:', err);
    });
  }

  return {
    renderNavigation: renderNavigation,
    renderFooter: renderFooter,
    renderHero: renderHero,
    renderStats: renderStats,
    renderCoreBusinesses: renderCoreBusinesses,
    renderProducts: renderProducts,
    renderClients: renderClients,
    renderAdvantages: renderAdvantages,
    renderTimeline: renderTimeline,
    renderDualDrive: renderDualDrive,
    renderContactInfo: renderContactInfo,
    renderAboutIntro: renderAboutIntro,
    renderDepartments: renderDepartments,
    renderFounder: renderFounder,
    renderCapabilities: renderCapabilities,
    renderQinboshiMission: renderQinboshiMission,
    renderEcosystem: renderEcosystem,
    renderEcosystemCards: renderEcosystemCards,
    renderBusinessModel: renderBusinessModel,
    renderDelivery: renderDelivery,
    renderPartners: renderPartners,
    renderCards: renderCards,
    initPage: initPage
  };
})();
