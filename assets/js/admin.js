/* Admin JS - 管理后台逻辑 (增强版：支持增删改) */

var Admin = (function() {
  var currentData = null;
  var currentSection = null;
  var ADMIN_PASSWORD = 'admin123';

  function init() {
    if (sessionStorage.getItem('admin_authenticated') === 'true') {
      loadAdmin();
    } else {
      showLogin();
    }
  }

  function showLogin() {
    document.body.className = 'admin-body';
    document.body.innerHTML =
      '<div class="admin-login">' +
        '<div class="login-box">' +
          '<h1>🔧 管理后台</h1>' +
          '<p class="login-subtitle">上海爽勤 · 勤博士AI数字共创中心</p>' +
          '<label>管理密码</label>' +
          '<input type="password" id="login-password" placeholder="请输入管理密码" onkeydown="if(event.key===\'Enter\')Admin.login()">' +
          '<p class="login-error" id="login-error">密码错误，请重试</p>' +
          '<button class="btn btn-primary" style="width:100%;padding:12px;" onclick="Admin.login()">登录</button>' +
        '</div>' +
      '</div>';
  }

  function login() {
    var password = document.getElementById('login-password').value;
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      loadAdmin();
    } else {
      document.getElementById('login-error').style.display = 'block';
      document.getElementById('login-password').value = '';
    }
  }

  function logout() {
    sessionStorage.removeItem('admin_authenticated');
    showLogin();
  }

  function loadAdmin() {
    document.body.className = 'admin-body';

    var sections = [
      { id: 'site', label: '站点信息' },
      { id: 'contact-info', label: '联系信息' },
      { id: 'email-config', label: '邮件配置' },
      { id: 'hero', label: '首页Hero' },
      { id: 'stats', label: '统计数据' },
      { id: 'coreBusinesses', label: '核心业务' },
      { id: 'products', label: '产品体系' },
      { id: 'clients', label: '合作客户' },
      { id: 'advantages', label: '核心优势' },
      { id: 'qinboshi', label: '勤博士中心' },
      { id: 'about', label: '关于我们' },
      { id: 'delivery', label: '交付保障' },
      { id: 'partners', label: '合作对象' }
    ];

    var menuHtml = sections.map(function(s) {
      return '<li><a href="#" onclick="Admin.switchSection(\'' + s.id + '\')" data-section="' + s.id + '">' + s.label + '</a></li>';
    }).join('');

    document.body.innerHTML =
      '<div class="admin-layout">' +
        '<div class="admin-sidebar">' +
          '<div class="admin-sidebar-header">' +
            '<h2>🔧 管理后台</h2>' +
            '<p>上海爽勤 · 勤博士</p>' +
          '</div>' +
          '<ul class="admin-menu">' + menuHtml + '</ul>' +
        '</div>' +
        '<div class="admin-main">' +
          '<div class="admin-header">' +
            '<h3 id="admin-section-title">站点信息</h3>' +
            '<div class="admin-actions">' +
              '<button class="btn btn-secondary btn-sm" onclick="Admin.exportJSON()">导出JSON</button>' +
              '<button class="btn btn-danger btn-sm" onclick="Admin.resetData()">重置数据</button>' +
              '<button class="btn btn-sm" style="background:#e8e8ed;border:none;cursor:pointer;" onclick="Admin.logout()">退出</button>' +
            '</div>' +
          '</div>' +
          '<div class="admin-form" id="admin-form-content"></div>' +
        '</div>' +
      '</div>' +
      '<div class="admin-toast" id="admin-toast"></div>';

    DataLoader.load().then(function(data) {
      currentData = JSON.parse(JSON.stringify(data));
      switchSection('site');
    });
  }

  function switchSection(sectionId) {
    currentSection = sectionId;
    document.querySelectorAll('.admin-menu a').forEach(function(a) {
      a.classList.toggle('active', a.getAttribute('data-section') === sectionId);
    });

    var titles = {
      'site': '站点信息', 'contact-info': '联系信息', 'email-config': '邮件配置',
      'hero': '首页Hero', 'stats': '统计数据', 'coreBusinesses': '核心业务',
      'products': '产品体系', 'clients': '合作客户', 'advantages': '核心优势',
      'qinboshi': '勤博士中心', 'about': '关于我们', 'delivery': '交付保障',
      'partners': '合作对象'
    };
    document.getElementById('admin-section-title').textContent = titles[sectionId] || sectionId;

    var container = document.getElementById('admin-form-content');
    var html = '';

    switch (sectionId) {
      case 'site': html = renderSiteForm(); break;
      case 'contact-info': html = renderContactForm(); break;
      case 'email-config': html = renderEmailConfigForm(); break;
      case 'hero': html = renderHeroForm(); break;
      case 'stats': html = renderStatsForm(); break;
      case 'coreBusinesses': html = renderCoreBusinessForm(); break;
      case 'products': html = renderProductsForm(); break;
      case 'clients': html = renderClientsForm(); break;
      case 'advantages': html = renderAdvantagesForm(); break;
      case 'qinboshi': html = renderQinboshiForm(); break;
      case 'about': html = renderAboutForm(); break;
      case 'delivery': html = renderDeliveryForm(); break;
      case 'partners': html = renderPartnersForm(); break;
    }

    container.innerHTML = html + '<div style="margin-top:24px;text-align:right;"><button class="btn btn-primary" onclick="Admin.saveAll()">💾 保存全部修改</button></div>';
  }

  // ===== 通用列表渲染（支持增删） =====
  function renderListEditor(items, pathPrefix, fields, titleField) {
    var html = '';
    items.forEach(function(item, i) {
      html += '<div class="admin-list-card" id="' + pathPrefix + '-' + i + '">' +
        '<div class="admin-list-header">' +
          '<span class="admin-list-num">#' + (i + 1) + '</span>' +
          '<span class="admin-list-title">' + esc(item[titleField] || '未命名') + '</span>' +
          '<button class="btn btn-danger btn-sm" onclick="Admin.deleteItem(\'' + pathPrefix + '\',' + i + ')">删除</button>' +
        '</div>' +
        '<div class="admin-list-body">';

      fields.forEach(function(f) {
        var val = item[f.key] || '';
        if (f.type === 'textarea') {
          html += formGroup(f.label, '<textarea data-path="' + pathPrefix + '.' + i + '.' + f.key + '">' + esc(val) + '</textarea>');
        } else {
          html += formGroup(f.label, '<input type="text" data-path="' + pathPrefix + '.' + i + '.' + f.key + '" value="' + esc(val) + '">');
        }
      });

      // 子列表（如 detailList）
      if (item.detailList && item.detailList.length > 0) {
        html += '<div style="margin:12px 0 8px;padding:12px;background:#f8f9fa;border-radius:8px;">' +
          '<p style="font-size:0.8rem;font-weight:600;color:#4B0082;margin:0 0 8px;">详细列表 (' + item.detailList.length + '条)</p>';
        item.detailList.forEach(function(dl, di) {
          var dlKeys = Object.keys(dl);
          html += '<div style="display:flex;gap:8px;margin-bottom:6px;align-items:center;">';
          dlKeys.forEach(function(k) {
            html += '<input type="text" data-path="' + pathPrefix + '.' + i + '.detailList.' + di + '.' + k + '" value="' + esc(dl[k] || '') + '" placeholder="' + k + '" style="flex:1;font-size:0.8rem;padding:6px 10px;margin:0;">';
          });
          html += '<button class="btn btn-danger btn-sm" onclick="Admin.deleteDetailItem(\'' + pathPrefix + '\',' + i + ',' + di + ')" style="padding:4px 10px;font-size:0.7rem;">删</button>';
          html += '</div>';
        });
        html += '<button class="btn btn-success btn-sm" onclick="Admin.addDetailItem(\'' + pathPrefix + '\',' + i + ')" style="margin-top:4px;">+ 添加条目</button>';
        html += '</div>';
      }

      html += '</div></div>';
    });

    // 添加按钮
    html += '<button class="btn btn-success" style="width:100%;margin-top:16px;padding:12px;" onclick="Admin.addItem(\'' + pathPrefix + '\')">+ 添加新' + titleField + '</button>';
    return html;
  }

  // ===== 各模块表单 =====
  function renderSiteForm() {
    var s = currentData.site;
    return formGroup('网站名称', '<input type="text" data-path="site.name" value="' + esc(s.name) + '">') +
      formGroup('副标题', '<input type="text" data-path="site.subtitle" value="' + esc(s.subtitle) + '">') +
      formGroup('Logo文字', '<input type="text" data-path="site.logoChar" value="' + esc(s.logoChar) + '" style="width:80px;">') +
      formGroup('描述', '<textarea data-path="site.description">' + esc(s.description) + '</textarea>') +
      formGroup('Footer描述', '<textarea data-path="site.footerDescription">' + esc(s.footerDescription) + '</textarea>') +
      formGroup('版权信息', '<input type="text" data-path="site.copyright" value="' + esc(s.copyright) + '">') +
      formGroup('ICP备案号', '<input type="text" data-path="site.icp" value="' + esc(s.icp) + '">');
  }

  function renderContactForm() {
    var c = currentData.contact;
    return formGroup('公司地址', '<input type="text" data-path="contact.address" value="' + esc(c.address) + '">') +
      formGroup('电子邮箱', '<input type="email" data-path="contact.email" value="' + esc(c.email) + '">') +
      formGroup('联系电话', '<input type="tel" data-path="contact.phone" value="' + esc(c.phone) + '">') +
      formGroup('服务时间', '<input type="text" data-path="contact.serviceHours" value="' + esc(c.serviceHours) + '">') +
      formGroup('紧急服务', '<input type="text" data-path="contact.emergencyHours" value="' + esc(c.emergencyHours) + '">');
  }

  function renderEmailConfigForm() {
    var e = currentData.emailConfig || {};
    return '<div class="form-section"><h4>📧 企业微信邮箱 SMTP 配置</h4>' +
      '<p style="font-size:0.8rem;color:#666;margin-bottom:16px;">配置后，网站咨询表单将直接发送邮件到你的企业微信邮箱。需要配合 <code>server.py</code> 一起运行。</p>' +
      formGroup('启用邮件服务', '<select data-path="emailConfig.enabled" style="width:100px;"><option value="true"' + (e.enabled ? ' selected' : '') + '>是</option><option value="false"' + (!e.enabled ? ' selected' : '') + '>否</option></select>') +
      formGroup('SMTP 服务器', '<input type="text" data-path="emailConfig.smtpHost" value="' + esc(e.smtpHost || 'smtp.exmail.qq.com') + '">') +
      formGroup('SMTP 端口', '<input type="number" data-path="emailConfig.smtpPort" value="' + (e.smtpPort || 465) + '" style="width:120px;">') +
      formGroup('使用 SSL', '<select data-path="emailConfig.smtpSsl" style="width:100px;"><option value="true"' + (e.smtpSsl !== false ? ' selected' : '') + '>是 (465)</option><option value="false"' + (e.smtpSsl === false ? ' selected' : '') + '>否 (587 TLS)</option></select>') +
      formGroup('发件邮箱', '<input type="email" data-path="emailConfig.smtpUser" value="' + esc(e.smtpUser || '') + '" placeholder="yourname@sqmc.tech">') +
      formGroup('客户端专用密码', '<input type="password" data-path="emailConfig.smtpPass" value="' + esc(e.smtpPass || '') + '" placeholder="企业微信邮箱生成的专用密码">') +
      '<p style="font-size:0.7rem;color:#999;margin-top:-8px;margin-bottom:12px;">⚠️ 不是登录密码！需在企业微信邮箱设置中生成"客户端专用密码"</p>' +
      formGroup('收件邮箱', '<input type="email" data-path="emailConfig.toEmail" value="' + esc(e.toEmail || 'contact@shuangqin.com') + '">') +
      '</div>' +
      '<div class="form-section"><h4>📋 完整部署步骤</h4>' +
      '<ol style="font-size:0.8rem;color:#666;line-height:1.8;padding-left:20px;">' +
      '<li>将整个 <code>shuangqin-website</code> 目录上传到你的服务器</li>' +
      '<li>运行: <code>python3 server.py</code>（默认端口 8080，可通过 <code>PORT=80</code> 修改）</li>' +
      '<li>配置 Nginx 反向代理到 sqmc.tech 域名</li>' +
      '<li>登录企业微信邮箱 → 设置 → 客户端专用密码 → 生成并填入上方</li>' +
      '<li>启用服务并保存，即可生效</li>' +
      '</ol>' +
      '<p style="font-size:0.75rem;color:#999;margin-top:8px;">服务器只需 Python 3，无需任何第三方依赖。</p>' +
      '</div>';
  }

  function renderHeroForm() {
    var h = currentData.hero;
    return formGroup('Badge文字', '<input type="text" data-path="hero.badge" value="' + esc(h.badge) + '">') +
      formGroup('标题HTML', '<input type="text" data-path="hero.titleHtml" value="' + esc(h.titleHtml) + '">') +
      formGroup('副标题', '<textarea data-path="hero.subtitle">' + esc(h.subtitle) + '</textarea>');
  }

  function renderStatsForm() {
    return renderListEditor(currentData.stats, 'stats',
      [{key:'icon',label:'图标'},{key:'number',label:'数字'},{key:'suffix',label:'后缀'},{key:'label',label:'标签'}],
      'label');
  }

  function renderCoreBusinessForm() {
    var html = '';
    currentData.coreBusinesses.forEach(function(biz, bi) {
      html += '<div class="admin-list-card">' +
        '<div class="admin-list-header">' +
          '<span class="admin-list-num">#' + (bi+1) + '</span>' +
          '<span class="admin-list-title">' + esc(biz.title) + '</span>' +
        '</div>' +
        '<div class="admin-list-body">' +
          formGroup('标题', '<input type="text" data-path="coreBusinesses.' + bi + '.title" value="' + esc(biz.title) + '">') +
          formGroup('图标', '<input type="text" data-path="coreBusinesses.' + bi + '.icon" value="' + esc(biz.icon) + '" style="width:80px;">') +
          formGroup('描述', '<textarea data-path="coreBusinesses.' + bi + '.description">' + esc(biz.description) + '</textarea>');

      if (biz.details && biz.details.items) {
        html += '<div style="margin:16px 0;padding:16px;background:#f8f9fa;border-radius:8px;">' +
          '<p style="font-weight:600;color:#4B0082;margin:0 0 12px;">子项列表</p>';
        biz.details.items.forEach(function(item, ii) {
          html += '<div style="margin-bottom:12px;padding:12px;background:white;border-radius:6px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
              '<strong>' + esc(item.title) + '</strong>' +
              '<button class="btn btn-danger btn-sm" onclick="Admin.deleteSubItem(' + bi + ',' + ii + ')">删除</button>' +
            '</div>' +
            formGroup('标题', '<input type="text" data-path="coreBusinesses.' + bi + '.details.items.' + ii + '.title" value="' + esc(item.title) + '">') +
            formGroup('图标', '<input type="text" data-path="coreBusinesses.' + bi + '.details.items.' + ii + '.icon" value="' + esc(item.icon) + '" style="width:80px;">') +
            formGroup('描述', '<textarea data-path="coreBusinesses.' + bi + '.details.items.' + ii + '.description">' + esc(item.description) + '</textarea>');

          if (item.detailList && item.detailList.length > 0) {
            html += '<div style="margin:8px 0;padding:8px;background:#f0f2f5;border-radius:4px;">' +
              '<p style="font-size:0.75rem;color:#666;margin:0 0 6px;">详细列表</p>';
            item.detailList.forEach(function(dl, di) {
              var keys = Object.keys(dl);
              html += '<div style="display:flex;gap:6px;margin-bottom:4px;">';
              keys.forEach(function(k) {
                html += '<input type="text" data-path="coreBusinesses.' + bi + '.details.items.' + ii + '.detailList.' + di + '.' + k + '" value="' + esc(dl[k] || '') + '" placeholder="' + k + '" style="flex:1;font-size:0.75rem;padding:4px 8px;">';
              });
              html += '<button class="btn btn-danger btn-sm" onclick="Admin.deleteDetailItem(\'coreBusinesses.' + bi + '.details.items.' + ii + '\',' + di + ')" style="padding:2px 8px;font-size:0.65rem;">删</button>';
              html += '</div>';
            });
            html += '<button class="btn btn-success btn-sm" onclick="Admin.addDetailItem(\'coreBusinesses.' + bi + '.details.items.' + ii + '\',0)" style="margin-top:4px;font-size:0.7rem;">+ 添加</button>';
            html += '</div>';
          }
          html += '</div>';
        });
        html += '</div>';
      }
      html += '</div></div>';
    });
    return html;
  }

  function renderProductsForm() {
    return renderListEditor(currentData.products, 'products',
      [{key:'title',label:'标题'},{key:'icon',label:'图标'},{key:'description',label:'描述',type:'textarea'}],
      'title');
  }

  function renderClientsForm() {
    var html = '<div style="margin-bottom:16px;"><strong>客户列表（可上传 Logo）</strong></div>';
    currentData.clients.items.forEach(function(client, ci) {
      var logoPreview = client.logo
        ? '<img src="' + client.logo + '" style="max-width:60px;max-height:60px;object-fit:contain;border:1px solid #ddd;border-radius:4px;padding:2px;background:white;">'
        : '<span style="color:#999;font-size:0.7rem;">无Logo</span>';
      html += '<div class="admin-list-card" id="client-' + ci + '">' +
        '<div class="admin-list-header">' +
          '<span class="admin-list-num">#' + (ci + 1) + '</span>' +
          '<span class="admin-list-title">' + esc(client.name) + '</span>' +
          '<button class="btn btn-danger btn-sm" onclick="Admin.deleteItem(\'clients.items\',' + ci + ')">删除</button>' +
        '</div>' +
        '<div class="admin-list-body">' +
          formGroup('客户名称', '<input type="text" data-path="clients.items.' + ci + '.name" value="' + esc(client.name) + '">') +
          formGroup('行业分类', '<input type="text" data-path="clients.items.' + ci + '.category" value="' + esc(client.category) + '">') +
          '<div style="margin-bottom:12px;">' +
            '<label style="display:block;font-size:0.875rem;font-weight:600;color:#1d1d1f;margin-bottom:4px;">Logo 图片</label>' +
            '<div style="display:flex;align-items:center;gap:12px;">' +
              '<div id="client-logo-preview-' + ci + '">' + logoPreview + '</div>' +
              '<div style="flex:1;">' +
                '<input type="file" accept="image/*" onchange="Admin.uploadClientLogo(this,' + ci + ')" style="font-size:0.8rem;">' +
                '<p style="font-size:0.7rem;color:#999;margin-top:4px;">支持 JPG/PNG</p>' +
              '</div>' +
            '</div>' +
            '<input type="hidden" data-path="clients.items.' + ci + '.logo" value="' + esc(client.logo || '') + '" id="client-logo-input-' + ci + '">' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    html += '<button class="btn btn-success" style="width:100%;margin-top:8px;padding:12px;" onclick="Admin.addClient()">+ 添加客户</button>';
    return html;
  }

  function renderAdvantagesForm() {
    return renderListEditor(currentData.advantages, 'advantages',
      [{key:'icon',label:'图标'},{key:'title',label:'标题'},{key:'description',label:'描述',type:'textarea'}],
      'title');
  }

  function renderQinboshiForm() {
    var q = currentData.qinboshi;
    var html = '<div class="form-section"><h4>核心使命</h4>' +
      formGroup('使命描述', '<textarea data-path="qinboshi.mission">' + esc(q.mission) + '</textarea>') +
    '</div>';

    ['business', 'consumer'].forEach(function(key) {
      var d = q.dualDrive[key];
      html += '<div class="form-section"><h4>' + d.label + '</h4>' +
        formGroup('标题', '<input type="text" data-path="qinboshi.dualDrive.' + key + '.title" value="' + esc(d.title) + '">');
      d.items.forEach(function(item, ii) {
        html += '<div style="display:flex;gap:8px;margin-bottom:6px;">' +
          '<input type="text" data-path="qinboshi.dualDrive.' + key + '.items.' + ii + '" value="' + esc(item) + '" style="flex:1;">' +
          '<button class="btn btn-danger btn-sm" onclick="Admin.deleteArrayItem(\'qinboshi.dualDrive.' + key + '.items\',' + ii + ')">删除</button>' +
        '</div>';
      });
      html += '<button class="btn btn-success btn-sm" onclick="Admin.addArrayItem(\'qinboshi.dualDrive.' + key + '.items\')" style="margin-top:4px;">+ 添加项目</button>';
      html += '</div>';
    });

    q.strategy.forEach(function(s, si) {
      html += '<div class="form-section"><h4>战略' + (si+1) + '</h4>' +
        formGroup('步骤', '<input type="text" data-path="qinboshi.strategy.' + si + '.step" value="' + esc(s.step) + '">') +
        formGroup('标题', '<input type="text" data-path="qinboshi.strategy.' + si + '.title" value="' + esc(s.title) + '">') +
        formGroup('描述', '<textarea data-path="qinboshi.strategy.' + si + '.description">' + esc(s.description) + '</textarea>') +
      '</div>';
    });

    return html;
  }

  function renderAboutForm() {
    var a = currentData.about;
    var html = '<div class="form-section"><h4>公司简介</h4>' +
      formGroup('段落1', '<textarea data-path="about.intro.paragraph1">' + esc(a.intro.paragraph1) + '</textarea>') +
      formGroup('段落2', '<textarea data-path="about.intro.paragraph2">' + esc(a.intro.paragraph2) + '</textarea>') +
    '</div>';

    html += '<div class="form-section"><h4>创始人</h4>' +
      formGroup('姓名', '<input type="text" data-path="about.founder.name" value="' + esc(a.founder.name) + '">') +
      formGroup('头衔', '<input type="text" data-path="about.founder.title" value="' + esc(a.founder.title) + '">') +
      formGroup('描述1', '<textarea data-path="about.founder.description1">' + esc(a.founder.description1) + '</textarea>') +
      formGroup('描述2', '<textarea data-path="about.founder.description2">' + esc(a.founder.description2) + '</textarea>') +
    '</div>';

    html += '<div class="form-section"><h4>部门列表</h4>';
    a.departments.forEach(function(d, di) {
      html += '<div style="margin-bottom:12px;padding:12px;background:#f8f9fa;border-radius:8px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<strong>' + esc(d.title) + '</strong>' +
          '<button class="btn btn-danger btn-sm" onclick="Admin.deleteItem(\'about.departments\',' + di + ')">删除</button>' +
        '</div>' +
        formGroup('标题', '<input type="text" data-path="about.departments.' + di + '.title" value="' + esc(d.title) + '">') +
        formGroup('图标', '<input type="text" data-path="about.departments.' + di + '.icon" value="' + esc(d.icon) + '" style="width:80px;">') +
        formGroup('描述', '<textarea data-path="about.departments.' + di + '.description">' + esc(d.description) + '</textarea>') +
      '</div>';
    });
    html += '<button class="btn btn-success" style="width:100%;" onclick="Admin.addDepartment()">+ 添加部门</button>';
    html += '</div>';

    return html;
  }

  function renderDeliveryForm() {
    return renderListEditor(currentData.delivery, 'delivery',
      [{key:'icon',label:'图标'},{key:'title',label:'标题'},{key:'description',label:'描述',type:'textarea'}],
      'title');
  }

  function renderPartnersForm() {
    var html = '';
    currentData.partners.forEach(function(p, i) {
      var logoPreview = p.logo
        ? '<img src="' + p.logo + '" style="max-width:80px;max-height:80px;object-fit:contain;border:1px solid #ddd;border-radius:4px;padding:4px;background:white;">'
        : '<span style="color:#999;font-size:0.8rem;">暂无 Logo</span>';
      html += '<div class="admin-list-card" id="partners-' + i + '">' +
        '<div class="admin-list-header">' +
          '<span class="admin-list-num">#' + (i + 1) + '</span>' +
          '<span class="admin-list-title">' + esc(p.title) + '</span>' +
          '<button class="btn btn-danger btn-sm" onclick="Admin.deleteItem(\'partners\',' + i + ')">删除</button>' +
        '</div>' +
        '<div class="admin-list-body">' +
          formGroup('标题', '<input type="text" data-path="partners.' + i + '.title" value="' + esc(p.title) + '">') +
          formGroup('图标（emoji）', '<input type="text" data-path="partners.' + i + '.icon" value="' + esc(p.icon) + '" style="width:80px;">') +
          '<div style="margin-bottom:12px;">' +
            '<label style="display:block;font-size:0.875rem;font-weight:600;color:#1d1d1f;margin-bottom:4px;">Logo 图片</label>' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">' +
              '<div id="partner-logo-preview-' + i + '">' + logoPreview + '</div>' +
              '<div style="flex:1;">' +
                '<input type="file" accept="image/*" onchange="Admin.uploadPartnerLogo(this,' + i + ')" style="font-size:0.8rem;">' +
                '<p style="font-size:0.7rem;color:#999;margin-top:4px;">支持 JPG/PNG，建议 200x200 以内</p>' +
              '</div>' +
            '</div>' +
            '<input type="hidden" data-path="partners.' + i + '.logo" value="' + esc(p.logo || '') + '" id="partner-logo-input-' + i + '">' +
          '</div>' +
          formGroup('描述', '<textarea data-path="partners.' + i + '.description">' + esc(p.description) + '</textarea>') +
        '</div>' +
      '</div>';
    });
    html += '<button class="btn btn-success" style="width:100%;margin-top:16px;padding:12px;" onclick="Admin.addItem(\'partners\')">+ 添加合作伙伴</button>';
    return html;
  }

  // ===== 增删操作 =====

  function addItem(path) {
    var parts = path.split('.');
    var arr = getArrayByPath(currentData, parts);
    if (arr) {
      arr.push({ icon: '📄', title: '新项目', description: '请填写描述' });
      switchSection(currentSection);
      showToast('✅ 已添加，请填写内容后保存', 'success');
    }
  }

  function deleteItem(path, index) {
    if (!confirm('确定要删除这个项目吗？')) return;
    var parts = path.split('.');
    var arr = getArrayByPath(currentData, parts);
    if (arr && arr[index] !== undefined) {
      arr.splice(index, 1);
      switchSection(currentSection);
      showToast('✅ 已删除', 'success');
    }
  }

  function addClient() {
    currentData.clients.items.push({ name: '新客户', category: '金融', logo: '' });
    switchSection('clients');
    showToast('✅ 已添加客户', 'success');
  }

  function addDepartment() {
    currentData.about.departments.push({ icon: '📄', title: '新部门', description: '请填写描述' });
    switchSection('about');
    showToast('✅ 已添加部门', 'success');
  }

  function deleteSubItem(bizIndex, itemIndex) {
    if (!confirm('确定删除这个子项吗？')) return;
    var items = currentData.coreBusinesses[bizIndex].details.items;
    items.splice(itemIndex, 1);
    switchSection('coreBusinesses');
    showToast('✅ 已删除', 'success');
  }

  function addDetailItem(path, itemIndex) {
    var parts = path.split('.');
    // path 指向某个对象的 detailList 数组
    // 例如: coreBusinesses.0.details.items.0.detailList
    var arr = getValueByPath(currentData, parts);
    if (Array.isArray(arr)) {
      arr.push({ title: '新条目', description: '请填写' });
      switchSection(currentSection);
      showToast('✅ 已添加条目', 'success');
    } else {
      // 尝试: path 指向的是父对象，需要访问 .detailList
      var parentObj = getValueByPath(currentData, parts);
      if (parentObj && Array.isArray(parentObj.detailList)) {
        parentObj.detailList.push({ title: '新条目', description: '请填写' });
        switchSection(currentSection);
        showToast('✅ 已添加条目', 'success');
      } else {
        showToast('⚠️ 无法添加条目，数据结构不匹配', 'error');
      }
    }
  }

  function deleteDetailItem(path, index) {
    if (!confirm('确定删除这个条目吗？')) return;
    var parts = path.split('.');
    var arr = getValueByPath(currentData, parts);
    if (Array.isArray(arr)) {
      arr.splice(index, 1);
      switchSection(currentSection);
      showToast('✅ 已删除', 'success');
    }
  }

  function addArrayItem(path) {
    var parts = path.split('.');
    var arr = getValueByPath(currentData, parts);
    if (Array.isArray(arr)) {
      arr.push('新项目');
      switchSection(currentSection);
      showToast('✅ 已添加', 'success');
    }
  }

  function deleteArrayItem(path, index) {
    if (!confirm('确定删除吗？')) return;
    var parts = path.split('.');
    var arr = getValueByPath(currentData, parts);
    if (Array.isArray(arr)) {
      arr.splice(index, 1);
      switchSection(currentSection);
      showToast('✅ 已删除', 'success');
    }
  }

  // ===== 辅助函数 =====
  function getArrayByPath(obj, parts) {
    var current = obj;
    for (var i = 0; i < parts.length; i++) {
      var key = parts[i];
      if (/^\d+$/.test(key)) key = parseInt(key, 10);
      if (current === null || current === undefined) return null;
      if (!(key in current)) return null;
      current = current[key];
    }
    return Array.isArray(current) ? current : null;
  }

  function getValueByPath(obj, parts) {
    var current = obj;
    for (var i = 0; i < parts.length; i++) {
      var key = parts[i];
      if (/^\d+$/.test(key)) key = parseInt(key, 10);
      if (current === null || current === undefined) return null;
      if (!(key in current)) return null;
      current = current[key];
    }
    return current;
  }

  function setValueByPath(obj, path, value) {
    var current = obj;
    for (var i = 0; i < path.length - 1; i++) {
      var key = path[i];
      if (/^\d+$/.test(key)) key = parseInt(key, 10);
      if (current[key] === undefined || current[key] === null) {
        // 判断下一个 key 是否为数字，决定创建数组还是对象
        var nextKey = path[i + 1];
        current[key] = /^\d+$/.test(nextKey) ? [] : {};
      }
      current = current[key];
    }
    var lastKey = path[path.length - 1];
    if (/^\d+$/.test(lastKey)) lastKey = parseInt(lastKey, 10);
    current[lastKey] = value;
  }

  function formGroup(label, inputHtml) {
    return '<div style="margin-bottom:12px;"><label style="display:block;font-size:0.875rem;font-weight:600;color:#1d1d1f;margin-bottom:4px;">' + label + '</label>' + inputHtml + '</div>';
  }

  function uploadPartnerLogo(input, index) {
    var file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('图片大小不能超过 2MB', 'error');
      return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
      var base64 = e.target.result;
      // 更新数据
      currentData.partners[index].logo = base64;
      // 更新预览
      var preview = document.getElementById('partner-logo-preview-' + index);
      if (preview) {
        preview.innerHTML = '<img src="' + base64 + '" style="max-width:80px;max-height:80px;object-fit:contain;border:1px solid #ddd;border-radius:4px;padding:4px;background:white;">';
      }
      // 更新隐藏 input
      var hiddenInput = document.getElementById('partner-logo-input-' + index);
      if (hiddenInput) hiddenInput.value = base64;
      showToast('✅ Logo 已上传（记得点击保存）', 'success');
    };
    reader.onerror = function() {
      showToast('图片读取失败', 'error');
    };
    reader.readAsDataURL(file);
  }

  function uploadClientLogo(input, index) {
    var file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('请选择图片文件', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { showToast('图片大小不能超过 2MB', 'error'); return; }

    var reader = new FileReader();
    reader.onload = function(e) {
      var base64 = e.target.result;
      currentData.clients.items[index].logo = base64;
      var preview = document.getElementById('client-logo-preview-' + index);
      if (preview) preview.innerHTML = '<img src="' + base64 + '" style="max-width:60px;max-height:60px;object-fit:contain;border:1px solid #ddd;border-radius:4px;padding:2px;background:white;">';
      var hiddenInput = document.getElementById('client-logo-input-' + index);
      if (hiddenInput) hiddenInput.value = base64;
      showToast('✅ Logo 已上传（记得点击保存）', 'success');
    };
    reader.onerror = function() { showToast('图片读取失败', 'error'); };
    reader.readAsDataURL(file);
  }

  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ===== 保存 =====
  function saveAll() {
    document.querySelectorAll('[data-path]').forEach(function(input) {
      var path = input.getAttribute('data-path').split('.');
      var value = input.value;
      if (input.type === 'number') value = parseInt(value) || 0;
      setValueByPath(currentData, path, value);
    });

    var success = DataLoader.save(currentData);
    if (success) {
      showToast('✅ 保存成功！刷新前端页面即可看到更新', 'success');
    } else {
      showToast('❌ 保存失败', 'error');
    }
  }


  function resetData() {
    if (confirm('确定要重置所有数据吗？这将清除所有修改。')) {
      DataLoader.reset();
      showToast('✅ 已重置', 'success');
      DataLoader.load().then(function(data) {
        currentData = JSON.parse(JSON.stringify(data));
        switchSection(currentSection);
      });
    }
  }

  function exportJSON() {
    saveAll();
    var json = DataLoader.exportData();
    if (json) {
      var blob = new Blob([json], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'data.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('✅ JSON 已导出', 'success');
    }
  }

  function showToast(message, type) {
    var toast = document.getElementById('admin-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'admin-toast ' + type;
    setTimeout(function() { toast.className = 'admin-toast'; }, 3000);
  }

  return {
    init: init, login: login, logout: logout,
    switchSection: switchSection, saveAll: saveAll,
    resetData: resetData, exportJSON: exportJSON,
    addItem: addItem, deleteItem: deleteItem,
    addClient: addClient, addDepartment: addDepartment,
    deleteSubItem: deleteSubItem,
    addDetailItem: addDetailItem, deleteDetailItem: deleteDetailItem,
    addArrayItem: addArrayItem, deleteArrayItem: deleteArrayItem,
    uploadPartnerLogo: uploadPartnerLogo,
    uploadClientLogo: uploadClientLogo
  };
})();

document.addEventListener('DOMContentLoaded', function() {
  Admin.init();
});
