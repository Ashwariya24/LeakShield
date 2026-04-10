// threat-intel.js v3 — Professional edition

function tiTab(name, btn) {
  ['feed','timeline','darkweb','ioc','heatmap'].forEach(t => document.getElementById(t+'Pane').classList.add('hidden'));
  document.querySelectorAll('#tiTabs .tab-item').forEach(b => b.classList.remove('active'));
  document.getElementById(name+'Pane').classList.remove('hidden');
  if (btn) btn.classList.add('active');
  if (name === 'timeline') renderTimeline();
  if (name === 'darkweb')  renderDarkWeb();
  if (name === 'ioc')      renderIOC();
  if (name === 'heatmap')  renderHeatmap();
}

const feedData = [
  {sev:'critical',type:'credential',src:'BreachForums',txt:'Fresh combo list — 450K email:pass pairs posted for sale, corporate domains present',t:'1m ago'},
  {sev:'critical',type:'credential',src:'Pastebin',txt:'example.com dump — 47 accounts with plaintext passwords, likely phishing origin',t:'18m ago'},
  {sev:'high',type:'api',src:'GitHub',txt:'AWS credentials exposed in public repository fork — key is confirmed active',t:'1h ago'},
  {sev:'high',type:'darkweb',src:'RaidForums Mirror',txt:'Targeted attack discussion on example.com mail server infrastructure',t:'3h ago'},
  {sev:'high',type:'credential',src:'HIBP – LinkedIn',txt:'18 employee accounts found in LinkedIn 2021 700M scrape',t:'5h ago'},
  {sev:'medium',type:'pii',src:'DataBreach.io',txt:'Employee PII in HR data breach — 340 records exposed',t:'8h ago'},
  {sev:'medium',type:'darkweb',src:'Telegram (Monitored)',txt:'Phishing template targeting example.com being distributed',t:'12h ago'},
  {sev:'low',type:'api',src:'Hastebin',txt:'Expired Stripe test key found — already rotated per logs',t:'1d ago'},
];
const ledMap={critical:'led-red',high:'led-amber',medium:'led-yellow',low:'led-emerald'};
let gItems=[...feedData], curFilter='all';

function ff(type, btn) {
  document.querySelectorAll('#feedFilters button').forEach(b => { b.className = 'btn-micro'; });
  btn.className = 'btn-micro-primary';
  curFilter = type;
  gItems = type === 'all' ? [...feedData] : feedData.filter(i => i.type === type);
  renderFeed();
}

function renderFeed() {
  document.getElementById('gFeed').innerHTML = gItems.map(i => `
    <div class="feed-row">
      <div class="feed-led ${ledMap[i.sev]}"></div>
      <div class="feed-body">
        <div class="feed-title">${i.txt}</div>
        <div class="feed-meta"><span class="feed-src">${i.src}</span><span class="badge badge-${i.sev}">${i.sev}</span><span class="text-xs col-3">${i.type}</span></div>
      </div>
      <div class="feed-ts">${i.t}</div>
    </div>`).join('');
}

const tlData = [
  {d:'2024-01-15',t:'critical',title:'BreachForums Credential Dump',desc:'1,284 example.com credentials posted for sale including manager-level accounts with plaintext passwords.',tags:['Credential','Plaintext','Active']},
  {d:'2024-01-03',t:'critical',title:'Pastebin Combo — 47 Accounts',desc:'Employee email/password pairs found public. Likely phishing origin.',tags:['Credential','Pastebin']},
  {d:'2023-12-01',t:'high',title:'Internal IP / Subdomain Recon Data',desc:'Internal subnet information posted to Ghostbin — active recon indicator.',tags:['Infrastructure','Recon']},
  {d:'2023-11-14',t:'high',title:'Customer PII Exposure — 1.2K records',desc:'Customer records leaked via unsecured storage bucket.',tags:['PII','Customer']},
  {d:'2023-08-22',t:'high',title:'GitHub API Key Exposure',desc:'Stripe and SendGrid API keys committed to public fork by contractor.',tags:['API Key','GitHub']},
  {d:'2021-06-22',t:'medium',title:'LinkedIn 2021 Scrape',desc:'18 employee profiles in the 700M LinkedIn scrape.',tags:['PII','Scrape']},
];
function renderTimeline() {
  const el = document.getElementById('tlWrap'); if (!el || el.dataset.done) return; el.dataset.done = 1;
  el.innerHTML = tlData.map(i => `
    <div class="tl-item">
      <div class="tl-dot tl-${i.t}"></div>
      <div class="tl-date">${i.d}</div>
      <div class="tl-title">${i.title}</div>
      <div class="tl-desc">${i.desc}</div>
      <div style="display:flex;gap:0.25rem;flex-wrap:wrap">${i.tags.map(t=>`<span class="badge badge-neutral" style="font-size:0.62rem">${t}</span>`).join('')}<span class="badge badge-${i.t}" style="margin-left:auto">${i.t}</span></div>
    </div>`).join('');
}

