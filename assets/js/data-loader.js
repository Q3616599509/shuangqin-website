/* Data Loader - 优先从 localStorage 加载，回退到 data.json */

var DataLoader = (function() {
  var cachedData = null;
  var STORAGE_KEY = 'siteData';

  function load() {
    return new Promise(function(resolve, reject) {
      if (cachedData) {
        return resolve(cachedData);
      }

      // 1. 优先使用 localStorage 中的数据（管理后台修改后的版本）
      var localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        try {
          cachedData = JSON.parse(localData);
          // 数据结构兼容性检查：确保 clients 是 {categories, items} 格式
          if (cachedData.clients && Array.isArray(cachedData.clients)) {
            console.warn('[DataLoader] 检测到旧版 clients 格式，自动转换为新格式');
            cachedData.clients = { categories: ['全部'], items: cachedData.clients };
          }
          console.log('[DataLoader] 从 localStorage 加载数据');
          return resolve(cachedData);
        } catch (e) {
          console.warn('[DataLoader] localStorage 数据解析失败，回退到默认数据');
        }
      }

      // 2. 回退到 data.json
      fetch('data/data.json')
        .then(function(response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.json();
        })
        .then(function(data) {
          cachedData = data;
          console.log('[DataLoader] 从 data.json 加载数据');
          resolve(data);
        })
        .catch(function(err) {
          console.error('[DataLoader] data.json 加载失败:', err);
          reject(err);
        });
    });
  }

  // 管理后台使用：保存数据到 localStorage
  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      cachedData = data;
      console.log('[DataLoader] 数据已保存到 localStorage');
      return true;
    } catch (e) {
      console.error('[DataLoader] 保存失败:', e);
      return false;
    }
  }

  // 管理后台使用：重置为默认数据
  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    cachedData = null;
    console.log('[DataLoader] 已重置为默认数据');
  }

  // 管理后台使用：导出当前数据为 JSON 文件
  function exportData() {
    var data = cachedData;
    if (!data) {
      // 尝试从 localStorage 获取
      var localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        try { data = JSON.parse(localData); } catch(e) {}
      }
    }
    if (!data) return null;
    return JSON.stringify(data, null, 2);
  }

  return {
    load: load,
    save: save,
    reset: reset,
    exportData: exportData
  };
})();
