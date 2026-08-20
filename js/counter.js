// 博客浏览量计数器 —— 注入到 _config.butterfly.yml 的 inject.bottom
// 用法：把 ENDPOINT 改成你的计数器域名（Cloudflare 代理后的那个）
(function () {
  var ENDPOINT = "https://server.jerryblog452.top";

  // 只在文章页/独立页跑（有 .post-title 元素的页面）
  var titleEl = document.querySelector(".post-title");
  if (!titleEl) return;

  // slug = URL 最后一段，如 /2026/02/25/nixos-winapps/ -> nixos-winapps
  var segments = window.location.pathname.split("/").filter(Boolean);
  var slug = segments[segments.length - 1];
  var title = titleEl.textContent.trim();

  // 1) 记一次访问（POST /view）
  fetch(ENDPOINT + "/view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug: slug, title: title })
  }).catch(function () {});

  // 2) 拉取并显示浏览量（优先复用不蒜子的显示位；没有就自己建一个）
  fetch(ENDPOINT + "/count?slug=" + encodeURIComponent(slug))
    .then(function (r) { return r.json(); })
    .then(function (d) { showCount(d.count); })
    .catch(function () {});

  function showCount(n) {
    var busuanziEl = document.getElementById("busuanzi_value_page_pv");
    if (busuanziEl) {
      busuanziEl.textContent = n;
      return;
    }
    // 自己建一个"浏览量"放到文章 meta 栏末尾
    var meta = document.querySelector(".meta-secondline");
    if (!meta) return;
    var sep = document.createElement("span");
    sep.className = "post-meta-separator";
    sep.textContent = "|";
    var pv = document.createElement("span");
    pv.innerHTML =
      '<i class="far fa-eye fa-fw post-meta-icon"></i>' +
      '<span class="post-meta-label">' + "浏览量" + ":</span> " +
      '<span>' + n + "</span>";
    meta.appendChild(sep);
    meta.appendChild(pv);
  }
})();
