// 站点总浏览量 —— 从计数器 /total 拉取所有文章浏览量之和，显示在侧边栏「网站资讯」卡片
(function () {
  var ENDPOINT = "https://server.jerryblog452.top";

  var webinfo = document.querySelector(".card-webinfo .webinfo");
  if (!webinfo) return;

  fetch(ENDPOINT + "/total")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var item = document.createElement("div");
      item.className = "webinfo-item";

      var name = document.createElement("div");
      name.className = "item-name";
      name.textContent = "总浏览量 :";

      var count = document.createElement("div");
      count.className = "item-count";
      count.textContent = d.total;

      item.appendChild(name);
      item.appendChild(count);

      // 插到「最后更新时间」之前，没有的话追加到末尾
      var lastPush = webinfo.querySelector("#last-push-date");
      if (lastPush && lastPush.parentElement) {
        webinfo.insertBefore(item, lastPush.parentElement);
      } else {
        webinfo.appendChild(item);
      }
    })
    .catch(function () {});
})();
