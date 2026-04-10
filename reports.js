// reports.js v3 — Professional edition
const sleep = ms => new Promise(r => setTimeout(r, ms));

function rpType(name, btn) {
  ['incident','compliance','executive'].forEach(n => {
    const el = document.getElementById(n+'Pane'); if(el) el.classList.add('hidden');
  });
  document.querySelectorAll('#rpTypeTabs .pill-tab').forEach(b => b.classList.remove('active'));
  const t = document.getElementById(name+'Pane'); if(t) t.classList.remove('hidden');
  if(btn) btn.classList.add('active');
}

async function genReport() {
  const builder = document.getElementById('builderCard');
  const prog = document.getElementById('progressCard');
  const prev = document.getElementById('previewCard');
  builder.classList.add('hidden'); prog.classList.remove('hidden'); prev.classList.add('hidden');

  const steps = ['Gathering incident data…','Compiling credential records…','Fetching threat intelligence…','Applying compliance frameworks…','Building remediation steps…','Formatting report document…','Finalizing…'];
  for (let i = 0; i < steps.length; i++) {
    document.getElementById('progLabel').textContent = steps[i];
    const p = Math.round(((i+1)/steps.length)*100);
    document.getElementById('progFill').style.width = p + '%';
    document.getElementById('progPct').textContent = p + '%';
    await sleep(440 + Math.random() * 250);
  }
  await sleep(300);
  prog.classList.add('hidden'); builder.classList.remove('hidden'); prev.classList.remove('hidden');
  renderReport();
  prev.scrollIntoView({ behavior:'smooth' });
}

function renderReport() {
  const org = document.getElementById('rpOrg')?.value || 'example.com';
  const period = document.getElementById('rpPeriod')?.value || 'Last 30 days';
  const now = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  document.getElementById('reportContent').innerHTML = `
    <h2>DarkSentinel Security Incident Report</h2>
    <p style="font-size:0.72rem;font-family:var(--mono);color:var(--tx-3);margin-bottom:1.25rem">Org: ${org} &nbsp;|&nbsp; Period: ${period} &nbsp;|&nbsp; Generated: ${now} &nbsp;|&nbsp; Classification: CONFIDENTIAL &nbsp;|&nbsp; Ref: DS-2024-0115-001</p>
    <h2>1. Executive Summary</h2>
    <p>During the reporting period, DarkSentinel detected <strong>7 significant credential exposure incidents</strong> for <code style="font-family:var(--mono);font-size:0.78rem;background:var(--bg-overlay);padding:0.1rem 0.3rem;border-radius:3px">${org}</code>. The most critical involved a BreachForums dump containing <strong>1,284 accounts</strong> in plaintext. All critical alerts were actioned within 30 minutes. 142 incidents resolved this period.</p>
    <h2>2. Breach Summary</h2>
    <table><thead><tr><th>Date</th><th>Source</th><th>Type</th><th>Affected</th><th>Severity</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>2024-01-15</td><td>BreachForums</td><td>Credential Dump</td><td>1,284</td><td><span class="badge badge-critical">Critical</span></td><td>Investigating</td></tr>
      <tr><td>2024-01-03</td><td>Pastebin</td><td>Combo List</td><td>47</td><td><span class="badge badge-critical">Critical</span></td><td>Resolved</td></tr>
      <tr><td>2023-11-14</td><td>DeHashed</td><td>Customer PII</td><td>1,200</td><td><span class="badge badge-high">High</span></td><td>In Progress</td></tr>
      <tr><td>2023-08-22</td><td>GitHub</td><td>API Keys</td><td>2 keys</td><td><span class="badge badge-high">High</span></td><td>Resolved</td></tr>
    </tbody></table>
    <h2>3. Remediation Actions</h2>
    <table><thead><tr><th>#</th><th>Action</th><th>Priority</th><th>Timeline</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Force password reset for 1,284 exposed accounts</td><td><span class="badge badge-critical">Critical</span></td><td>Immediately</td></tr>
      <tr><td>2</td><td>Enforce MFA across all accounts (current: 64%)</td><td><span class="badge badge-critical">Critical</span></td><td>Within 24h</td></tr>
      <tr><td>3</td><td>Rotate all AWS IAM keys created before Q1 2024</td><td><span class="badge badge-high">High</span></td><td>Within 24h</td></tr>
      <tr><td>4</td><td>File GDPR Article 33 notification</td><td><span class="badge badge-high">High</span></td><td>Within 72h</td></tr>
    </tbody></table>
    <h2>4. Compliance Notes</h2>
    <p><strong>GDPR:</strong> Personal data breach affecting EU residents requires Article 33 notification within 72h. Auto-generated form is ready to submit.</p>
    <p><strong>SOC 2:</strong> Incident logged in security register. Evidence package available for audit. Response procedures followed per IRP v2.3.</p>`;
}

function downloadReport() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['DarkSentinel Incident Report\nGenerated: ' + new Date()], { type:'text/plain' }));
  a.download = 'darksentinel-report.txt'; a.click();
}

