import{_ as s,o as a,c as p,y as t}from"./chunks/framework.CNTkXYA8.js";const r=JSON.parse('{"title":"【数据结构】链式向前星知识点&代码","description":"","frontmatter":{"title":"【数据结构】链式向前星知识点&代码","date":"2018-11-06T15:57:00.000Z"},"headers":[],"relativePath":"blog/post-9915713.md","filePath":"source/old_posts/post-9915713.md"}'),e={name:"blog/post-9915713.md"};function i(l,n,c,o,d,h){return a(),p("div",null,[...n[0]||(n[0]=[t(`<p>代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct NODE{</span></span>
<span class="line"><span>    int to;</span></span>
<span class="line"><span>    int nxt;</span></span>
<span class="line"><span>    int c;</span></span>
<span class="line"><span>}node[MM];//链式向前星</span></span>
<span class="line"><span>int head[NM],lcnt=1;</span></span>
<span class="line"><span>void add(int a,int b,int c){</span></span>
<span class="line"><span>    node[lcnt].to=b;</span></span>
<span class="line"><span>    node[lcnt].c=c;</span></span>
<span class="line"><span>    node[lcnt].nxt=head[a];</span></span>
<span class="line"><span>    head[a]=lcnt++;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>1.使用结构体构建链式向前星的容器</p><p>链式向前星本质上是使用链表存边，一条链表代表着一个点发出的所有边。所以一个这个结构体代表着这条链表中的一项</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct NODE{</span></span>
<span class="line"><span>	int to;     //指向下一条边</span></span>
<span class="line"><span>	int nxt;    //指向同一个点发出的另一条边</span></span>
<span class="line"><span>	int c;      //边权</span></span>
<span class="line"><span>}node[MM];//链式向前星</span></span></code></pre></div><p>2.第一条边——head和边的编号</p><p>NM是一个常量，代表着点的数量；</p><p>head代表着一条链表的第一个项，也就是一个点所发出的第一条边（第一的意思是可以从这链表的这一项一直跳完所有项），至于如何实现请看 3 部分。</p><p>lcnt是赋予边编号的变量，之所以初始化为1，请看 4 部分。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int head[NM];int lcnt=1;</span></span></code></pre></div><p>3.三个变量一台戏——如何加边（add）</p><p>a，b，c分别代表入边，出边，权值</p><p>这个函数设置编号为lcnt的边，将to指向的是节点编号</p><p>重点在nxt的操作上。将nxt赋值为a节点的“第一条边”，那么就是说这个点接下来的可以跳的边或者说链表的项是 head[a]</p><p>接下来将”第一条边”赋值为当前的编号，那么下一次添加以a为源点的边可以跳的边或者说链表的项就是现在的边或者说项了。</p><p>那就意味着最后一次添加的边（项），可以一直跳到第一次添加的边（项），也就符合我们在第 2 条定义的“第一条边”了。</p><p>别忘了将编号++，以便下次使用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void add(int a,int b,int c){     //改变编号为lcnt的边</span></span>
<span class="line"><span>	node[lcnt].to=b;         //出边指向b</span></span>
<span class="line"><span>	node[lcnt].c=c;          //记录权值</span></span>
<span class="line"><span>	node[lcnt].nxt=head[a];  //将其指向目前的”第一条边“，也就是说能跳到”第一条边”</span></span>
<span class="line"><span>	head[a]=lcnt++;          //“第一条边”更新为目前的编号，那么下一条边能够跳到这一条边，那么最后的head自然就是真正的“第一条边”了；编号++一遍下次使用</span></span>
<span class="line"><span>}</span></span></code></pre></div><p></p><p></p><p>4.遍历某个点所连接的所有边</p><p>要遍历就可以利用前面求出的”第一条边“和这些链表了。</p><p>自然可以用for，从一开始将循环变量i初始化为要遍历的源点k的”第一条边“，head[k]</p><p>在判断的时候，判断是否还有下一条边，这时候就是lcnt初始化为1的作用了。如果没有初始化为1，就会存在编号为0的点，判断就会误认为已经结束了。</p><p>于是判断就必须写i!=-1了，但是打&quot;=1&quot;只需要两个字符，而&quot;i!=-1&quot;比起&quot;i&quot;要多4个字符，而且不符合我们人类的思维习惯：从1开始，所以我们采用lcnt初始化为1</p><p>（“i”在C++里的意思是简写的 i!=0 ）</p><p>然后到每次循环结束做的改变，自然是直接跳到链表的下一项。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for(int i=head[k];i;i=node[i].nxt){</span></span>
<span class="line"><span>	int u=node[i].to;</span></span>
<span class="line"><span>	//u就是所连接的点　　　　　int v=node[i].c;</span><span>　　　　　//v就是边的权值</span></span>
<span class="line"><span>}</span></span></code></pre></div><p></p><p></p><p>5.注意双向边</p><p>如果你的题目要求是双向边的话,加边操作需要进行两次：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>add(a,b,c);</span></span>
<span class="line"><span>add(b,a,c);</span></span></code></pre></div><p>注意，这时候node数组需要开<strong>两倍于边数的空间</strong></p>`,34)])])}const g=s(e,[["render",i]]);export{r as __pageData,g as default};
