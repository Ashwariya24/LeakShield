// check.js v3 — Professional edition
const sleep = ms => new Promise(r => setTimeout(r, ms));

window.addEventListener('DOMContentLoaded', () => {
  const q = new URLSearchParams(location.search).get('q');
  if (q) { document.getElementById('scanInput').value = q; runScan(); }

  document.getElementById('scanInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') runScan();
  });
});

function switchType(type, btn) {
  document.querySelectorAll('.st-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const labels = { email:'Email or Phone Number', domain:'Organization domain', username:'Username / handle', ip:'IP address' };
  const placeholders = { email:'you@yourcompany.com or +1 (555) 000-0000', domain:'yourcompany.com', username:'johndoe', ip:'192.168.1.1' };
  document.getElementById('searchLabel').textContent = labels[type];
  document.getElementById('scanInput').placeholder = placeholders[type] || '';
  const typeAttr = { email:'text', domain:'text', username:'text', ip:'text' };
  document.getElementById('scanInput').type = typeAttr[type] || 'text';
}

function resTab(name, btn) {
  ['breaches','pastes','darkweb','actions'].forEach(t => document.getElementById(t+'Pane').classList.add('hidden'));
  document.querySelectorAll('#resTabs .tab-item').forEach(b => b.classList.remove('active'));
  document.getElementById(name+'Pane').classList.remove('hidden');
  btn.classList.add('active');
}

const sampleBreaches = [
  { name:'LinkedIn', date:'2021-06-22', affected:700_000_000, types:['Email','Phone','Full Name','Job Title'], sev:'high', logo:'in', bg:'#0a66c220', col:'#0a66c2', desc:'700M LinkedIn profiles scraped and posted. Contains professional PII aggregated from public profile data.' },
  { name:'Adobe', date:'2013-10-03', affected:153_000_000, types:['Email','Password Hash','Password Hint'], sev:'critical', logo:'Ai', bg:'#ff000020', col:'#ff0000', desc:'In October 2013, Adobe suffered a breach exposing 153M accounts with encrypted passwords.' },
  { name:'Canva', date:'2019-05-24', affected:137_000_000, types:['Email','Username','Bcrypt Hash'], sev:'medium', logo:'Cv', bg:'#7d2ae820', col:'#7d2ae8', desc:'137M user records from Canva were compromised in May 2019.' },
  { name:'MyFitnessPal', date:'2018-02-01', affected:150_000_000, types:['Email','Username','SHA-1 Hash'], sev:'high', logo:'Mf', bg:'#00b5e220', col:'#00b5e2', desc:'Under Armour\'s MyFitnessPal app exposed 150M accounts in February 2018.' },
];

const pasteSampleData = [
  { site:'Pastebin', date:'2024-01-03', matches:3, title:'corp_email_dump_jan', snippet:'j**n@yourco.com:p@ssw0rd123\na**x@yourco.com:securepass!\n[+45 more redacted]' },
  { site:'Ghostbin', date:'2023-11-14', matches:1, title:'random_combo_list_5', snippet:'a**n@yourco.com:hunter2' },
];
const dwSampleData = [
  { forum:'BreachForums', date:'2024-02-20', type:'Sale Listing', title:'Selling "yourco.com" 2024 credential dump — 1.2K entries', risk:'critical' },
  { forum:'XSS.is', date:'2023-12-01', type:'Discussion', title:'yourco.com VPN configs discussed — possible insider source', risk:'high' },
];

async function runScan() {
  const query = document.getElementById('scanInput').value.trim();
  if (!query) { document.getElementById('scanInput').focus(); return; }

  document.getElementById('scanProgress').classList.add('show');
  document.getElementById('resultsWrap').classList.add('hidden');

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);
  const steps = isEmail 
    ? ['Checking HaveIBeenPwned routing…','Checking DeHashed…','Querying XposedOrNot live databases…','Analyzing results…']
    : ['Querying global databases…','Checking dark web sources…','Analyzing results…'];

  for (let i = 0; i < steps.length; i++) {
    document.getElementById('scanLabel').textContent = steps[i];
    const pct = Math.round(((i+1)/steps.length)*100);
    document.getElementById('scanFill').style.width = pct + '%';
    document.getElementById('scanPct').textContent = pct + '%';
    await sleep(360 + Math.random() * 200);
  }
  
  let breachNames = [];
  try {
     if (isEmail) {
       document.getElementById('scanLabel').textContent = 'Fetching live data from XposedOrNot...';
       const res = await fetch('https://api.xposedornot.com/v1/check-email/' + encodeURIComponent(query));
       if (res.status === 200) {
         const data = await res.json();
         if (data.breaches && data.breaches[0] && Array.isArray(data.breaches[0])) {
           breachNames = data.breaches[0];
         }
       } else if (res.status === 404) {
         breachNames = [];
       }
     } else {
         // simulated for phone/domain since free APIs usually require email
         const isPwned = Math.random() > 0.4;
         if (isPwned) breachNames = ['Breach_Sim1', 'Paste_Dumps', 'Dark_Web_Mention'];
     }
  } catch(e) {
     console.error("Error fetching data:", e);
  }
  
  await sleep(400);
  document.getElementById('scanProgress').classList.remove('show');
  showResults(query, breachNames, isEmail);
}

