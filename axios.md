```
// 创建一个名为axios的对象
var axios = {
  // 封装GET请求方法
  get: function(url, config) {
    // 返回一个Promise对象，用于处理异步操作
    return new Promise(function(resolve, reject) {
      // 创建一个XHR对象
      var xhr = new XMLHttpRequest();
      // 初始化请求
      xhr.open('GET', url);
      
      // 设置请求头部信息
      if (config && config.headers) {
        for (var header in config.headers) {
          xhr.setRequestHeader(header, config.headers[header]);
        }
      }
      
      // 监听XHR对象的状态改变事件
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            // 请求成功，调用resolve方法并传入响应数据
            resolve(xhr.responseText);
          } else {
            // 请求失败，调用reject方法并传入错误信息
            reject(new Error('Request failed with status ' + xhr.status));
          }
        }
      };
      
      // 发送请求
      xhr.send();
    });
  },
  
  // 封装POST请求方法
  post: function(url, data, config) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      
      // 设置请求头部信息
      if (config && config.headers) {
        for (var header in config.headers) {
          xhr.setRequestHeader(header, config.headers[header]);
        }
      }
      
      // 监听XHR对象的状态改变事件
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText);
          } else {
            reject(new Error('Request failed with status ' + xhr.status));
          }
        }
      };
      
      // 将数据转换为JSON格式并发送请求
      xhr.send(JSON.stringify(data));
    });
  }
};

// 示例用法
axios.get('https://api.example.com/data')
  .then(function(response) {
    console.log('GET request successful:', response);
  })
  .catch(function(error) {
    console.error('GET request failed:', error);
  });

axios.post('https://api.example.com/post', { key: 'value' })
  .then(function(response) {
    console.log('POST request successful:', response);
  })
  .catch(function(error) {
    console.error('POST request failed:', error);
  });

```