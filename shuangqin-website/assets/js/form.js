/* Form Validation & Submission */

document.addEventListener('DOMContentLoaded', function() {
  initContactForms();
});

function initContactForms() {
  var forms = document.querySelectorAll('.contact-form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateForm(form)) return;

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = '发送中...';
      submitBtn.disabled = true;

      var formData = collectFormData(form);
      formData.time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

      // 优先用 API，失败则 fallback 到 mailto
      sendViaAPI(formData).then(function() {
        showSuccessMessage(form, '✓ 您的咨询已成功发送，我们将尽快回复！');
        form.reset();
      }).catch(function() {
        // API 不可用，用 mailto 兜底
        sendViaMailto(formData);
        showSuccessMessage(form, '✓ 邮件客户端已打开，请点击发送即可。如未打开，请直接发邮件至 contact@sqmc.tech');
        form.reset();
      }).finally(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  });
}

function collectFormData(form) {
  var data = {};
  form.querySelectorAll('input, select, textarea').forEach(function(input) {
    var ph = input.placeholder || '';
    if (ph.includes('姓名')) data.name = input.value;
    else if (ph.includes('公司')) data.company = input.value;
    else if (ph.includes('邮箱')) data.email = input.value;
    else if (ph.includes('电话')) data.phone = input.value;
    else if (ph.includes('服务类型')) data.service = input.value;
    else if (ph.includes('需求')) data.message = input.value;
  });
  return data;
}

function sendViaAPI(formData) {
  return fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  }).then(function(resp) {
    if (!resp.ok) throw new Error('API unavailable');
    return resp.json();
  }).then(function(result) {
    if (!result.success) throw new Error(result.error || 'failed');
    return result;
  });
}

function sendViaMailto(formData) {
  var subject = encodeURIComponent('【网站咨询】' + (formData.name || '') + ' - ' + (formData.company || ''));
  var body = encodeURIComponent(
    '════════════════════════\n' +
    '时间: ' + formData.time + '\n' +
    '姓名: ' + (formData.name || '未填写') + '\n' +
    '公司: ' + (formData.company || '未填写') + '\n' +
    '邮箱: ' + (formData.email || '未填写') + '\n' +
    '电话: ' + (formData.phone || '未填写') + '\n' +
    '服务: ' + (formData.service || '未选择') + '\n' +
    '════════════════════════\n' +
    '需求描述:\n' + (formData.message || '无')
  );
  window.open('mailto:contact@sqmc.tech?subject=' + subject + '&body=' + body, '_blank');
}

// ===== 表单验证 =====
function validateForm(form) {
  var isValid = true;
  var inputs = form.querySelectorAll('input[required], textarea[required]');
  form.querySelectorAll('.form-error').forEach(function(err) { err.remove(); });
  form.querySelectorAll('.form-input.error, .form-textarea.error').forEach(function(el) {
    el.classList.remove('error');
    el.style.borderColor = '';
  });

  inputs.forEach(function(input) {
    if (!input.value.trim()) {
      showError(input, '请填写此字段');
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      showError(input, '请输入有效的邮箱地址');
      isValid = false;
    } else if (input.type === 'tel' && input.value.trim() && !isValidPhone(input.value)) {
      showError(input, '请输入有效的电话号码');
      isValid = false;
    }
  });
  return isValid;
}

function showError(input, message) {
  input.classList.add('error');
  input.style.borderColor = '#e74c3c';
  var error = document.createElement('span');
  error.className = 'form-error';
  error.style.cssText = 'color: #e74c3c; font-size: 0.75rem; margin-top: 4px; display: block;';
  error.textContent = message;
  input.parentNode.appendChild(error);
}

function showSuccessMessage(form, message) {
  var existing = form.querySelector('.form-success');
  if (existing) existing.remove();
  var success = document.createElement('div');
  success.className = 'form-success';
  success.style.cssText = 'background: #27ae60; color: white; padding: 16px; border-radius: 8px; margin-top: 16px; text-align: center; font-weight: 600;';
  success.textContent = message;
  form.appendChild(success);
  setTimeout(function() {
    success.style.opacity = '0';
    success.style.transition = 'opacity 0.5s';
    setTimeout(function() { success.remove(); }, 500);
  }, 5000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
  return /^[\d\s\-\+\(\)]{7,}$/.test(phone);
}