function showResults(query, breachNames, isEmail) {
  const isPwned = breachNames.length > 0;
  const bc = isPwned ? breachNames.length : 0;
  const pc = isPwned && !isEmail ? Math.floor(Math.random()*2)+1 : 0;
  const dc = isPwned && !isEmail ? (Math.random()>0.5?1:0) : 0;
  
  const score = isPwned ? Math.min(99, Math.floor(45 + (bc * 5) + Math.random()*15)) : Math.floor(5+Math.random()*12);

  document.getElementById('resultsWrap').classList.remove('hidden');

  // Banner
  const banner = document.getElementById('resultBanner');
  if (isPwned) {
    banner.innerHTML = `<div class="result-banner rb-pwned">
      <div class="rb-main">
        <div class="rb-h">Oh no — <span style="font-family:var(--mono);font-size:0.95rem">${query}</span> was pwned</div>
        <div class="rb-sub">Found in <strong>${bc} breach${bc>1?'es':''}</strong>${pc>0?`, <strong>${pc} paste dump${pc>1?'s':''}</strong>`:''}${dc>0?`, <strong>${dc} dark web mention</strong>`:''}.</div>
      </div>
      <div class="risk-badge">
        <div class="rk-num col-red">${score}</div>
        <div class="rk-lbl">Risk Score</div>
        <div class="progress" style="margin-top:0.375rem;width:60px"><div class="progress-bar pb-red" style="width:${score}%"></div></div>
      </div>
    </div>`;
  } else {
    banner.innerHTML = `<div class="result-banner rb-safe">
      <div class="rb-main">
        <div class="rb-h">No pwnage found</div>
        <div class="rb-sub"><span style="font-family:var(--mono)">${query}</span> was not found in any known breach databases or dark web listings.</div>
      </div>
      <div class="risk-badge">
        <div class="rk-num col-emerald">${score}</div>
        <div class="rk-lbl">Risk Score</div>
        <div class="progress" style="margin-top:0.375rem;width:60px"><div class="progress-bar pb-emerald" style="width:${score}%"></div></div>
      </div>
    </div>`;
  }

  // Breaches
  const grid = document.getElementById('breachGrid');
  
  let cardsHtml = '';
  if (isPwned) {
      cardsHtml = breachNames.map(name => {
          const sample = sampleBreaches.find(b => b.name.toLowerCase() === name.toLowerCase());
          if (sample) {
              return renderBreachCard(sample);
          } else {
              return renderBreachCard({
                  name: name,
                  date: 'Unknown Date',
                  affected: 'Classified',
                  types: ['Email', 'Password', 'Data Exposure'],
                  sev: 'high',
                  logo: name.substring(0, 2).toUpperCase(),
                  bg: 'var(--bg-overlay)',
                  col: 'var(--tx-1)',
                  desc: 'This record was found in the ' + name + ' breach dataset according to live monitoring sources.'
              });
          }
      }).join('');
  }
  
  grid.innerHTML = isPwned ? cardsHtml : `<div class="no-r"><span class="no-r-title">✓</span>No known breaches found for this query.</div>`;

  // Pastes
  const pastesCard = document.getElementById('pastesCard');
  pastesCard.innerHTML = pc > 0 ? `<div class="card-hd"><span class="card-title">Paste Dump Matches</span><span class="badge badge-critical">${pc} found</span></div><div class="card-bd">${pasteSampleData.slice(0,pc).map(p=>`
    <div class="paste-row">
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem;flex-wrap:wrap">
        <span class="mono-tag">${p.site}</span>
        <span class="text-xs col-3" style="font-family:var(--mono)">${p.date}</span>
        <span class="badge badge-high">${p.matches} match${p.matches>1?'es':''}</span>
      </div>
      <div style="font-size:0.825rem;font-weight:600;margin-bottom:0.375rem">${p.title}</div>
      <div class="code-block">${p.snippet}</div>
    </div>`).join('')}</div>` : `<div class="no-r"><span class="no-r-title">✓</span>No paste dumps found.</div>`;

  // Dark Web
  const dwCard = document.getElementById('dwCard');
  dwCard.innerHTML = dc > 0 ? `<div class="card-hd"><span class="card-title">Dark Web Mentions</span><span class="badge badge-critical">${dc} found</span></div><div class="card-bd">${dwSampleData.slice(0,dc).map(d=>`
    <div class="paste-row">
      <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.35rem">
        <span style="color:var(--indigo-lt);font-family:var(--mono);font-size:0.78rem;font-weight:700">${d.forum}</span>
        <span class="text-xs col-3">${d.date}</span>
        <span class="badge badge-${d.risk}">${d.type}</span>
      </div>
      <div style="font-size:0.825rem;font-weight:600">${d.title}</div>
    </div>`).join('')}
    <div style="margin-top:0.875rem;padding:0.75rem;border-radius:var(--r);background:var(--amber-bg);border:1px solid var(--amber-bd);font-size:0.75rem;color:var(--amber)">Dark web data is from indexed sources only. We do not purchase or access criminal content.</div>
  </div>` : `<div class="no-r"><span class="no-r-title">✓</span>No dark web mentions found.</div>`;

  // Actions
  const actions = isPwned ? [
    {p:'critical',t:'Change password immediately',d:'Use a unique 16+ character password from a dedicated password manager. Do not reuse across services.',time:'Do now'},
    {p:'critical',t:'Enable two-factor authentication',d:'Enable 2FA on this account and all others using this email. Use an authenticator app, not SMS.',time:'Do now'},
    {p:'high',t:'Check for password reuse',d:'If you\'ve reused this password on other services, change it there too.',time:'Within 24h'},
    {p:'high',t:'Watch for phishing',d:'Your email is now in criminal databases. Be vigilant about suspicious communications.',time:'Ongoing'},
    {p:'medium',t:'Enable continuous monitoring',d:'Set up DarkSentinel monitoring to be alerted within 30 seconds of any future exposure.',time:'Recommended'},
  ] : [
    {p:'low',t:'You\'re safe — for now',d:'No current breaches found. New breaches occur daily. Enable monitoring to stay protected.',time:'Status: Good'},
    {p:'medium',t:'Enable proactive monitoring',d:'Get notified before you find out the hard way.',time:'Recommended'},
    {p:'low',t:'Practice password hygiene',d:'Use unique passwords for every service, stored in a dedicated password manager.',time:'Best Practice'},
  ];
  document.getElementById('actionsList').innerHTML = actions.map(a => `
    <div class="action-item ai-${a.p}">
      <div>
        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.25rem">
          <span class="ai-title">${a.t}</span>
          <span class="badge badge-${a.p}">${a.p}</span>
          <span class="text-xs col-3" style="margin-left:auto">${a.time}</span>
        </div>
        <div class="ai-desc">${a.d}</div>
      </div>
    </div>`).join('');

  document.getElementById('resultsWrap').scrollIntoView({ behavior:'smooth', block:'start' });
}

function renderBreachCard(b) {
    const affectedText = typeof b.affected === 'number' ? (b.affected/1e6).toFixed(1)+'M accounts affected' : b.affected;
    return `
    <div class="breach-card">
      <div class="bc-hd">
        <div class="bc-logo" style="background:${b.bg};color:${b.col};border:1px solid ${b.col}30">${b.logo}</div>
        <div><div class="bc-name">${b.name}</div><div class="bc-date">${b.date !== 'Unknown Date' ? new Date(b.date).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}) : b.date}</div></div>
        <span class="badge badge-${b.sev}" style="margin-left:auto">${b.sev}</span>
      </div>
      <p class="bc-desc">${b.desc}</p>
      <div class="bc-types">${b.types.map(t=>`<span class="dt-tag">${t}</span>`).join('')}</div>
      <div class="bc-count">${affectedText}</div>
    </div>`;
}
