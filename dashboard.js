// dashboard.js v3 — Professional edition

function sp(name,btn) {
  document.querySelectorAll('.d-panel').forEach(p=>{p.classList.remove('show');});
  document.querySelectorAll('.sb-link').forEach(b=>b.classList.remove('active'));
  const p=document.getElementById(name+'Panel');
  if(p){p.classList.add('show');}
  if(btn){btn.classList.add('active');}
}

function animNum(id,target){
  const el=document.getElementById(id);if(!el)return;
  const dur=1500;const st=performance.now();
  const tick=now=>{
    const t=Math.min((now-st)/dur,1);const e=1-Math.pow(1-t,3);
    el.textContent=Math.floor(target*e).toLocaleString();
    if(t<1)requestAnimationFrame(tick);else el.textContent=target.toLocaleString();
  };requestAnimationFrame(tick);
}

const alerts=[
  {id:1,sev:'critical',title:'Credential dump on BreachForums',src:'BreachForums',type:'Credential',time:'2m ago',st:'open',desc:'1,284 email/password pairs for example.com posted for sale. Plaintext credentials — immediate action required.'},
  {id:2,sev:'critical',title:'Pastebin dump — 47 employee accounts',src:'Pastebin',type:'Credential',time:'18m ago',st:'open',desc:'Corporate email addresses with plaintext passwords. Likely phishing origin.'},
  {id:3,sev:'high',title:'AWS Access Key in GitHub fork',src:'GitHub',type:'API Key',time:'1h ago',st:'investigating',desc:'Active AWS_ACCESS_KEY_ID found in public fork of example/backend-config. Not yet revoked.'},
  {id:4,sev:'high',title:'Dark web chatter targeting example.com',src:'RaidForums',type:'Mention',time:'3h ago',st:'investigating',desc:'example.com discussed in cybercrime channel — potential targeted attack incoming 48–72h window.'},
  {id:5,sev:'medium',title:'Internal subnet exposed in paste',src:'Ghostbin',type:'PII',time:'5h ago',st:'open',desc:'Internal IP ranges and subdomain structure posted publicly — active reconnaissance indicator.'},
  {id:6,sev:'medium',title:'Employee accounts in LinkedIn 2021 scrape',src:'HIBP',type:'PII',time:'2d ago',st:'investigating',desc:'18 employee profiles in 700M LinkedIn scrape. Password reuse risk.'},
  {id:7,sev:'low',title:'Expired API key in paste',src:'Pastebin',type:'API Key',time:'4d ago',st:'resolved',desc:'Old Stripe test key. Already rotated. Logged for compliance.'},
];
const creds=[
  {email:'j.smith@example.com',src:'BreachForums',pw:'Plaintext',date:'2024-01-15',sev:'critical'},
  {email:'a.jones@example.com',src:'Pastebin',pw:'Plaintext',date:'2024-01-14',sev:'critical'},
  {email:'m.chen@example.com',src:'LinkedIn 2021',pw:'SHA-1',date:'2021-06-22',sev:'high'},
  {email:'s.patel@example.com',src:'MyFitnessPal',pw:'SHA-1',date:'2018-02-01',sev:'high'},
  {email:'r.davis@example.com',src:'Adobe 2013',pw:'MD5',date:'2013-10-03',sev:'medium'},
  {email:'l.wilson@example.com',src:'Canva 2019',pw:'Bcrypt',date:'2019-05-24',sev:'medium'},
  {email:'k.taylor@example.com',src:'Pastebin',pw:'Plaintext',date:'2024-01-10',sev:'critical'},
];
const pastes=[
  {site:'Pastebin',id:'aB3xK9',time:'2m ago',sev:'critical',title:'corp_creds_jan2024.txt',snippet:'j.smith@example.com:P@ssw0rd2024!\na.jones@example.com:Welcome123\n[+44 more redacted]',matches:47},
  {site:'Ghostbin',id:'XY7k2p',time:'1h ago',sev:'high',title:'internal_ips_recon',snippet:'api.example.com → 10.0.1.45\nmail.example.com → 10.0.1.12',matches:3},
  {site:'Hastebin',id:'q9Fh2w',time:'6h ago',sev:'medium',title:'employee_directory_partial',snippet:'Peter Brown, p.brown@example.com\nLaura Wilson, l.wilson@example.com',matches:2},
];
const ghItems=[
  {repo:'example-corp/backend-api',file:'config/secrets.yml',time:'1h ago',type:'AWS Credentials',sev:'critical',code:'AWS_ACCESS_KEY_ID: AKIA5X3MNOCREDENTIAL1\nAWS_SECRET_ACCESS_KEY: wJalrXUtn/7MDENGbPxRfiCY...'},
  {repo:'johndev/example-fork',file:'.env.production',time:'4h ago',type:'Stripe API Key',sev:'high',code:'STRIPE_SECRET_KEY=sk_live_51KzABC...'},
  {repo:'intern_dev/learning-proj',file:'README.md',time:'2d ago',type:'GitHub Token',sev:'medium',code:'ghp_fakeGitHubTokenExample...'},
];
const integrations=[
  {icon:'💬',name:'Slack',on:true},{icon:'📧',name:'Email',on:true},
  {icon:'🔥',name:'PagerDuty',on:false},{icon:'📊',name:'Splunk',on:false},
  {icon:'🛡️',name:'MS Sentinel',on:false},{icon:'⚡',name:'Zapier',on:true},
  {icon:'🐙',name:'GitHub',on:false},{icon:'🎫',name:'Jira',on:false},
];
const team=[
  {av:'AR',name:'Alex Rodriguez',email:'a.rodriguez@example.com',role:'Admin'},
  {av:'PS',name:'Priya Sharma',email:'p.sharma@example.com',role:'Analyst'},
  {av:'MC',name:'Marcus Chen',email:'m.chen@example.com',role:'Analyst'},
  {av:'SW',name:'Sophie Williams',email:'s.williams@example.com',role:'Viewer'},
];

