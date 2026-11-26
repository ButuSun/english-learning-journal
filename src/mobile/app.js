'use strict';
const $=s=>document.querySelector(s), APP_VERSION='1.0.0';
const RAW='https://raw.githubusercontent.com/ButuSun/english-learning-journal/main/mobile/';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
function read(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
function put(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{toast('本机空间不足，尚未保存，请立即复制原文');return false}}
let data={records:{},studySchedule:{}}, page='calendar', selected=today(), month=selected.slice(0,7), tab=0, detail=null;
let grammarOpenPoint=null, grammarReturn=null;
let drafts=read('wj.drafts',[]), favourites=read('wj.favourites',[]), font=read('wj.font',19), currentDraft=null, reviewTab=0, query='', timerStarted=null,timerSeconds=0;
let lastSync=read('wj.lastSync',null), refreshing=false;
document.documentElement.style.setProperty('--font',font+'px');
function toast(s){$('#toast').textContent=s;$('#toast').style.display='block';clearTimeout(toast.id);toast.id=setTimeout(()=>$('#toast').style.display='none',3500)}
function nav(p){page=p;detail=null;tab=0;grammarReturn=null;render();window.scrollTo(0,0)}
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>nav(b.dataset.page));
$('#settings').onclick=settings;$('#closeSheet').onclick=()=>$('#sheet').close();
function sheet(html){$('#sheetBody').innerHTML=html;if(!$('#sheet').open)$('#sheet').showModal()}
function render(){document.body.classList.toggle('grammar-review-active',page==='review'&&reviewTab===0&&!detail);document.querySelectorAll('[data-page]').forEach(b=>{b.removeAttribute('aria-current');if(b.dataset.page===page)b.setAttribute('aria-current','page')});if(detail)renderDetail();else if(page==='calendar')renderCalendar();else if(page==='write')renderWrite();else renderReview()}
function prep(){const d=Date.parse(today()+'T00:00:00Z'),start=Date.parse('2026-10-12T00:00:00Z'),exam=Date.parse('2026-12-19T00:00:00Z');const week=Math.min(10,Math.max(0,Math.floor((d-start)/604800000)+1)),left=Math.ceil((exam-d)/86400000);return `<section class="paper prep"><div class="row"><div><small>${left<0?'备考计划已结束':week===0?'备考计划尚未开始':'把学过的，慢慢写出来'}</small><div>第 ${week} 周 <small>/ 10 周</small></div></div><div><strong>${left>0?left:left===0?'今天':'已结束'}</strong>${left>0?' <small>天后考试</small>':''}</div></div><div class="track"><i style="width:${week*10}%"></i></div></section>`}
function renderCalendar(){let [y,m]=month.split('-').map(Number),n=new Date(y,m,0).getDate(),offset=(new Date(y,m-1,1).getDay()+6)%7;let cells=[...'一二三四五六日'].map(x=>`<span class="weekday">${x}</span>`).join('')+'<span></span>'.repeat(offset);for(let d=1;d<=n;d++){const key=`${month}-${String(d).padStart(2,'0')}`,has=!!data.records[key]||drafts.some(x=>x.date===key),plan=!!data.studySchedule[key];cells+=`<button class="day ${has?'has':''} ${plan?'planned':''} ${key===selected?'selected':''} ${key===today()?'today':''} ${key==='2026-12-19'?'exam':''}" data-date="${key}" aria-label="${key}${has?'，已有写作内容':''}${plan?'，计划：'+data.studySchedule[key].title:''}" ${key===selected?'aria-pressed="true"':'aria-pressed="false"'}>${d}${key==='2026-12-19'?'⭐':''}</button>`}
$('#app').innerHTML=`<div class="split"><div>${prep()}<section class="paper"><div class="row calendar-head"><strong>${y} 年 ${m} 月</strong><div><button id="prev" aria-label="上个月">‹</button><button id="next" aria-label="下个月">›</button></div></div><div class="grid">${cells}</div><div class="row legend" aria-label="日历状态图例"><span class="legend-item"><i class="legend-key completed">✓</i>已有写作内容</span><span class="legend-item"><i class="legend-key planned">计</i>计划练习</span><span class="legend-item"><i class="legend-key selected">22</i>当前选中</span><button id="today" class="small-btn">回到今天</button></div></section><button class="primary wide" id="newToday">＋ 写一篇</button><p class="status-note">${lastSync?'云端内容已下载 · '+esc(lastSync):'显示离线内容'}<br>草稿保存在本机</p></div><div id="dayContent"><div class="section-label">${esc(selected)} · 当天记录</div>${dayCards(selected)}<div class="section-label">最近的写作便签</div>${Object.keys(data.records).filter(k=>k!==selected).sort().reverse().slice(0,6).map(k=>recordCard(k)).join('')}</div></div>`;
$('#prev').onclick=()=>moveMonth(-1);$('#next').onclick=()=>moveMonth(1);$('#today').onclick=()=>{selected=today();month=selected.slice(0,7);render()};$('#newToday').onclick=()=>newDraft();document.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{selected=b.dataset.date;render();if(matchMedia("(max-width:699px)").matches)$("#dayContent").scrollIntoView({block:"start"})});bindCards()}
function moveMonth(delta){const [y,m]=month.split('-').map(Number),d=new Date(y,m-1+delta,1);month=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;render()}
function recordCard(k){const r=data.records[k];return `<button class="note ${k.endsWith('15')?'sage':''}" data-record="${k}"><span class="badge">${esc(k.slice(5))} · 已归档</span><strong>${esc(r.title)}</strong><div class="note-footer">${r.grammar?.length||0} 个语法点${r.studyNotes?' · 含模板笔记':''} <span style="float:right">阅读 →</span></div></button>`}
function dayCards(k){const plan=data.studySchedule[k],ds=drafts.filter(d=>d.date===k);return (plan?`<div class="paper plan"><span class="hint">${esc(plan.tag)}</span><h3>${esc(plan.title)}</h3><p>${esc(plan.detail)}</p></div>`:'')+(data.records[k]?recordCard(k):'')+ds.map(d=>`<button class="note" data-draft="${esc(d.id)}"><span class="badge">本机草稿 · 第 ${d.version} 版</span><strong>${esc(d.title||'未命名练习')}</strong><span class="hint">${wordCount(d.text)} 词 · 继续写 →</span></button>`).join('')+(!plan&&!data.records[k]&&!ds.length?'<div class="paper empty">这一天还留着一页空白。<br><button class="quiet" id="newSelected">开始写作</button></div>':'')}
function bindCards(){document.querySelectorAll('[data-record]').forEach(b=>b.onclick=()=>{detail=b.dataset.record;tab=0;render();window.scrollTo(0,0)});document.querySelectorAll('[data-draft]').forEach(b=>b.onclick=()=>{currentDraft=b.dataset.draft;nav('write')});if($('#newSelected'))$('#newSelected').onclick=()=>newDraft(null,selected)}
function renderDetail(){const r=data.records[detail];if(!r){detail=null;render();return}$('#app').innerHTML=`<div class="detail-wrap"><button class="back" id="back">‹ ${grammarReturn?'返回语法统计':'返回日历'}</button><section class="paper"><span class="hint">${esc(detail)} · 写作档案</span><h2 class="detail-title">${esc(r.title)}</h2><p class="muted">${esc(r.type)}</p><div class="tabs" role="tablist">${['我的原文','批改记录','学习笔记'].map((t,i)=>`<button role="tab" aria-selected="${tab===i}" class="${tab===i?'active':''}" data-tab="${i}">${t}</button>`).join('')}</div><div id="detailBody"></div><button class="wide quiet" id="rewrite">＋ 用新纸再写一版</button></section></div>`;$('#back').onclick=grammarReturn?returnToGrammar:()=>nav('calendar');document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=+b.dataset.tab;renderDetail()});$('#rewrite').onclick=()=>newDraft(detail);let body=$('#detailBody');if(tab===0){body.innerHTML=r.original.map((p,i)=>`<div>${r.original.length>1?`<p class="hint">第 ${i+1} 段练习</p>`:''}<p class="prose">${esc(p)}</p></div>`).join('')}else if(tab===1){body.innerHTML='<p class="hint">原文保留不动，逐项查看已归档的错点。</p>'+r.grammar.map((g,i)=>grammarCard(detail,g,i,false)).join('')+`<details class="error"><summary>查看历史修改稿</summary><p class="hint">这是此前归档的修改稿，可能包含表达调整；后续默认只订正明确错误。</p><p class="prose">${esc(r.revised)}</p></details>`;bindFavourites()}else{body.innerHTML=studyNotes(r.studyNotes,detail);bindFavourites()}}
function studyNotes(notes,date){if(!notes)return '<div class="empty">当天没有模板笔记。<br>可在“批改记录”查看语法点。</div>';return `<p class="muted">${esc(notes.intro)}</p>`+notes.sections.map((s,si)=>`<h3 style="margin-top:24px">${esc(s.title)}</h3>`+s.items.map((item,i)=>{const id=`${date}:note:${si}:${i}`;return `<details class="error"><summary>${esc(item.name)}</summary><button class="fav" data-fav="${id}" aria-label="收藏此句" aria-pressed="${favourites.includes(id)}">${favourites.includes(id)?'★':'☆'}</button>${item.template?`<p class="pair">${esc(item.template)}</p>`:''}${item.example?`<p class="pair after">${esc(item.example)}</p>`:''}${item.note?`<p class="hint">${esc(item.note)}</p>`:''}</details>`}).join('')).join('')}
function grammarCard(date,g,i,quiz){const id=`${date}:grammar:${i}`;return `<div class="error"><button class="fav" data-fav="${id}" aria-label="收藏此错点" aria-pressed="${favourites.includes(id)}">${favourites.includes(id)?'★':'☆'}</button><p class="hint error-meta">${esc(date)} · ${esc(JournalGrammar.label(date,g,i,'zh-CN'))}</p><h3>${esc(g[0])}</h3><p class="pair ${quiz?'':'before'}">${esc(g[1])}</p>${quiz?'<details open><summary>想好后，查看答案</summary>':''}<p class="pair after">${esc(g[2])}</p><p class="hint">${esc(g[3])}</p>${quiz?'</details>':''}<button class="small-btn" data-source="${date}">来自 ${esc(date)} ↗</button></div>`}
function bindFavourites(){document.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{const id=b.dataset.fav,next=favourites.includes(id)?favourites.filter(x=>x!==id):[...favourites,id];if(put('wj.favourites',next)){favourites=next;b.textContent=next.includes(id)?'★':'☆';b.setAttribute('aria-pressed',String(next.includes(id)))}});document.querySelectorAll('[data-source]').forEach(b=>b.onclick=()=>{detail=b.dataset.source;page='calendar';tab=1;render();window.scrollTo(0,0)})}
function wordCount(s){return (s.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)||[]).length}
function newDraft(source=null,date=today()){const parent=source||null,version=1+drafts.filter(d=>d.source===parent&&d.date===date).length;const d={id:crypto.randomUUID(),date,title:source?data.records[source].title:'',prompt:'',text:'',source:parent,version,updated:new Date().toISOString()};const next=[...drafts,d];if(!put('wj.drafts',next))return;drafts=next;currentDraft=d.id;nav('write')}
function renderWrite(){if(!currentDraft&&drafts.length)currentDraft=drafts[drafts.length-1].id;const d=drafts.find(x=>x.id===currentDraft);if(!d){$('#app').innerHTML='<div class="write-wrap"><section class="paper empty"><h2>从一句话开始</h2><p>先写出来，再回头检查。<br>草稿自动保存在这台设备。</p><button class="primary" id="start">开始今天的写作</button></section></div>';$('#start').onclick=()=>newDraft();return}$('#app').innerHTML=`<div class="write-wrap"><div class="row"><h2>一页练习</h2><button class="quiet" id="draftList">草稿 ${drafts.length}</button></div><section class="paper"><div class="row"><span class="hint">${esc(d.date)}</span><span class="version">第 ${d.version} 版</span></div><input id="draftTitle" aria-label="作文标题" placeholder="给这次练习起个名字" value="${esc(d.title)}"><details><summary class="hint">题目 / 写作要求</summary><textarea id="prompt" rows="3" aria-label="题目">${esc(d.prompt)}</textarea></details><div class="row editor-tools"><span id="wordCount">${wordCount(d.text)} 词</span><button id="timer">${timerStarted?'暂停计时':'开始计时'} · <span id="clock">${clock()}</span></button></div><textarea id="essay" aria-label="英文作文" placeholder="Dear …" spellcheck="false" autocapitalize="sentences">${esc(d.text)}</textarea><div class="row editor-tools"><span id="saveStatus" class="saved">已保存到本机</span><span>尚未上传云端</span></div><div class="row"><button class="quiet" id="copyDraft">复制全文</button><button class="primary" id="another">再写一版</button></div></section><p class="hint">退出、切换页面会保留草稿。云端写入尚未连接，可先复制到聊天中批改。</p></div>`;$('#draftTitle').oninput=saveDraft;$('#prompt').oninput=saveDraft;$('#essay').oninput=saveDraft;$('#copyDraft').onclick=()=>copy(d.text);$('#another').onclick=()=>{const next={...d,id:crypto.randomUUID(),version:Math.max(...drafts.filter(x=>x.title===d.title).map(x=>x.version),d.version)+1,text:'',updated:new Date().toISOString()};if(put('wj.drafts',[...drafts,next])){drafts.push(next);currentDraft=next.id;renderWrite()}};$('#draftList').onclick=draftList;$('#timer').onclick=()=>{if(timerStarted){timerSeconds+=Math.floor((Date.now()-timerStarted)/1000);timerStarted=null}else timerStarted=Date.now();renderWrite()}}
function saveDraft(){const d=drafts.find(x=>x.id===currentDraft);if(!d)return;d.title=$('#draftTitle').value;d.prompt=$('#prompt').value;d.text=$('#essay').value;d.updated=new Date().toISOString();const ok=put('wj.drafts',drafts);$('#saveStatus').textContent=ok?'已保存到本机':'保存失败，请复制全文';$('#wordCount').textContent=wordCount(d.text)+' 词'}
function clock(){const s=timerSeconds+(timerStarted?Math.floor((Date.now()-timerStarted)/1000):0);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
setInterval(()=>{if($('#clock'))$('#clock').textContent=clock()},1000);
function draftList(){sheet('<h2>我的草稿</h2>'+drafts.slice().reverse().map(d=>`<button class="note" data-open-draft="${esc(d.id)}"><span class="hint">${esc(d.date)} · 第 ${d.version} 版</span><strong>${esc(d.title||'未命名练习')}</strong><span class="hint">${wordCount(d.text)} 词 · 本机保存</span></button>`).join('')+'<button class="primary wide" id="newBlank">＋ 新练习</button>');document.querySelectorAll('[data-open-draft]').forEach(b=>b.onclick=()=>{currentDraft=b.dataset.openDraft;$('#sheet').close();renderWrite()});$('#newBlank').onclick=()=>{$('#sheet').close();newDraft()}}
function renderReview(){
  const labels=['错误统计','语法错点','模板笔记','我的收藏'];
  const tabs=labels.map((label,i)=>
    `<button class="${reviewTab===i?'active':''}" aria-pressed="${reviewTab===i}" data-review="${i}">${label}</button>`
  ).join('');
  $('#app').innerHTML=`<div class="review-wrap"><div class="tabs review-tabs">${tabs}</div>
    <input class="search" id="search" aria-label="搜索复习内容" placeholder="搜索句子或语法点…" value="${esc(query)}">
    <section id="reviewContent"></section></div>`;
  document.querySelectorAll('[data-review]').forEach(button=>button.onclick=()=>{
    reviewTab=Number(button.dataset.review);
    render();
  });
  $('#search').oninput=()=>{
    query=$('#search').value;
    renderReviewContent();
  };
  renderReviewContent();
}

function openGrammarEntry({date}, link){
  grammarReturn={scroll:window.scrollY, entry:link.dataset.grammarEntry};
  detail=date;
  tab=0;
  render();
  window.scrollTo(0,0);
  $('#back').focus({preventScroll:true});
}

function returnToGrammar(){
  const previous=grammarReturn;
  grammarReturn=null;
  detail=null;
  render();
  window.scrollTo(0,previous.scroll);
  document.querySelector('[data-grammar-entry="'+previous.entry+'"]')?.focus({preventScroll:true});
}

function renderReviewContent(){
  if(reviewTab===0){
    JournalGrammar.render($('#reviewContent'),data.records,{
      locale:'zh-CN', query, openPoint:grammarOpenPoint, translate:text=>text,
      onPoint:id=>{grammarOpenPoint=id;}, openEntry:openGrammarEntry
    });
    return;
  }
  const q=query.trim().toLowerCase();
  const favMode=reviewTab===3, showGrammar=reviewTab===1||favMode, showNotes=reviewTab===2||favMode;
  let html='';
  for(const [date,r] of Object.entries(data.records).sort((a,b)=>b[0].localeCompare(a[0]))){
    if(showGrammar)(r.grammar||[]).forEach((g,i)=>{
      const id=date+':grammar:'+i;
      const label=JournalGrammar.label(date,g,i,'zh-CN');
      if((favMode&&!favourites.includes(id))||(q&&![label,...g].join(' ').toLowerCase().includes(q)))return;
      html+=grammarCard(date,g,i,true);
    });
    if(showNotes&&r.studyNotes)r.studyNotes.sections.forEach((section,si)=>section.items.forEach((item,i)=>{
      const id=date+':note:'+si+':'+i;
      if((favMode&&!favourites.includes(id))||(q&&!JSON.stringify(item).toLowerCase().includes(q)))return;
      html+=`<details class="error"><summary>${esc(item.name)}</summary>
        <button class="fav" data-fav="${id}" aria-label="收藏此句" aria-pressed="${favourites.includes(id)}">${favourites.includes(id)?'★':'☆'}</button>
        <p class="pair">${esc(item.template||'')}</p><p class="pair after">${esc(item.example||'')}</p>
        <p class="hint">${esc(item.note||'')}</p><button class="small-btn" data-source="${date}">来自 ${date} ↗</button></details>`;
    }));
  }
  $('#reviewContent').innerHTML=html||'<div class="paper empty">这里还没有匹配的内容。<br>可以尝试更换搜索词。</div>';
  bindFavourites();
}
function settings(){sheet(`<h2>阅读与同步</h2><div class="settings-row"><div class="row"><strong>英文字号</strong><span>${font}px</span></div><input id="fontSize" type="range" min="16" max="26" value="${font}" aria-label="英文字号"></div><div class="settings-row"><strong>云端内容</strong><p>已有作文和笔记免登录下载。本机草稿、收藏尚未上传。</p><button class="quiet" id="refreshData">刷新云端内容</button></div><div class="settings-row"><strong>草稿备份</strong><p>导出所有草稿及收藏；可在另一台设备导入。相同编号但内容不同的草稿会另存副本。</p><button class="quiet" id="exportData">导出备份</button> <button class="quiet" id="importData">导入备份</button><input type="file" id="fileInput" accept="application/json,.json" hidden></div><div class="settings-row"><strong>应用 ${APP_VERSION}</strong><p id="updateStatus">内容自动下载；界面更新在下次启动应用时生效。</p><button class="quiet" id="checkUpdate">检查应用更新</button></div>`);$('#fontSize').oninput=e=>{font=+e.target.value;put('wj.font',font);document.documentElement.style.setProperty('--font',font+'px');e.target.previousElementSibling.lastElementChild.textContent=font+'px'};$('#refreshData').onclick=()=>refreshData(true);$('#exportData').onclick=exportData;$('#importData').onclick=()=>$('#fileInput').click();$('#fileInput').onchange=importData;$('#checkUpdate').onclick=()=>{if(window.JournalNative){$('#updateStatus').textContent='正在检查更新…';window.JournalNative.checkUpdate()}else location.reload()}}
function copy(s){if(window.JournalNative){window.JournalNative.copyText(s);toast('已复制');return}navigator.clipboard.writeText(s).then(()=>toast('已复制')).catch(()=>{sheet('<h2>复制内容</h2><textarea rows="10" id="copyText">'+esc(s)+'</textarea>');$('#copyText').select();toast('请长按选中并复制')})}
function exportData(){const s=JSON.stringify({schema:1,exported:new Date().toISOString(),drafts,favourites},null,2);if(window.JournalNative){window.JournalNative.exportBackup(s);return}const url=URL.createObjectURL(new Blob([s],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='writing-backup-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000)}
async function importData(e){const f=e.target.files[0];if(!f)return;try{if(f.size>10*1024*1024)throw Error();const v=JSON.parse(await f.text());if(v.schema!==1||!Array.isArray(v.drafts)||!Array.isArray(v.favourites)||v.drafts.length>10000)throw Error();const next=[...drafts];for(const d of v.drafts){if(!d||typeof d.id!=='string'||typeof d.text!=='string'||typeof d.title!=='string'||typeof d.prompt!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||!Number.isInteger(d.version)||d.version<1)throw Error();const old=next.find(x=>x.id===d.id);if(!old)next.push(d);else if(JSON.stringify(old)!==JSON.stringify(d))next.push({...d,id:crypto.randomUUID(),title:d.title+'（导入副本）'})}const fav=[...new Set([...favourites,...v.favourites.filter(x=>typeof x==='string')])];if(!put('wj.drafts',next))return;drafts=next;if(put('wj.favourites',fav))favourites=fav;$('#sheet').close();render();toast('备份已导入，原有草稿保留')}catch{toast('文件格式不正确，未导入')}}
function validData(v){return v&&v.records&&v.studySchedule&&Object.values(v.records).every(r=>typeof r.title==='string'&&Array.isArray(r.original)&&r.original.every(x=>typeof x==='string')&&Array.isArray(r.grammar)&&r.grammar.every(g=>Array.isArray(g)&&g.length===4&&g.every(x=>typeof x==='string')))}
async function getJSON(url){const c=new AbortController(),t=setTimeout(()=>c.abort(),12000);try{const r=await fetch(url,{cache:'no-store',signal:c.signal});if(!r.ok)throw Error();return await r.json()}finally{clearTimeout(t)}}
async function refreshData(manual=false){if(refreshing)return;refreshing=true;try{const v=await getJSON(window.JournalNative?RAW+'data.json?t='+Date.now():'data.json');if(!validData(v))throw Error();const changed=JSON.stringify(v)!==JSON.stringify(data);if(changed)put('wj.cloud',v);data=v;lastSync=new Date().toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});put('wj.lastSync',lastSync);if(page==='calendar'||(page!=='write'&&changed))render();if(manual)toast('云端内容已更新；本机草稿保持不变')}catch{if(manual)toast('暂时连不上云端，已保留本机内容')}finally{refreshing=false}}
window.onNativeUpdate=s=>{if($('#updateStatus'))$('#updateStatus').textContent=s;toast(s)};
window.addEventListener('online',()=>refreshData());
window.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshData();if(page==='calendar'&&!detail)render()}});
(async()=>{const cached=read('wj.cloud',null);if(validData(cached))data=cached;else{try{const v=await getJSON('data.json');if(validData(v))data=v}catch{toast('离线内容暂不可用，请刷新重试')}}render();refreshData()})();