const dwData = [
  {forum:'BreachForums',time:'2 days ago',sev:'critical',title:'SELLING: example.com credential database — 1,284 entries',body:'Verified seller offering credential dump. Manager-level accounts included. Price: 0.08 BTC.',actor:'ThreatActor_x0r',conf:'High'},
  {forum:'XSS.is',time:'5 days ago',sev:'high',title:'Recon results for example.com — VPN & mail infrastructure',body:'Thread with Shodan scan results and open port enumeration matching org\'s fingerprint.',actor:'ph4nt0m_net',conf:'Medium'},
  {forum:'Exploit.in',time:'1 week ago',sev:'high',title:'Request: insider access to example.com',body:'Soliciting insider help with crypto payment. 23 replies — active interest from threat actors.',actor:'[Redacted]',conf:'Medium'},
  {forum:'Telegram (Private)',time:'12 hours ago',sev:'critical',title:'Phishing kit targeting example.com employees',body:'Ready-to-deploy phishing kit mimicking VPN login page. 2,400-member criminal channel.',actor:'TA-0147',conf:'High'},
  {forum:'Dread (Tor)',time:'3 weeks ago',sev:'medium',title:'Security posture analysis thread',body:'"Vulnerable to spear phishing due to weak MFA adoption across the organization."',actor:'Anonymous',conf:'Low'},
  {forum:'RaidForums Mirror',time:'1 month ago',sev:'medium',title:'2021 combo archive recirculating',body:'Old combo list with corporate credentials — may still be valid if passwords unchanged.',actor:'bot-redistributor',conf:'Low'},
];
const confCol = {High:'var(--red)', Medium:'var(--amber)', Low:'var(--tx-3)'};
function renderDarkWeb() {
  const el = document.getElementById('dwGrid'); if (!el || el.dataset.done) return; el.dataset.done = 1;
  el.innerHTML = dwData.map(d => `
    <div class="dw-card">
      <div style="display:flex;align-items:center;gap:0.375rem;margin-bottom:0.25rem">
        <span class="dw-forum">${d.forum}</span>
        <span class="badge badge-${d.sev}" style="margin-left:auto">${d.sev}</span>
      </div>
      <div class="dw-title">${d.title}</div>
      <div class="dw-body">${d.body}</div>
      <div class="dw-foot">
        <span>Actor: <strong>${d.actor}</strong></span>
        <span style="margin-left:auto">Confidence: <strong style="color:${confCol[d.conf]}">${d.conf}</strong></span>
        <span>${d.time}</span>
      </div>
    </div>`).join('');
}

const iocData = [
  {type:'Email',val:'phishing@example-corp.cc',ctx:'Phishing sender',src:'Threat Feed',dt:'2024-01-14',st:'active'},
  {type:'URL',val:'https://vpn-login.example-corp.cc',ctx:'Credential harvesting page',src:'Urlscan.io',dt:'2024-01-13',st:'active'},
  {type:'IP',val:'185.220.101.47',ctx:'C2 infrastructure',src:'AbuseIPDB',dt:'2024-01-12',st:'blocked'},
  {type:'Hash',val:'a1b2c3d4e5f6789012345678',ctx:'Malicious dropper',src:'VirusTotal',dt:'2024-01-10',st:'active'},
  {type:'Domain',val:'example-corp.cc',ctx:'Typosquatting domain',src:'PassiveDNS',dt:'2024-01-08',st:'monitoring'},
  {type:'IP',val:'94.102.49.21',ctx:'Scanning infrastructure',src:'Shodan',dt:'2024-01-05',st:'blocked'},
];
const stMap = {active:'<span class="badge badge-red">Active</span>',blocked:'<span class="badge badge-emerald">Blocked</span>',monitoring:'<span class="badge badge-amber">Monitoring</span>'};
function renderIOC() {
  const b = document.getElementById('iocBody'); if (!b || b.dataset.done) return; b.dataset.done = 1;
  b.innerHTML = iocData.map(i => `
    <tr>
      <td><span class="mono-tag">${i.type}</span></td>
      <td><div class="ioc-val" title="${i.val}">${i.val}</div></td>
      <td class="text-sm col-2">${i.ctx}</td>
      <td class="text-xs col-3">${i.src}</td>
      <td class="font-mono text-xs col-3">${i.dt}</td>
      <td>${stMap[i.st] || i.st}</td>
    </tr>`).join('');
}