function renderOverview(){
  animNum('m1',7);animNum('m2',1284);animNum('m3',23);animNum('m4',142);

  // Bar chart
  const vals=[3,7,2,11,4,8,6,14,5,9,3,17,8,12];
  const days=['D','D','D','D','D','D','D','D','D','D','D','D','D','D'];
  const mx=Math.max(...vals);
  const colors=vals.map(v=>v>=10?'var(--red)':v>=6?'var(--amber)':'var(--indigo)');
  document.getElementById('barChart').innerHTML=vals.map((v,i)=>
    `<div class="bc-bar" style="height:${Math.max((v/mx)*100,4)}%;background:${colors[i]}" title="${v} detections"></div>`).join('');
  document.getElementById('barLabels').innerHTML=days.map((_,i)=>
    `<div class="bc-lbl">${i+1}</div>`).join('');

  // Source breakdown
  const srcs=[['Breach DBs',42,'var(--red)'],['Paste Sites',28,'var(--amber)'],['Dark Web',18,'var(--indigo-lt)'],['GitHub',8,'var(--sky)'],['Telegram',4,'#eab308']];
  document.getElementById('srcBreakdown').innerHTML=srcs.map(s=>`
    <div class="src-r">
      <span class="src-name">${s[0]}</span>
      <div class="src-bar"><div class="src-fill" style="width:0%;background:${s[2]}" data-w="${s[1]}"></div></div>
      <span class="src-pct">${s[1]}%</span>
    </div>`).join('');
  setTimeout(()=>document.querySelectorAll('.src-fill').forEach(f=>f.style.width=f.dataset.w+'%'),120);

  // Alerts table
  const stMap={open:'<span class="badge badge-red">Open</span>',investigating:'<span class="badge badge-amber">Investigating</span>',resolved:'<span class="badge badge-emerald">Resolved</span>'};
  document.getElementById('ovAlerts').innerHTML=alerts.slice(0,6).map(a=>`
    <tr>
      <td><span class="badge badge-${a.sev}">${a.sev}</span></td>
      <td class="font-mono text-xs col-2">${a.src}</td>
      <td class="text-sm">${a.title}</td>
      <td class="text-xs col-3">${a.type}</td>
      <td class="font-mono text-xs col-3">${a.time}</td>
      <td>${stMap[a.st]||a.st}</td>
    </tr>`).join('');
}

function renderAlerts(){
  document.getElementById('alertsList').innerHTML=alerts.map(a=>`
    <div class="card" style="margin-bottom:0.75rem">
      <div class="alert-row ar-${a.sev}" id="ar-${a.id}">
        <div class="alert-main">
          <div class="alert-title">${a.title}</div>
          <div class="alert-desc">${a.desc}</div>
          <div class="alert-meta">
            <span class="badge badge-${a.sev}">${a.sev}</span>
            <span class="mono-tag">${a.src}</span>
            <span class="text-xs col-3" style="font-family:var(--mono)">${a.time}</span>
          </div>
        </div>
        <div class="alert-actions">
          <button class="btn-micro-primary" onclick="resolveAlert(${a.id})">Resolve</button>
          <button class="btn-micro">Details</button>
          <button class="btn-micro">Ticket</button>
        </div>
      </div>
    </div>`).join('');
}
function resolveAlert(id){
  const el=document.getElementById('ar-'+id);
  if(el){el.style.opacity='0.4';el.style.pointerEvents='none';}
}
function resolveAll(){
  document.querySelectorAll('[id^="ar-"]').forEach(el=>{el.style.opacity='0.4';el.style.pointerEvents='none';});
}

