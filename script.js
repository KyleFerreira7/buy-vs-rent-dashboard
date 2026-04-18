/* ────────────────────────────────────────────

   NAVIGATION

──────────────────────────────────────────── */

const transition = document.getElementById('transition');

 

function launchDashboard() {

  transition.classList.add('entering');

  setTimeout(() => {

    document.getElementById('landing').style.display = 'none';

    document.getElementById('dashboard').style.display = 'block';

    calculate();

    transition.classList.remove('entering');

    transition.classList.add('leaving');

    setTimeout(() => transition.classList.remove('leaving'), 600);

  }, 400);

}

 

function goBack() {

  transition.classList.add('entering');

  setTimeout(() => {

    document.getElementById('dashboard').style.display = 'none';

    document.getElementById('landing').style.display = 'block';

    window.scrollTo(0,0);

    transition.classList.remove('entering');

    transition.classList.add('leaving');

    setTimeout(() => transition.classList.remove('leaving'), 600);

  }, 400);

}

 

/* ────────────────────────────────────────────

   CALCULATOR

──────────────────────────────────────────── */

const GRID_COLOR = 'rgba(155,163,196,0.12)';

const charts = {};

 

const baseOpts = {

  responsive: true, maintainAspectRatio: false,

  plugins: {

    legend: { display: false },

    tooltip: {

      backgroundColor: '#1A1D2E', titleColor: '#fff', bodyColor: 'rgba(255,255,255,0.75)',

      padding: 10, cornerRadius: 8,

      callbacks: { label: ctx => ' ' + fmtFull(ctx.raw) }

    }

  },

  scales: {

    x: { ticks: { color: '#9BA3C4', font: { size: 10, family: 'DM Sans' } }, grid: { color: GRID_COLOR } },

    y: { ticks: { color: '#9BA3C4', font: { size: 10, family: 'DM Sans' }, callback: v => fmt(v) }, grid: { color: GRID_COLOR } }

  }

};

 

function fmt(v) {

  if (Math.abs(v) >= 1e6) return 'R' + (v/1e6).toFixed(2) + 'm';

  if (Math.abs(v) >= 1e3) return 'R' + Math.round(v).toLocaleString('en-ZA');

  return 'R' + Math.round(v);

}

function fmtFull(v) { return 'R ' + Math.round(v).toLocaleString('en-ZA'); }

 

function mkChart(id, config) {

  if (charts[id]) charts[id].destroy();

  charts[id] = new Chart(document.getElementById(id).getContext('2d'), config);

}

 

function g(id) { return parseFloat(document.getElementById(id).value) || 0; }

 

function calcMonthlyBond(principal, annualRate, years) {

  const r = annualRate / 100 / 12, n = years * 12;

  if (r === 0) return principal / n;

  return principal * r * Math.pow(1+r,n) / (Math.pow(1+r,n) - 1);

}

 