const hmCats = ['Email','VPN','GitHub','API','HR Data','Customers','Cloud'];
const hmDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
function hmColor(v) {
  if (!v) return 'rgba(255,255,255,0.03)';
  if (v < 2) return 'rgba(16,185,129,0.35)';
  if (v < 5) return 'rgba(245,158,11,0.5)';
  if (v < 8) return 'rgba(251,146,60,0.65)';
  return 'rgba(239,68,68,0.8)';
}
function renderHeatmap() {
  const el = document.getElementById('hmWrap'); if (!el || el.dataset.done) return; el.dataset.done = 1;
  const data = hmCats.map(() => hmDays.map(() => Math.random() < 0.25 ? 0 : Math.floor(Math.random() * 10)));
  let h = `<table class="hm-table"><thead><tr><th></th>${hmDays.map(d=>`<th class="hm-hd">${d}</th>`).join('')}</tr></thead><tbody>`;
  hmCats.forEach((cat, ci) => {
    h += `<tr><td class="hm-rl">${cat}</td>`;
    hmDays.forEach((_, di) => {
      const v = data[ci][di];
      h += `<td style="padding:2px"><div class="hm-cell" style="background:${hmColor(v)}" title="${cat} · ${hmDays[di]}: ${v} events"></div></td>`;
    });
    h += `</tr>`;
  });
  el.innerHTML = h + `</tbody></table>`;
}

function renderScoreBreakdown() {
  const rows = [['Credential exposure',78,'var(--red)'],['Dark web presence',65,'var(--amber)'],['Paste site exposure',52,'#eab308'],['Code/secret leaks',40,'var(--indigo-lt)']];
  document.getElementById('scoreBreakdown').innerHTML = rows.map(r => `
    <div class="score-row">
      <span class="score-name">${r[0]}</span>
      <div class="progress" style="flex:1"><div class="progress-bar" style="width:${r[1]}%;background:${r[2]}"></div></div>
      <span class="score-num" style="color:${r[2]}">${r[1]}</span>
    </div>`).join('');
}

function renderIndustry() {
  const rows = [['Technology',92,'var(--red)'],['Finance',85,'var(--amber)'],['Healthcare',78,'#eab308'],['Retail',65,'var(--emerald)'],['Education',52,'var(--indigo-lt)']];
  document.getElementById('industryWrap').innerHTML = rows.map(r => `
    <div class="ind-row">
      <span class="ind-name">${r[0]}</span>
      <div class="progress" style="flex:1"><div class="progress-bar" style="width:0%;background:${r[2]}" data-w="${r[1]}"></div></div>
      <span class="ind-pct" style="color:${r[2]}">${r[1]}%</span>
    </div>`).join('');
  setTimeout(() => document.querySelectorAll('#industryWrap .progress-bar').forEach(f => f.style.width = f.dataset.w + '%'), 200);
}

const breaking = [
  {h:'VoidStar ransomware group targeting mid-size tech firms',t:'12m ago',c:'var(--red)'},
  {h:'15B-entry combo list circulating on dark forums',t:'1h ago',c:'var(--amber)'},
  {h:'CVE-2024-1234 actively exploited in VPN appliances',t:'3h ago',c:'var(--red)'},
  {h:'Corporate email phishing up 340% this week',t:'6h ago',c:'var(--amber)'},
  {h:'GitHub secret scanning blocked 12M leaks in Jan 2024',t:'1d ago',c:'var(--emerald)'},
];
function renderBreaking() {
  document.getElementById('breakingWrap').innerHTML = breaking.map(b => `
    <div class="break-row"><div class="break-txt" style="color:${b.c}">${b.h}</div><div class="break-time">${b.t}</div></div>`).join('');
}

const kws = [{t:'example.com',a:false},{t:'api.example.com',a:false},{t:'Example Corp',a:false},{t:'john.smith@',a:true}];
function renderKeywords() {
  document.getElementById('kwWrap').innerHTML = kws.map((k,i) => `
    <span class="kw-chip ${k.a?'kw-chip-alert':''}" style="cursor:default">${k.t}<span class="kw-rm" onclick="kws.splice(${i},1);renderKeywords()" title="Remove">×</span></span>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderFeed(); renderScoreBreakdown(); renderIndustry(); renderBreaking(); renderKeywords();
  setInterval(() => {
    const nx = {sev:'critical',type:'credential',src:'Pastebin',txt:'New paste detected — analyzing for domain matches…',t:'just now'};
    if (curFilter === 'all' || curFilter === nx.type) {
      gItems.unshift(nx);
      if (gItems.length > 15) gItems = gItems.slice(0, 15);
      renderFeed();
    }
  }, 12000);
});