let allCreds=[...creds];
function renderCreds(){
  document.getElementById('credTbody').innerHTML=allCreds.map(c=>`
    <tr>
      <td class="font-mono text-xs">${c.email}</td>
      <td class="text-sm col-2">${c.src}</td>
      <td><span class="badge badge-${c.pw==='Plaintext'?'critical':c.pw.includes('MD5')?'high':'medium'}">${c.pw}</span></td>
      <td class="font-mono text-xs col-3">${c.date}</td>
      <td><span class="badge badge-${c.sev}">${c.sev}</span></td>
      <td style="display:flex;gap:0.3rem;"><button class="btn-micro-primary">Force Reset</button><button class="btn-micro">Details</button></td>
    </tr>`).join('');
}
function filterCreds(q){
  const f=q.toLowerCase();
  document.querySelectorAll('#credTbody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(f)?'':'none');
}
function exportCSV(){
  const rows=['Email,Source,Password Type,Date,Severity',...creds.map(c=>`${c.email},${c.src},${c.pw},${c.date},${c.sev}`)].join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows],{type:'text/csv'}));a.download='creds.csv';a.click();
}

function renderPastes(){
  document.getElementById('pasteList').innerHTML=pastes.map(p=>`
    <div class="list-row">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;flex-wrap:wrap">
          <span class="mono-tag">${p.site}</span>
          <span class="badge badge-${p.sev}">${p.sev}</span>
          <span style="font-family:var(--mono);font-size:0.7rem;color:var(--tx-3)">${p.id}</span>
          <span class="text-xs col-3" style="margin-left:auto">${p.time}</span>
        </div>
        <div style="font-size:0.825rem;font-weight:600;margin-bottom:0.5rem;">${p.title}</div>
        <div class="code-block">${p.snippet}</div>
        <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.625rem">
          <span class="badge badge-${p.sev}">${p.matches} matches</span>
          <button class="btn-micro-primary" style="margin-left:auto">View</button>
          <button class="btn-micro">Add to Incident</button>
        </div>
      </div>
    </div>`).join('');
}

function renderGitHub(){
  document.getElementById('ghList').innerHTML=ghItems.map(g=>`
    <div class="list-row">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;flex-wrap:wrap">
          <span style="font-family:var(--mono);font-size:0.78rem;color:var(--indigo-lt)">${g.repo}</span>
          <span style="font-family:var(--mono);font-size:0.7rem;color:var(--tx-3)">${g.file}</span>
          <span class="badge badge-${g.sev}">${g.type}</span>
          <span class="text-xs col-3" style="margin-left:auto">${g.time}</span>
        </div>
        <div class="code-block">${g.code}</div>
        <div style="display:flex;gap:0.375rem;margin-top:0.625rem">
          <button class="btn-micro-primary">Revoke Key</button>
          <button class="btn-micro">Notify Owner</button>
          <button class="btn-micro">View on GitHub ↗</button>
        </div>
      </div>
    </div>`).join('');
}

function renderIntegrations(){
  document.getElementById('intGrid').innerHTML=integrations.map((i,idx)=>`
    <div class="int-card">
      <div class="int-ico">${i.icon}</div>
      <div class="int-name">${i.name}</div>
      <div class="int-status ${i.on?'int-on':'int-off'}" id="ist-${idx}">${i.on?'Connected':'Disconnected'}</div>
      <button class="btn-connect ${i.on?'on':''}" id="ibtn-${idx}" onclick="toggleInt(${idx})">${i.on?'Disconnect':'Connect'}</button>
    </div>`).join('');
}
function toggleInt(idx){
  integrations[idx].on=!integrations[idx].on;
  const on=integrations[idx].on;
  document.getElementById('ist-'+idx).className=`int-status ${on?'int-on':'int-off'}`;
  document.getElementById('ist-'+idx).textContent=on?'Connected':'Disconnected';
  document.getElementById('ibtn-'+idx).className=`btn-connect ${on?'on':''}`;
  document.getElementById('ibtn-'+idx).textContent=on?'Disconnect':'Connect';
}

function renderTeam(){
  document.getElementById('teamList').innerHTML=team.map(m=>`
    <div class="team-row">
      <div class="team-av">${m.av}</div>
      <div><div class="team-name">${m.name}</div><div class="team-email">${m.email}</div></div>
      <div class="team-role">${m.role}</div>
    </div>`).join('');
}

function rescan(btn){
  btn.disabled=true;btn.textContent='Scanning…';
  setTimeout(()=>{btn.innerHTML=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Rescan`;btn.disabled=false;},2500);
}

document.addEventListener('DOMContentLoaded',()=>{
  renderOverview();renderAlerts();renderCreds();
  renderPastes();renderGitHub();renderIntegrations();renderTeam();
});
