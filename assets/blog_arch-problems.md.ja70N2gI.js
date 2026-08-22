import{_ as a,o as n,c as p,x as e}from"./chunks/framework.CMtdJmbM.js";const h=JSON.parse('{"title":"2026Arch之坑","description":"","frontmatter":{"title":"2026Arch之坑","date":"2026-02-11T16:22:52.000Z","tags":["linux","arch"],"how-to":true},"headers":[],"relativePath":"blog/arch-problems.md","filePath":"source/_posts/arch-problems.md"}'),l={name:"blog/arch-problems.md"};function i(t,s,c,o,r,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<p>背景:</p><p>Thinkpad X1 Carbon gen13 Aura</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Linux dudujerry 6.18.7-arch1-1 #1 SMP PREEMPT_DYNAMIC Sat, 24 Jan 2026 00:47:39 +0000 x86_64 GNU/Linux</span></span></code></pre></div><p>大部分东西开箱即用, 遇坑如下:</p><h1 id="字体问题" tabindex="-1">字体问题 <a class="header-anchor" href="#字体问题" aria-label="Permalink to &quot;字体问题&quot;">​</a></h1><p>未安装字体时, emoji和中文都不会正常显示. 安装中文字体默认按照日文渲染，导致&quot;包, 称&quot;等字少一个竖. 需要配置字体conf.</p><h1 id="触摸板tap" tabindex="-1">触摸板tap <a class="header-anchor" href="#触摸板tap" aria-label="Permalink to &quot;触摸板tap&quot;">​</a></h1><p>编辑sway的config文件中的input时, 其管理的字段若有名称错误, 并不会提示错误, 坑了我很久. 比如<code>tap_drag</code>在<code>swaymsg -t get_inputs</code>中显示为<code>tap_drag</code>, 实际需要用<code>drag</code>来配置.</p><p>可以通过</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>input type:touchpad {</span></span>
<span class="line"><span>    tap enabled</span></span>
<span class="line"><span>    drag enabled</span></span>
<span class="line"><span>    drag_lock disabled</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>等来启动轻点和拖动, 并禁止拖动锁定. (拖动锁定的体验极差)</p><h1 id="pwm调光问题" tabindex="-1">pwm调光问题 <a class="header-anchor" href="#pwm调光问题" aria-label="Permalink to &quot;pwm调光问题&quot;">​</a></h1><p>某些笔记本自带的低亮度pwm调光非常伤眼（我的眼睛看一个小时就很酸疼了）， 必须第一时间设置. 用brightnessctl将最低亮度设置为60%, 然后用wl-gammarelay-rs降低gamma值模拟低亮度效果, 副作用是会导致黑色发灰.</p><p>sway配置:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>exec wl-gammarelay-rs</span></span>
<span class="line"><span>exec_always brightnessctl set 60%</span></span>
<span class="line"><span>bindsym --locked XF86MonBrightnessDown exec busctl --user -- call rs.wl-gammarelay / rs.wl.gammarelay UpdateBrightness d -0.05</span></span>
<span class="line"><span>bindsym --locked XF86MonBrightnessUp exec busctl --user -- call rs.wl-gammarelay / rs.wl.gammarelay UpdateBrightness d +0.05</span></span></code></pre></div><h1 id="代理" tabindex="-1">代理 <a class="header-anchor" href="#代理" aria-label="Permalink to &quot;代理&quot;">​</a></h1><p>用dae代理, 大模型直接写出<code>/etc/dae/config.dae</code>配置.</p><h1 id="指纹解锁" tabindex="-1">指纹解锁 <a class="header-anchor" href="#指纹解锁" aria-label="Permalink to &quot;指纹解锁&quot;">​</a></h1><p>我希望开机进入tty界面时能自动启动一个指纹认证脚本, 用fprintd. 这里注意fprintd默认是不开放给普通用户使用的, 需要polkit设置权限.</p><p>设置后, 用<code>fprintd-enroll</code>录入本用户指纹.</p><p>编写指纹认证脚本</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># ==============================================================================</span></span>
<span class="line"><span>#                 Fingerprint Login Script for Linux TTY</span></span>
<span class="line"><span># ==============================================================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 配置 ---</span></span>
<span class="line"><span># 请务必修改为你的实际用户名</span></span>
<span class="line"><span>USER=&quot;dudujerry&quot;</span></span>
<span class="line"><span># 设置最大重试次数</span></span>
<span class="line"><span>MAX_RETRIES=3</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 核心：确保必要的服务正在运行 ---</span></span>
<span class="line"><span># fprintd 依赖 dbus</span></span>
<span class="line"><span>systemctl is-active --quiet dbus || systemctl start dbus</span></span>
<span class="line"><span>systemctl is-active --quiet fprintd || systemctl start fprintd</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 准备工作 ---</span></span>
<span class="line"><span>retry=0</span></span>
<span class="line"><span># 将当前tty设备名保存下来，以便明确地与之交互</span></span>
<span class="line"><span># tty命令会输出当前所在的终端设备，例如 /dev/tty1</span></span>
<span class="line"><span>CURRENT_TTY=$(tty)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 清理屏幕并显示欢迎信息</span></span>
<span class="line"><span>clear</span></span>
<span class="line"><span>echo &quot;=====================================&quot;</span></span>
<span class="line"><span>echo &quot;  Arch Linux Fingerprint Login ($CURRENT_TTY)&quot;</span></span>
<span class="line"><span>echo &quot;=====================================&quot;</span></span>
<span class="line"><span>echo &quot;  User: $USER&quot;</span></span>
<span class="line"><span>echo &quot;  Swipe your fingerprint to login...&quot;</span></span>
<span class="line"><span>echo &quot;  Max retries: $MAX_RETRIES&quot;</span></span>
<span class="line"><span>echo &quot;=====================================&quot;</span></span>
<span class="line"><span>echo &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 验证循环 ---</span></span>
<span class="line"><span>while [ $retry -lt $MAX_RETRIES ]; do</span></span>
<span class="line"><span>    # 核心修正:</span></span>
<span class="line"><span>    # 1. 使用 \`sudo -u $USER\` 代替 \`su\`。它在切换用户时能更好地处理权限和环境。</span></span>
<span class="line"><span>    # 2. 正确传递D-Bus地址，并直接执行命令，无需复杂的shell嵌套。</span></span>
<span class="line"><span>    # 3. 将 fprintd-verify 的标准输出和标准错误都重定向到当前TTY，确保用户能看到提示。</span></span>
<span class="line"><span>    #    fprintd-verify 的提示信息是打印到标准错误的，所以需要 \`2&gt; $CURRENT_TTY\`。</span></span>
<span class="line"><span>    # 4. \`fprintd-verify\` 命令本身不接受用户名参数。</span></span>
<span class="line"><span>    sudo -u $USER DBUS_SYSTEM_BUS_ADDRESS=unix:path=/run/dbus/system_bus_socket fprintd-verify &gt; $CURRENT_TTY 2&gt; $CURRENT_TTY</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 获取 fprintd-verify 的退出码</span></span>
<span class="line"><span>    verify_result=$?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # --- 结果判断 ---</span></span>
<span class="line"><span>    # 验证成功 (退出码 0)</span></span>
<span class="line"><span>    if [ $verify_result -eq 0 ]; then</span></span>
<span class="line"><span>        echo -e &quot;\\n[SUCCESS] Fingerprint verified! Logging in as $USER...&quot;</span></span>
<span class="line"><span>        sleep 1</span></span>
<span class="line"><span>        # 使用 exec login -f $USER 来无密码登录用户，并替换当前脚本进程</span></span>
<span class="line"><span>        exec login -f $USER</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 验证失败</span></span>
<span class="line"><span>    retry=$((retry + 1))</span></span>
<span class="line"><span>    remaining=$((MAX_RETRIES - retry))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if [ $remaining -gt 0 ]; then</span></span>
<span class="line"><span>        echo -e &quot;\\n[FAILED] Fingerprint mismatch or error. Please try again. ($remaining retries left)&quot;</span></span>
<span class="line"><span>        echo &quot;&quot;</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 重试失败后回退 ---</span></span>
<span class="line"><span>echo -e &quot;\\n[ERROR] All fingerprint authentication attempts failed.&quot;</span></span>
<span class="line"><span>echo &quot;Fallback to password-based login...&quot;</span></span>
<span class="line"><span>sleep 2</span></span>
<span class="line"><span># 执行常规的 login 程序，让用户输入密码</span></span>
<span class="line"><span>exec login</span></span></code></pre></div><p>完成后覆盖tty1行为, 输入<code>systemctl edit getty@tty1.service</code>, 修改为:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[Service]</span></span>
<span class="line"><span>ExecStart=</span></span>
<span class="line"><span># 解释：</span></span>
<span class="line"><span># --skip-login (-n): 不提示输入用户名，直接运行后面的程序</span></span>
<span class="line"><span># --noclear: 不清屏</span></span>
<span class="line"><span># --login-program: 指定我们的指纹脚本，而不是默认的 /bin/login</span></span>
<span class="line"><span># $TERM: 传递终端类型</span></span>
<span class="line"><span>ExecStart=-/sbin/agetty --skip-login --noclear --login-program /usr/local/bin/fingerprint-login %I $TERM</span></span></code></pre></div><h1 id="x11缩放" tabindex="-1">x11缩放 <a class="header-anchor" href="#x11缩放" aria-label="Permalink to &quot;x11缩放&quot;">​</a></h1><p>直接使用wayland自带的xwayland时, xwayland会接到默认dpi=92的画布参数, 渲染出来大小不够, 使得wayland显示时进行nearst手动放大, 导致模糊. 需要禁用xwayland并安装xwayland-satellite, sway配置如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>xwayland disabled</span></span>
<span class="line"><span>exec xwayland-satellite # x11 应用启动后需要设置DISPLAY=:0</span></span>
<span class="line"><span>exec_always &quot;sleep 2 &amp;&amp; DISPLAY=:0 xrdb -merge ~/.Xresources&quot; # 加载X资源设置DPI</span></span></code></pre></div><p>注: <code>~/.Xresources</code>为&quot;Xft.dpi: 192&quot;</p><p>注意这样设置后, 所有x11程序在启动时必须获得DISPLAY=:0以连接到xwayland-satellite的x11服务器.<br> 并且, 输入法在启动时也要设置DISPLAY=:0以让程序有机会注册输入法. 为了同步输入法dpi, 还需要设置xdpi, 方式如上.</p><p>关于输入法的更详细信息, 详见另一篇博文.</p><p>另外, 对于那些同时支持x11和wayland的程序, 比如linuxqq, 有时需要启动参数强制以wayland启动.</p><p>写完后深感无力, 格式化转nixos.</p><hr><p>2026.2.11</p><p>已转niri, niri自带xwayland-satellite, 支持x11程序动态缩放。 非必要不建议使用sway, 除非依赖老的i3配置。</p>`,35)])])}const g=a(l,[["render",i]]);export{h as __pageData,g as default};
