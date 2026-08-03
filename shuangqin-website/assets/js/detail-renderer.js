/* Detail Renderer - 详情页渲染逻辑 (重构版) */

var DetailRenderer = (function() {

  function getParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (search) {
      search.split('&').forEach(function(pair) {
        var parts = pair.split('=');
        params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
      });
    }
    return params;
  }

  // ===== 查找数据 =====
  function findById(arr, id) {
    if (!arr) return null;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) return arr[i];
    }
    return null;
  }

  function findBusiness(data, id) {
    return findById(data.coreBusinesses, id);
  }

  function findProduct(data, id) {
    return findById(data.products, id);
  }

  function findSubItem(data, id, parentId) {
    console.log('[findSubItem] 查找 id=' + id + ', parentId=' + parentId);

    // 1. 在 coreBusinesses 中按 parentId 找到业务，再在其子项中按 id 查找
    if (data.coreBusinesses) {
      for (var i = 0; i < data.coreBusinesses.length; i++) {
        var biz = data.coreBusinesses[i];
        if (biz.id === parentId && biz.details && biz.details.items) {
          var found = findById(biz.details.items, id);
          if (found) {
            console.log('[findSubItem] 在 coreBusinesses[' + i + '].details.items 中找到:', found.title);
            return found;
          }
        }
      }
      // 1b. 兜底：遍历所有 coreBusinesses 的所有子项
      for (var j = 0; j < data.coreBusinesses.length; j++) {
        var biz2 = data.coreBusinesses[j];
        if (biz2.details && biz2.details.items) {
          var found2 = findById(biz2.details.items, id);
          if (found2) {
            console.log('[findSubItem] 兜底在 coreBusinesses[' + j + '].details.items 中找到:', found2.title);
            return found2;
          }
        }
      }
    }

    // 2. 在 products 中查找
    var product = findById(data.products, id);
    if (product) {
      console.log('[findSubItem] 在 products 中找到:', product.title);
      return product;
    }

    console.log('[findSubItem] 未找到 id=' + id);
    return null;
  }

  // ===== 面包屑 =====
  function renderBreadcrumb(data, type, id, item, parentId) {
    var crumbs = [{ label: '首页', href: 'index.html' }];

    if (type === 'business' || type === 'sub') {
      crumbs.push({ label: '核心业务', href: 'services.html' });
      if (type === 'sub' && parentId) {
        var parentBiz = findBusiness(data, parentId);
        if (parentBiz) {
          crumbs.push({ label: parentBiz.title, href: 'detail.html?type=business&id=' + parentId });
        }
      }
    } else if (type === 'product') {
      crumbs.push({ label: '产品体系', href: 'index.html#products' });
    }

    if (item && item.title) {
      crumbs.push({ label: item.title });
    }

    var html = crumbs.map(function(c, i) {
      if (c.href && i < crumbs.length - 1) {
        return '<a href="' + c.href + '">' + c.label + '</a>';
      }
      return '<span>' + c.label + '</span>';
    }).join(' <span class="breadcrumb-sep">/</span> ');

    document.getElementById('breadcrumb').innerHTML = html;
  }

  // ===== 渲染表格（university/expert） =====
  function renderTable(detailList, headers, fields) {
    if (!detailList || detailList.length === 0) {
      return '<div class="detail-empty">暂无数据，请通过管理后台添加</div>';
    }
    var headerHtml = headers.map(function(h) { return '<th>' + h + '</th>'; }).join('');
    var rowsHtml = detailList.map(function(item) {
      var cells = fields.map(function(f) {
        return '<td>' + (item[f] || '-') + '</td>';
      }).join('');
      return '<tr>' + cells + '</tr>';
    }).join('');

    return '<div class="detail-table-wrapper">' +
      '<table class="detail-table">' +
        '<thead><tr>' + headerHtml + '</tr></thead>' +
        '<tbody>' + rowsHtml + '</tbody>' +
      '</table>' +
    '</div>';
  }

  // ===== 渲染服务卡片 =====
  function renderServiceCards(detailList) {
    if (!detailList || detailList.length === 0) {
      return '<div class="detail-empty">暂无数据，请通过管理后台添加</div>';
    }
    return '<div class="detail-cards">' +
      detailList.map(function(item, i) {
        return '<div class="detail-card fade-in-up stagger-' + i + '">' +
          '<div class="detail-card-num">' + (i + 1) + '</div>' +
          '<h3>' + (item.title || item.name || '') + '</h3>' +
          '<p>' + (item.description || '') + '</p>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  // ===== 渲染子项卡片（business 详情页） =====
  function renderSubItems(items, parentId) {
    if (!items || items.length === 0) {
      return '<div class="detail-empty">暂无子项数据</div>';
    }
    return '<div class="detail-sub-grid">' +
      items.map(function(item, i) {
        var linkHref = 'detail.html?type=sub&id=' + item.id + '&parent=' + parentId;
        return '<a href="' + linkHref + '" class="detail-sub-card fade-in-up stagger-' + i + '">' +
          '<div class="detail-sub-icon">' + (item.icon || '📄') + '</div>' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + item.description + '</p>' +
          '<span class="detail-sub-link">查看详情 →</span>' +
        '</a>';
      }).join('') +
    '</div>';
  }

  // ===== 渲染关键数据高亮 =====
  function renderHighlights(item) {
    if (!item.detailList || item.detailList.length === 0) return '';
    return '<div class="detail-highlights">' +
      '<div class="detail-highlight-num">' + item.detailList.length + '</div>' +
      '<div class="detail-highlight-text">项详细内容</div>' +
    '</div>';
  }

  // ===== 主渲染函数 =====
  function renderContent(data) {
    var params = getParams();
    var type = params.type;
    var id = params.id;
    var parent = params.parent;

    console.log('[DetailRenderer] type=' + type + ', id=' + id + ', parent=' + parent);
    console.log('[DetailRenderer] data.coreBusinesses:', data.coreBusinesses ? data.coreBusinesses.length : 0);
    console.log('[DetailRenderer] data.products:', data.products ? data.products.length : 0);

    var item = null;

    if (type === 'business') {
      item = findBusiness(data, id);
      if (item && item.details) {
        renderBreadcrumb(data, type, id, item);
        setText('detail-title', item.title);
        setText('detail-description', item.description);
        setText('detail-subtitle', item.details.subtitle || '');
        setHtml('detail-highlights', renderHighlights(item));
        setHtml('detail-body', renderSubItems(item.details.items, id));
        return;
      }
    } else if (type === 'product') {
      item = findProduct(data, id);
      if (item) {
        renderBreadcrumb(data, type, id, item);
        setText('detail-title', item.title);
        setText('detail-description', item.description);
        setText('detail-subtitle', '服务详情');
        setHtml('detail-highlights', renderHighlights(item));
        var detailHtml = renderDetailByType(item);
        setHtml('detail-body', detailHtml);
        return;
      }
    } else if (type === 'sub') {
      item = findSubItem(data, id, parent);
      if (item) {
        renderBreadcrumb(data, type, id, item, parent);
        setText('detail-title', item.title);
        setText('detail-description', item.description || '');
        setText('detail-subtitle', '详细信息');
        setHtml('detail-highlights', renderHighlights(item));
        var detailHtml = renderDetailByType(item);
        setHtml('detail-body', detailHtml);
        return;
      }
    }

    // 未找到
    setText('detail-title', '内容未找到');
    setText('detail-description', '请检查链接是否正确');
    setHtml('detail-highlights', '');
    setHtml('detail-body', '');
  }

  function renderDetailByType(item) {
    if (item.detailType === 'university') {
      return renderTable(item.detailList,
        ['高校名称', '合作教授', '专业方向', '联系方式'],
        ['name', 'professor', 'specialty', 'contact']);
    } else if (item.detailType === 'expert') {
      return renderTable(item.detailList,
        ['姓名', '领域', '经验', '简介'],
        ['name', 'field', 'experience', 'description']);
    } else {
      return renderServiceCards(item.detailList);
    }
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }

  function setHtml(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html || '';
  }

  return {
    renderContent: renderContent
  };
})();