function calculate() {

  const purchasePrice = g('purchasePrice');

  const deposit       = g('deposit');

  const interestRate  = g('interestRate');

  const loanTerm      = g('loanTerm');

  const onceCosts     = g('onceCosts');

  const appreciation  = g('appreciation') / 100;

  const annualCosts   = g('annualCosts');

  const agentComm     = g('agentComm') / 100;

  const monthlyRent   = g('monthlyRent');

  const rentIncrease  = g('rentIncrease') / 100;

  const marketReturn  = g('marketReturn') / 100;

  const horizon       = Math.min(Math.round(g('horizon')), 40);

 

  const loanAmount  = purchasePrice - deposit;

  const monthlyBond = calcMonthlyBond(loanAmount, interestRate, loanTerm);

  const r = interestRate / 100 / 12;

 

  // Renter's portfolio starts with the capital buyer sunk upfront

  let rentPortfolio = (deposit + onceCosts);

  let bondBal = loanAmount;

 

  const years=[],buyWealth=[],rentWealth=[],propValues=[],bondBals=[],buyMonths=[],rentMonths=[];

  let breakevenYear = null;

  let propValue = purchasePrice;

 

  for (let yr = 1; yr <= horizon; yr++) {

    for (let m = 0; m < 12; m++) {

      const interest = bondBal * r;

      const principal = Math.min(monthlyBond - interest, Math.max(0, bondBal));

      if (bondBal > 0) bondBal = Math.max(0, bondBal - principal);

 

      const mRent = monthlyRent * Math.pow(1 + rentIncrease, yr - 1);

      const buyerMonthlyCost = (bondBal > 0 ? monthlyBond : 0) + annualCosts / 12;

      const saving = buyerMonthlyCost - mRent;

      rentPortfolio += saving;

      rentPortfolio *= (1 + marketReturn / 12);

    }

 

    propValue *= (1 + appreciation);

 

    // Agent commission deducted from gross property value at the horizon year

    const netPropValue = yr === horizon

      ? propValue * (1 - agentComm)

      : propValue;

 

    const buyEquity = netPropValue - bondBal;

    const rentNet   = rentPortfolio;

 

    years.push('Yr ' + yr);

    buyWealth.push(Math.round(buyEquity));

    rentWealth.push(Math.round(rentNet));

    propValues.push(Math.round(propValue));

    bondBals.push(Math.round(bondBal));

    buyMonths.push(Math.round(monthlyBond + annualCosts / 12));

    rentMonths.push(Math.round(monthlyRent * Math.pow(1 + rentIncrease, yr - 1)));

 

    if (breakevenYear === null && buyEquity >= rentNet) breakevenYear = yr;

  }

 

  const finalBuy  = buyWealth[horizon - 1];

  const finalRent = rentWealth[horizon - 1];

  const delta     = finalBuy - finalRent;

  const buyWins   = delta >= 0;

 

  // ── Verdict ──

  const banner = document.getElementById('verdictBanner');

  banner.className = 'verdict-banner ' + (buyWins ? 'buy' : 'rent');

  document.getElementById('verdictIcon').textContent = buyWins ? '🏠' : '📈';

  document.getElementById('verdictTitle').textContent = buyWins

    ? 'Buying builds more wealth over ' + horizon + ' years'

    : 'Renting & investing builds more wealth over ' + horizon + ' years';

  document.getElementById('verdictSub').textContent = buyWins

    ? 'Property equity (net of agent commission) outpaces your invested portfolio at these inputs.'

    : 'Keeping capital in the market beats ownership here. Try a longer horizon or lower market return.';

  document.getElementById('verdictDelta').textContent = fmt(Math.abs(delta));

  document.getElementById('verdictDelta').style.color = buyWins ? 'var(--buy-color)' : 'var(--rent-color)';

  document.getElementById('horizonLabel').textContent = horizon;

 

  // ── KPIs ──

  document.getElementById('kpiRow').innerHTML = [

    { label:'Monthly Bond',         value: fmtFull(monthlyBond),                              sub: `on ${fmt(loanAmount)} loan`,           color:'#1A3FD6' },

    { label:'Buy Wealth Yr '+horizon, value: fmt(finalBuy),                                    sub: 'equity net of agent comm',             color:'#1A3FD6' },

    { label:'Rent Wealth Yr '+horizon,value: fmt(finalRent),                                   sub: 'invested portfolio',                   color:'#00A798' },

    { label:'Deposit',              value: ((deposit/purchasePrice)*100).toFixed(1)+'%',       sub: fmtFull(deposit),                       color:'#6062A9' },

    { label:'Property Yr '+horizon, value: fmt(propValues[horizon-1]),                         sub: `at ${g('appreciation')}% p.a.`,        color:'#118A5E' },

    { label:'Agent Comm',           value: fmt(propValues[horizon-1] * agentComm),             sub: `${g('agentComm')}% on final sale`,     color:'#D4A200' },

  ].map(k => `

    <div class="kpi-card">

      <div class="kpi-bar" style="background:${k.color}"></div>

      <div class="kpi-body">

        <div class="kpi-label">${k.label}</div>

        <div class="kpi-value" style="color:${k.color}">${k.value}</div>

        <div class="kpi-sub">${k.sub}</div>

      </div>

    </div>`).join('');

 

  // ── Breakeven ──

  if (breakevenYear) {

    document.getElementById('beTitle').textContent = 'Buying overtakes renting at year ' + breakevenYear;

    document.getElementById('beSub').textContent   = 'Before this point your invested portfolio leads. After it, property equity leads.';

    document.getElementById('beYear').innerHTML    = breakevenYear + '<span> yr</span>';

  } else {

    document.getElementById('beTitle').textContent = 'Buying does not overtake renting in this horizon';

    document.getElementById('beSub').textContent   = 'Try extending the horizon or adjusting appreciation / market return assumptions.';

    document.getElementById('beYear').innerHTML    = '—';

  }

 

  // ── Charts ──

  mkChart('chWealth', {

    type: 'line',

    data: {

      labels: years,

      datasets: [

        { label:'Buy', data: buyWealth, borderColor:'#1A3FD6', backgroundColor:'rgba(26,63,214,0.08)', fill:true, borderWidth:2.5, tension:0.4, pointRadius:0, pointHoverRadius:5 },

        { label:'Rent', data: rentWealth, borderColor:'#00A798', backgroundColor:'rgba(0,167,152,0.06)', fill:true, borderWidth:2.5, tension:0.4, pointRadius:0, pointHoverRadius:5 }

      ]

    },

    options: { ...baseOpts, interaction:{ mode:'index', intersect:false } }

  });

 

  mkChart('chMonthly', {

    type: 'line',

    data: {

      labels: years,

      datasets: [

        { label:'Buyer', data: buyMonths, borderColor:'#1A3FD6', backgroundColor:'transparent', borderWidth:2, tension:0.3, pointRadius:0 },

        { label:'Renter', data: rentMonths, borderColor:'#00A798', backgroundColor:'transparent', borderWidth:2, tension:0.3, pointRadius:0, borderDash:[5,3] }

      ]

    },

    options: { ...baseOpts }

  });

 

  mkChart('chEquity', {

    type: 'bar',

    data: {

      labels: years,

      datasets: [

        { label:'Net Equity', data: buyWealth, backgroundColor:'rgba(26,63,214,0.65)', borderRadius:2, borderSkipped:false },

        { label:'Bond Balance', data: bondBals, backgroundColor:'rgba(224,44,28,0.18)', borderRadius:2, borderSkipped:false }

      ]

    },

    options: { ...baseOpts, scales:{ x:{...baseOpts.scales.x, stacked:true}, y:{...baseOpts.scales.y, stacked:true} } }

  });

 

  // ── Table ──

  document.getElementById('tableBody').innerHTML = Array.from({length:horizon}, (_,i) => {

    const adv = buyWealth[i] - rentWealth[i];

    return `<tr>

      <td>${i+1}</td>

      <td>${fmtFull(propValues[i])}</td>

      <td>${fmtFull(bondBals[i])}</td>

      <td class="pos">${fmtFull(buyWealth[i])}</td>

      <td>${fmtFull(rentWealth[i])}</td>

      <td class="${adv>=0?'pos':'neg'}">${fmtFull(Math.abs(adv))} ${adv>=0?'▲ Buy':'▼ Rent'}</td>

    </tr>`;

  }).join('');

 

  toast('Calculated ✓');

}

 

function updateDepositPct() {

  const pp = parseFloat(document.getElementById('purchasePrice').value)||0;

  const dp = parseFloat(document.getElementById('deposit').value)||0;

  document.getElementById('depositPct').textContent = pp ? ((dp/pp*100).toFixed(1)+'% of purchase price') : '';

}

document.getElementById('purchasePrice').addEventListener('input', updateDepositPct);

document.getElementById('deposit').addEventListener('input', updateDepositPct);

 

function resetDefaults() {

  const d = {purchasePrice:3500000,deposit:700000,interestRate:11.75,loanTerm:20,onceCosts:120000,

    appreciation:5.5,annualCosts:48000,agentComm:5.5,monthlyRent:18000,rentIncrease:7,marketReturn:10,horizon:20};

  Object.entries(d).forEach(([k,v]) => document.getElementById(k).value = v);

  updateDepositPct();

  calculate();

}

 

function toast(msg, dur=3000) {

  const el = document.getElementById('toast');

  el.textContent = msg; el.classList.add('on');

  setTimeout(()=>el.classList.remove('on'), dur);

}

 

updateDepositPct();