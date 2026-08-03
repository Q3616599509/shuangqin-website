/* ===== AI 智能客服浮窗 ===== */
(function() {
  'use strict';

  // ===== 企业知识库 =====
  var KNOWLEDGE = {
    greeting: [
      '您好！我是勤博士AI数字共创中心的智能客服 🤖',
      '我可以为您解答以下问题：',
      '• 公司简介与创始人',
      '• 核心业务与服务',
      '• 数字化转型方案',
      '• AI算力与模型服务',
      '• 联系方式与合作',
      '• 勤博士中心介绍',
      '',
      '请直接输入您的问题，我会尽力为您解答！'
    ].join('\n'),

    fallback: [
      '感谢您的咨询！您的问题我已经记录下来了。',
      '',
      '为了更好地为您服务，建议您通过以下方式联系我们：',
      '📧 邮箱：qinzhiyong@sqmc.tech',
      '📞 电话：021-xxxx-xxxx',
      '📍 地址：上海市嘉定区',
      '',
      '或者您可以换个方式描述您的问题，我会继续为您解答 😊'
    ].join('\n'),

    qa: {
      '公司|简介|介绍|爽勤|做什么|业务|什么公司': [
        '上海**爽勤管理咨询有限公司**成立于**2019年**，位于上海嘉定。',
        '',
        '创始人**秦志勇博士**是IT行业老兵，深耕电商、融资租赁、银行保险领域20余年。',
        '',
        '公司旗下品牌"**勤博士AI数字共创中心**"，致力于用AI+数字化赋能中小企业高质量发展，构建政产学研用五位一体协同创新生态。',
        '',
        '已服务**50+**企业客户，成功交付**100+**项目。'
      ].join('\n'),

      '创始人|秦志勇|博士|老板|谁创立': [
        '**秦志勇博士** — IT老兵，数字化转型践行者',
        '',
        '• 20+年IT行业经验',
        '• 深耕电商、融资租赁、银行保险三大行业',
        '• 100+项目成功交付',
        '• 创立"勤博士AI数字共创中心"品牌',
        '',
        '秦博士带领团队致力于将AI技术与数字化能力深度融合，为中小企业提供从战略咨询到技术落地的一站式服务。'
      ].join('\n'),

      '服务|业务|咨询|产品|做什么的': [
        '我们提供三大核心业务：',
        '',
        '**1. 管理咨询** 📋',
        '依托高校教授资源与行业专家，提供战略规划到落地执行的全链路咨询服务。包括高校资源对接、行业专家智库、数字化咨询。',
        '',
        '**2. 数字化转型** 🔄',
        '覆盖小微到中大型企业，提供轻量化数字化方案、ERP/CRM系统、AI应用落地等。',
        '',
        '**3. AI数字技术支撑** 🤖',
        'AI算力租赁、模型训练微调、数据治理、智能运维等全景技术服务。'
      ].join('\n'),

      '高校|教授|复旦|交大|同济|大学|资源|学术': [
        '我们与多所知名高校建立了深度合作关系：',
        '',
        '• **复旦大学** — 企业管理与数字化转型',
        '• **上海交通大学** — 人工智能与大数据',
        '• **同济大学** — 智能制造与工业互联网',
        '',
        '依托高校教授团队的学术研究能力，将前沿理论与企业管理实践深度融合。'
      ].join('\n'),

      'AI|人工智能|算力|模型|GPT|大模型|智能': [
        '**AI算力与模型服务**是我们的核心能力之一：',
        '',
        '• **算力租赁** — GPU资源池化，按需弹性使用，大幅降低成本',
        '• **模型训练** — 基于企业数据的大模型微调，打造专属AI模型',
        '• **模型部署** — 模型服务化部署、性能监控、持续优化',
        '• **AI应用** — 智能问答、文档分析、图像识别等定制开发',
        '',
        '帮助企业快速构建AI能力，降低技术门槛与投入成本。'
      ].join('\n'),

      '数字化|转型|数字转型|升级|信息化': [
        '我们以**DESC方法论**驱动数字化转型：',
        '',
        '**诊断评估** → 全面评估企业数字化现状',
        '**战略规划** → 制定3-5年数字化转型路线图',
        '**实施路径** → 分阶段、分模块设计实施方案',
        '**变革管理** → 组织架构、人才培养、文化建设',
        '',
        '覆盖小微企业轻量化方案到中大型企业深度数字化转型。'
      ].join('\n'),

      '联系|电话|邮箱|地址|怎么联系|在哪|联系方式': [
        '📧 **邮箱**：qinzhiyong@sqmc.tech',
        '📞 **电话**：021-xxxx-xxxx',
        '📍 **地址**：上海市嘉定区',
        '🕐 **服务时间**：周一至周五 9:00-18:00',
        '⚡ **紧急服务**：7×24小时响应',
        '',
        '您也可以点击导航栏"联系我们"提交在线咨询表单。'
      ].join('\n'),

      '价格|费用|收费|多少钱|报价': [
        '我们的服务收费根据项目规模和需求定制，主要包括：',
        '',
        '• **管理咨询** — 按项目规模收费',
        '• **数字化转型** — 按阶段和服务范围收费',
        '• **AI技术服务** — 按算力使用量和模型服务收费',
        '• **培训服务** — 按课程和人数收费',
        '',
        '建议您通过联系表单留下需求，我们会尽快安排专家与您沟通，提供针对性报价方案。'
      ].join('\n'),

      '客户|案例|合作|平安|阿里|上汽|太平洋': [
        '我们的合作客户覆盖多个行业：',
        '',
        '**金融**：平安租赁、海发宝诚租赁、中宏保险、太平洋保险、普洛斯金融',
        '**互联网**：阿里巴巴、有赞科技',
        '**智能制造**：上汽集团',
        '',
        '已累计服务50+企业客户，100+成功交付项目。'
      ].join('\n'),

      '勤博士|共创中心|AI中心|数字共创': [
        '**勤博士AI数字共创中心**是我们的核心品牌：',
        '',
        '采用**To B + To C 双轮驱动**模式：',
        '• To B — 为企业提供数字化转型服务',
        '• To C — 为个人提供AI技能重塑',
        '',
        '三步走战略：',
        '① 2026-2027 打造区域标杆',
        '② 2027-2028 建立全国平台',
        '③ 2028-2030 构建行业生态',
        '',
        '最终目标：构建AI+数字化人才与企业需求的精准匹配生态。'
      ].join('\n'),

      '培训|学习|课程|AI培训|技能': [
        '我们提供丰富的**AI技能培训**服务：',
        '',
        '• AI技能培训与认证课程',
        '• 校企联合协同育人项目',
        '• 产学研深度融合实践',
        '• 技术转移转化服务',
        '• AI人才蓄水池建设',
        '',
        '帮助个人和企业掌握AI时代的核心技能！'
      ].join('\n')
    }
  };

  // ===== 关键词匹配引擎 =====
  function findAnswer(question) {
    var q = question.toLowerCase();
    var bestMatch = null;
    var bestScore = 0;

    Object.keys(KNOWLEDGE.qa).forEach(function(patterns) {
      var keywords = patterns.split('|');
      var score = 0;
      keywords.forEach(function(kw) {
        if (q.indexOf(kw.toLowerCase()) !== -1) {
          score += kw.length;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = KNOWLEDGE.qa[patterns];
      }
    });

    return bestMatch || KNOWLEDGE.fallback;
  }

  // ===== 消息渲染 =====
  function createMessage(text, type) {
    var msg = document.createElement('div');
    msg.className = 'cw-msg cw-msg-' + type;

    var avatar = document.createElement('div');
    avatar.className = 'cw-msg-avatar';
    avatar.textContent = type === 'bot' ? '🤖' : '👤';

    var bubble = document.createElement('div');
    bubble.className = 'cw-msg-bubble';

    if (type === 'bot') {
      bubble.innerHTML = formatBotText(text);
    } else {
      bubble.textContent = text;
    }

    var time = document.createElement('div');
    time.className = 'cw-msg-time';
    time.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    msg.appendChild(type === 'bot' ? avatar : bubble);
    msg.appendChild(type === 'bot' ? bubble : avatar);
    msg.appendChild(time);

    return msg;
  }

  function formatBotText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  // ===== 打字动画 =====
  function showTyping() {
    var typing = document.createElement('div');
    typing.className = 'cw-msg cw-msg-bot cw-typing';
    typing.innerHTML = '<div class="cw-msg-avatar">🤖</div><div class="cw-msg-bubble"><span></span><span></span><span></span></div>';
    typing.id = 'cw-typing';
    return typing;
  }

  function removeTyping() {
    var t = document.getElementById('cw-typing');
    if (t) t.remove();
  }

  // ===== 发送消息 =====
  function sendMessage() {
    var input = document.getElementById('cw-input');
    var text = input.value.trim();
    if (!text) return;

    var body = document.getElementById('cw-body');
    body.appendChild(createMessage(text, 'user'));
    body.appendChild(showTyping());
    scrollBottom();
    input.value = '';

    var answer = findAnswer(text);
    var delay = 800 + Math.random() * 1200;

    setTimeout(function() {
      removeTyping();
      body.appendChild(createMessage(answer, 'bot'));
      scrollBottom();
    }, delay);
  }

  function scrollBottom() {
    var body = document.getElementById('cw-body');
    setTimeout(function() {
      body.scrollTop = body.scrollHeight;
    }, 50);
  }

  // ===== 初始化 =====
  function init() {
    // 注入 CSS
    var style = document.createElement('style');
    style.textContent = getCSS();
    document.head.appendChild(style);

    // 注入 HTML
    var html =
      '<div class="cw-widget" id="cw-widget">' +
        // 收起按钮
        '<div class="cw-toggle" id="cw-toggle" onclick="CW.toggle()">' +
          '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '</div>' +
        // 展开面板
        '<div class="cw-panel" id="cw-panel">' +
          '<div class="cw-header">' +
            '<div class="cw-header-left">' +
              '<div class="cw-header-icon">🤖</div>' +
              '<div>' +
                '<div class="cw-header-title">勤博士AI助手</div>' +
                '<div class="cw-header-status">在线 · 智能客服</div>' +
              '</div>' +
            '</div>' +
            '<button class="cw-close" onclick="CW.close()">✕</button>' +
          '</div>' +
          '<div class="cw-body" id="cw-body"></div>' +
          '<div class="cw-footer">' +
            '<input type="text" class="cw-input" id="cw-input" placeholder="输入您的问题..." onkeydown="if(event.key===\'Enter\')CW.send()">' +
            '<button class="cw-send" onclick="CW.send()">' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', html);

    // 首次打开欢迎语
    var body = document.getElementById('cw-body');
    body.appendChild(createMessage(KNOWLEDGE.greeting, 'bot'));
  }

  // ===== CSS =====
  function getCSS() {
    return [
      '.cw-widget { position:fixed; bottom:24px; right:24px; z-index:99999; font-family:"PingFang SC","Microsoft YaHei",sans-serif; }',
      '.cw-toggle { width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#4B0082,#7B2D8E); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 4px 16px rgba(75,0,130,0.35); transition:transform 0.2s,box-shadow 0.2s; }',
      '.cw-toggle:hover { transform:scale(1.08); box-shadow:0 6px 24px rgba(75,0,130,0.45); }',
      '.cw-toggle svg { transition:transform 0.3s; }',
      '.cw-panel { position:absolute; bottom:72px; right:0; width:380px; height:520px; background:#fff; border-radius:16px; box-shadow:0 8px 40px rgba(0,0,0,0.15); display:none; flex-direction:column; overflow:hidden; border:1px solid #e8e8ed; }',
      '.cw-panel.open { display:flex; animation:cwSlideUp 0.3s ease; }',
      '@keyframes cwSlideUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }',
      '.cw-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:linear-gradient(135deg,#4B0082,#2D0052); color:#fff; }',
      '.cw-header-left { display:flex; align-items:center; gap:10px; }',
      '.cw-header-icon { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; font-size:1.2rem; }',
      '.cw-header-title { font-size:0.9rem; font-weight:700; }',
      '.cw-header-status { font-size:0.7rem; opacity:0.8; }',
      '.cw-close { background:none; border:none; color:rgba(255,255,255,0.7); font-size:1.2rem; cursor:pointer; padding:4px 8px; border-radius:4px; }',
      '.cw-close:hover { color:#fff; background:rgba(255,255,255,0.15); }',
      '.cw-body { flex:1; overflow-y:auto; padding:16px; background:#f7f7fa; display:flex; flex-direction:column; gap:12px; }',
      '.cw-body::-webkit-scrollbar { width:4px; }',
      '.cw-body::-webkit-scrollbar-thumb { background:#d0d0d5; border-radius:2px; }',
      '.cw-msg { display:flex; gap:8px; max-width:90%; animation:cwMsgIn 0.3s ease; }',
      '@keyframes cwMsgIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }',
      '.cw-msg-user { align-self:flex-end; flex-direction:row-reverse; }',
      '.cw-msg-bot { align-self:flex-start; }',
      '.cw-msg-avatar { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.9rem; flex-shrink:0; background:#e8e8ed; }',
      '.cw-msg-bubble { padding:10px 14px; border-radius:14px; font-size:0.85rem; line-height:1.6; word-break:break-word; }',
      '.cw-msg-user .cw-msg-bubble { background:linear-gradient(135deg,#4B0082,#7B2D8E); color:#fff; border-bottom-right-radius:4px; }',
      '.cw-msg-bot .cw-msg-bubble { background:#fff; color:#1d1d1f; border-bottom-left-radius:4px; box-shadow:0 1px 4px rgba(0,0,0,0.06); }',
      '.cw-msg-bot .cw-msg-bubble strong { color:#4B0082; }',
      '.cw-msg-time { font-size:0.65rem; color:#999; margin-top:2px; align-self:flex-end; }',
      '.cw-msg-user .cw-msg-time { text-align:right; }',
      '.cw-typing .cw-msg-bubble { display:flex; gap:4px; align-items:center; padding:12px 16px; }',
      '.cw-typing .cw-msg-bubble span { width:6px; height:6px; border-radius:50%; background:#999; animation:cwBounce 1.4s infinite ease-in-out both; }',
      '.cw-typing .cw-msg-bubble span:nth-child(1) { animation-delay:0s; }',
      '.cw-typing .cw-msg-bubble span:nth-child(2) { animation-delay:0.16s; }',
      '.cw-typing .cw-msg-bubble span:nth-child(3) { animation-delay:0.32s; }',
      '@keyframes cwBounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4;} 40%{transform:scale(1);opacity:1;} }',
      '.cw-footer { display:flex; gap:8px; padding:12px 16px; border-top:1px solid #e8e8ed; background:#fff; }',
      '.cw-input { flex:1; padding:10px 14px; border:1.5px solid #e8e8ed; border-radius:20px; font-size:0.85rem; outline:none; font-family:inherit; transition:border-color 0.2s; }',
      '.cw-input:focus { border-color:#4B0082; }',
      '.cw-send { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#4B0082,#7B2D8E); color:#fff; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:transform 0.2s; }',
      '.cw-send:hover { transform:scale(1.1); }',
      '.cw-widget.open .cw-toggle { display:none; }',
      '.cw-widget.open .cw-panel { display:flex; }',
      '@media (max-width:480px) {',
        '.cw-panel { width:calc(100vw - 32px); height:60vh; right:0; border-radius:16px 16px 0 0; position:fixed; bottom:0; }',
        '.cw-widget { right:12px; bottom:12px; }',
        '.cw-toggle { width:48px; height:48px; }',
      '}'
    ].join('');
  }

  // ===== API =====
  window.CW = {
    open: function() {
      var panel = document.getElementById('cw-panel');
      panel.classList.add('open');
      document.getElementById('cw-toggle').style.display = 'none';
      scrollBottom();
    },
    close: function() {
      var panel = document.getElementById('cw-panel');
      panel.classList.remove('open');
      document.getElementById('cw-toggle').style.display = 'flex';
    },
    toggle: function() {
      var panel = document.getElementById('cw-panel');
      if (panel.classList.contains('open')) {
        window.CW.close();
      } else {
        window.CW.open();
      }
    },
    send: sendMessage
  };

  document.addEventListener('DOMContentLoaded', init);
})();