// Playbooks
const playbooks = [
  { icon:'🔐', name:'Credential Breach Response', trigger:'Credential dump detected on any source',
    steps:[{t:'Alert security team via Slack & PagerDuty',a:true},{t:'Enumerate all affected accounts',a:true},{t:'Force password reset for affected users',a:true},{t:'Terminate suspicious active sessions',a:false},{t:'Notify affected users via email',a:false},{t:'Create audit trail in ticketing system',a:true}] },
  { icon:'🔑', name:'API Key Revocation', trigger:'Active API key exposed in code or paste site',
    steps:[{t:'Identify service the key belongs to',a:true},{t:'Check API audit logs for suspicious usage',a:true},{t:'Revoke the exposed key immediately',a:true},{t:'Deploy replacement key to production',a:false},{t:'Scan all repos for similar patterns',a:true}] },
  { icon:'🌑', name:'Dark Web Sale Detection', trigger:'Org data offered for sale on dark forums',
    steps:[{t:'Archive sale listing as evidence',a:true},{t:'Determine data freshness and exfil date',a:false},{t:'Notify Legal & CISO for privilege review',a:true},{t:'Begin forensic investigation',a:false}] },
  { icon:'🎣', name:'Phishing Campaign Response', trigger:'Active phishing kit targeting org detected',
    steps:[{t:'Document phishing domain and hosting',a:true},{t:'Submit abuse report to registrar',a:true},{t:'Block domain at email gateway',a:true},{t:'Alert all employees',a:false}] },
];

function renderPlaybooks() {
  document.getElementById('playbooksList').innerHTML = playbooks.map((pb, i) => `
    <div class="pb-row">
      <div class="pb-header" onclick="togglePb(${i})">
        <div class="pb-icon">${pb.icon}</div>
        <div class="pb-info"><div class="pb-name">${pb.name}</div><div class="pb-trigger">${pb.trigger}</div></div>
        <svg class="pb-chevron" id="pbc-${i}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="pb-steps" id="pbs-${i}">
        ${pb.steps.map((s, si) => `<div class="pb-step"><span class="step-n">${si+1}</span><span style="flex:1">${s.t}</span>${s.a?`<span class="step-auto">Auto</span>`:''}</div>`).join('')}
        <div style="display:flex;gap:0.375rem;margin-top:0.75rem"><button class="btn-micro-primary">Execute Playbook</button><button class="btn-micro">Edit</button></div>
      </div>
    </div>`).join('');
}

function togglePb(i) {
  const steps = document.getElementById('pbs-' + i);
  const chev  = document.getElementById('pbc-' + i);
  steps.classList.toggle('open'); chev.classList.toggle('open');
}

// AutoRemediate
const aaItems = [
  { icon:'🔄', label:'Force reset for exposed accounts', on:true },
  { icon:'🔑', label:'Revoke exposed API keys', on:true },
  { icon:'💬', label:'Post alert to #security Slack', on:true },
  { icon:'📧', label:'Email affected users', on:false },
  { icon:'🎫', label:'Create Jira ticket per incident', on:false },
];
function renderAA() {
  document.getElementById('aaList').innerHTML = aaItems.map((a, i) => `
    <div class="aa-item">
      <div class="aa-ico">${a.icon}</div>
      <span class="aa-lbl">${a.label}</span>
      <span class="${a.on?'aa-on':'aa-off'}" id="ast-${i}">${a.on?'ON':'OFF'}</span>
      <label class="toggle"><input type="checkbox" ${a.on?'checked':''} onchange="toggleAA(${i},this)"/><div class="toggle-track"></div></label>
    </div>`).join('');
}
function toggleAA(i, input) {
  aaItems[i].on = input.checked;
  const s = document.getElementById('ast-' + i);
  s.className = input.checked ? 'aa-on' : 'aa-off';
  s.textContent = input.checked ? 'ON' : 'OFF';
}
async function runAR(btn) {
  btn.disabled = true;
  for (const a of aaItems.filter(a => a.on)) { btn.textContent = a.label; await sleep(600); }
  btn.textContent = '✓ Complete';
  btn.style.background = 'var(--emerald)'; btn.style.border = 'none';
  setTimeout(() => { btn.textContent = 'Run Now'; btn.style.background = ''; btn.disabled = false; }, 2500);
}

// Notifications
const notifs = [
  { ch:'💬', txt:'Critical alert posted to #security Slack', t:'2m ago' },
  { ch:'📧', txt:'Alert email sent to ciso@example.com', t:'18m ago' },
  { ch:'🔔', txt:'PagerDuty incident INC-14392 created', t:'1h ago' },
  { ch:'📧', txt:'Daily digest sent to security team', t:'8h ago' },
];
function renderNotifs() {
  document.getElementById('notifList').innerHTML = notifs.map(n => `
    <div class="notif-row">
      <div class="notif-ico">${n.ch}</div>
      <div><div class="notif-txt">${n.txt}</div><div class="notif-time">${n.t}</div></div>
    </div>`).join('');
}

function startCountdown() {
  let h=23, m=47, s=33;
  const ch=document.getElementById('cdH'), cm=document.getElementById('cdM'), cs=document.getElementById('cdS');
  if (!cs) return;
  setInterval(() => {
    s--; if(s<0){s=59;m--;} if(m<0){m=59;h--;} if(h<0){h=m=s=0;}
    ch.textContent=String(h).padStart(2,'0');
    cm.textContent=String(m).padStart(2,'0');
    cs.textContent=String(s).padStart(2,'0');
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderPlaybooks(); renderAA(); renderNotifs(); startCountdown();
});
