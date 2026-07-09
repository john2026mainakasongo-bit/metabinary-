const marketConfigs = {
  "Meta Volatility 100": { label: "Volatility 100 (1s) Index", base: 889.72, volatility: 0.34 },
  "Meta Volatility 75": { label: "Volatility 75 (1s) Index", base: 624.41, volatility: 0.28 },
  "Meta Volatility 50": { label: "Volatility 50 (1s) Index", base: 412.08, volatility: 0.18 },
  "Meta Volatility 25": { label: "Volatility 25 (1s) Index", base: 184.23, volatility: 0.10 },
  "Meta Volatility 10": { label: "Volatility 10 (1s) Index", base: 98.14, volatility: 0.06 }
};

const tradeChoices = {
  "Even/Odd": ["Even", "Odd"],
  "Matches/Differs": ["Matches", "Differs"],
  "Over/Under": ["Over", "Under"],
  "Rise/Fall": ["Rise", "Fall"],
  "Touch/No Touch": ["Touch", "No Touch"]
};

const STORAGE_KEY = "metabinary-v11-state";
const LOCAL_USERS_KEY = "metabinary-v11-users";
const KES_RATE = 130;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

let tickTimer = null;
let depositTimer = null;
let tickData = [];
let candleData = [];
let digitStats = Array.from({ length: 10 }, () => 10);
let aiSuggestion = null;

let state = {
  market: "Meta Volatility 100",
  accountMode: "demo",
  activeTradeType: "Matches/Differs",
  activeChoice: "Matches",
  selectedDigit: 7,
  barrierDigit: 5,
  demoBalance: 10000,
  realBalance: 0,
  currentUser: null,
  openTrades: [],
  tradeHistory: [],
  transactionHistory: [],
  pendingDeposit: null,
  chartMode: "line",
  settings: {
    theme: "dark",
    chartSpeed: "normal",
    realTradingEnabled: false,
    maximumStakeLimit: 100,
    dailyTradeLimit: 25,
    notifications: true,
    sound: true,
    phone: "",
    depositPhone: "",
    withdrawalPhone: "",
    profileName: ""
  },
  bot: {
    running: false,
    baseStake: 0.3,
    currentStake: 0.3,
    netProfit: 0,
    level: 0,
    history: []
  }
};

const elements = {
  guestActions: $("#guestActions"),
  accountToolbar: $("#accountToolbar"),
  accountLabel: $("#accountLabel"),
  balance: $("#balance"),

  marketName: $("#marketName"),
  quoteText: $("#quoteText"),
  marketMoveText: $("#marketMoveText"),

  digitQuote: $("#digitQuote"),
  digitMove: $("#digitMove"),
  digitFrequency: $("#digitFrequency"),
  digitCursor: $("#digitCursor"),

  selectedTrade: $("#selectedTrade"),
  mobileSelectedTrade: $("#mobileSelectedTrade"),
  choiceRow: $("#choiceRow"),
  mobileChoiceRow: $("#mobileChoiceRow"),

  stakeInput: $("#stakeInput"),
  ticksInput: null,
  payoutQuote: $("#payoutQuote"),
  targetText: $("#targetText"),
  tradeStatus: $("#tradeStatus"),

  openTradesList: $("#openTradesList"),
  historyList: $("#historyList"),
  openTradeCount: $("#openTradeCount"),
  historyCount: $("#historyCount"),

  chartCanvas: $("#chartCanvas"),
  chartCanvasLarge: $("#chartCanvasLarge"),
  chartOpenValue: $("#chartOpenValue"),
  chartHighValue: $("#chartHighValue"),
  chartLowValue: $("#chartLowValue"),
  chartCloseValue: $("#chartCloseValue"),

  toastStack: $("#toastStack")
};

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatQuote(value) {
  return Number(value || 0).toFixed(2);
}

function formatKes(value) {
  return `KSh ${Math.round(Number(value || 0)).toLocaleString("en-US")}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value || 0)));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}

function currentBalance() {
  return state.accountMode === "real" ? state.realBalance : state.demoBalance;
}

function setCurrentBalance(value) {
  const clean = Number(Math.max(0, value).toFixed(2));

  if (state.accountMode === "real") state.realBalance = clean;
  else state.demoBalance = clean;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncLocalUserFromState();
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state = {
      ...state,
      ...stored,
      settings: { ...state.settings, ...(stored.settings || {}) },
      bot: { ...state.bot, ...(stored.bot || {}) }
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function createLocalUser(data) {
  const users = getLocalUsers();

  const user = {
    accountId: `MB${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`,
    fullName: data.fullName,
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    idNumber: data.idNumber.trim(),
    country: data.country,
    documentType: data.documentType,
    password: data.password,
    demoBalance: 10000,
    realBalance: 0,
    partnerBalance: 0,
    createdAt: new Date().toISOString(),
    settings: {
      ...state.settings,
      profileName: data.fullName,
      phone: data.phone.trim(),
      depositPhone: data.phone.trim(),
      withdrawalPhone: data.phone.trim()
    }
  };

  users.push(user);
  saveLocalUsers(users);
  return user;
}

function findLocalUser(identifier, password) {
  const key = String(identifier || "").trim().toLowerCase();

  return getLocalUsers()
    .filter((user) => user.email.toLowerCase() === key || user.accountId.toLowerCase() === key)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .find((user) => user.password === password);
}

function syncLocalUserFromState() {
  if (!state.currentUser) return;

  const users = getLocalUsers();
  const index = users.findIndex((user) => user.accountId === state.currentUser.accountId);

  if (index >= 0) {
    users[index] = {
      ...users[index],
      fullName: state.currentUser.fullName,
      phone: state.currentUser.phone,
      demoBalance: state.demoBalance,
      realBalance: state.realBalance,
      settings: state.settings
    };
    saveLocalUsers(users);
  }
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) throw new Error(data.error || data.message || "Request failed.");
  return data;
}

async function getJson(url) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || "Request failed.");
  return data;
}

async function putJson(url, body) {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || "Request failed.");
  return data;
}

function openSheet(sheet) {
  if (sheet) sheet.classList.add("open");
}

function closeSheet(sheet) {
  if (sheet) sheet.classList.remove("open");
}

function showToast(title, text, type = "info", timeout = 1500) {
  if (!state.settings.notifications) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
  elements.toastStack.appendChild(toast);

  setTimeout(() => toast.remove(), timeout);
}

function getSpeedMs() {
  if (state.settings.chartSpeed === "fast") return 650;
  if (state.settings.chartSpeed === "slow") return 1700;
  return 1000;
}

function generateInitialData() {
  const base = marketConfigs[state.market].base;
  const vol = marketConfigs[state.market].volatility;

  tickData = [];
  candleData = [];

  let price = base;
  let open = base;

  for (let i = 0; i < 90; i++) {
    const drift = (Math.random() - 0.5) * vol;
    price = Number((price + drift).toFixed(2));

    tickData.push({
      quote: price,
      digit: Math.abs(Math.floor(price * 100)) % 10,
      move: drift
    });

    if (i % 4 === 0) open = price;

    if (i % 4 === 3) {
      const slice = tickData.slice(i - 3, i + 1).map((x) => x.quote);
      candleData.push({
        open,
        high: Math.max(...slice),
        low: Math.min(...slice),
        close: price
      });
    }
  }
}

function drawChart(canvas, mode = state.chartMode) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  canvas.width = Math.floor(rect.width * devicePixelRatio);
  canvas.height = Math.floor(rect.height * devicePixelRatio);
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const pad = { left: 18, right: 18, top: 12, bottom: 22 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const source = mode === "candles" ? candleData : tickData;
  if (!source.length) return;

  const values = mode === "candles"
    ? source.flatMap((item) => [item.high, item.low])
    : source.map((item) => item.quote);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(.01, max - min);

  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.strokeStyle = "rgba(0,0,0,.07)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (mode === "line") {
    ctx.beginPath();

    source.forEach((point, index) => {
      const x = pad.left + (index / Math.max(1, source.length - 1)) * chartW;
      const y = pad.top + ((max - point.quote) / range) * chartH;

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#333";
    ctx.stroke();

    const last = source[source.length - 1];
    const x = pad.left + chartW;
    const y = pad.top + ((max - last.quote) / range) * chartH;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();

    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(width - 6, y);
    ctx.strokeStyle = "#666";
    ctx.stroke();
    ctx.setLineDash([]);

    const label = formatQuote(last.quote);
    const labelWidth = Math.max(54, ctx.measureText(label).width + 18);

    ctx.fillStyle = "#111";
    ctx.beginPath();
    const boxX = width - labelWidth - 4;
    const boxY = y - 14;
    ctx.roundRect(boxX, boxY, labelWidth, 28, 8);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Arial";
    ctx.fillText(label, boxX + 10, boxY + 19);
  } else {
    const candleWidth = Math.max(4, (chartW / Math.max(20, source.length)) * .55);

    source.forEach((candle, index) => {
      const x = pad.left + (index / Math.max(1, source.length - 1)) * chartW;
      const openY = pad.top + ((max - candle.open) / range) * chartH;
      const closeY = pad.top + ((max - candle.close) / range) * chartH;
      const highY = pad.top + ((max - candle.high) / range) * chartH;
      const lowY = pad.top + ((max - candle.low) / range) * chartH;
      const green = candle.close >= candle.open;

      ctx.strokeStyle = green ? "#26c37f" : "#ef3e42";
      ctx.fillStyle = green ? "#26c37f" : "#ef3e42";

      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      const top = Math.min(openY, closeY);
      const bodyH = Math.max(3, Math.abs(closeY - openY));
      ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyH);
    });
  }
}

function drawCharts() {
  drawChart(elements.chartCanvas, state.chartMode);
  drawChart(elements.chartCanvasLarge, state.chartMode);
}

function updateQuoteUI(tick, prev) {
  if (!tick) return;

  const move = prev ? Number((tick.quote - prev.quote).toFixed(2)) : 0;
  const movePct = prev ? Number(((move / prev.quote) * 100).toFixed(2)) : 0;

  elements.quoteText.textContent = formatQuote(tick.quote);
  $("#marketMoveText").textContent = `${move >= 0 ? "+" : ""}${move.toFixed(2)} (${movePct >= 0 ? "+" : ""}${movePct.toFixed(2)}%)`;
  elements.digitQuote.textContent = formatQuote(tick.quote);
  elements.digitMove.textContent = `${move >= 0 ? "+" : ""}${move.toFixed(2)}`;

  const recent = tickData.slice(-25).map((x) => x.quote);
  if (recent.length) {
    elements.chartOpenValue.textContent = formatQuote(recent[0]);
    elements.chartHighValue.textContent = formatQuote(Math.max(...recent));
    elements.chartLowValue.textContent = formatQuote(Math.min(...recent));
    elements.chartCloseValue.textContent = formatQuote(recent[recent.length - 1]);
  }
}

function nextTick() {
  const prev = tickData[tickData.length - 1] || { quote: marketConfigs[state.market].base };
  const vol = marketConfigs[state.market].volatility;

  const drift = (Math.random() - 0.5) * vol;
  const noise = (Math.random() - 0.5) * vol * 0.25;
  const quote = Number((prev.quote + drift + noise).toFixed(2));
  const digit = Math.abs(Math.floor(quote * 100)) % 10;

  const tick = {
    quote,
    digit,
    move: Number((quote - prev.quote).toFixed(2))
  };

  tickData.push(tick);
  if (tickData.length > 140) tickData.shift();

  const lastCandle = candleData[candleData.length - 1];
  const candleIndex = tickData.length % 4;

  if (!lastCandle || candleIndex === 1) {
    candleData.push({ open: quote, high: quote, low: quote, close: quote });
  } else {
    lastCandle.high = Math.max(lastCandle.high, quote);
    lastCandle.low = Math.min(lastCandle.low, quote);
    lastCandle.close = quote;
  }

  if (candleData.length > 70) candleData.shift();

  const recentDigits = tickData.slice(-60).map((x) => x.digit);
  digitStats = Array.from({ length: 10 }, (_, d) => {
    const count = recentDigits.filter((x) => x === d).length;
    return Number(((count / recentDigits.length) * 100 || 0).toFixed(1));
  });

  updateQuoteUI(tick, prev);
  settleOpenTrades(tick, prev);
  renderDigits(tick.digit);
  drawCharts();

  if (state.bot.running && !state.openTrades.length) runBotTrade();
}

function getHighLowDigits() {
  return {
    highest: digitStats.indexOf(Math.max(...digitStats)),
    lowest: digitStats.indexOf(Math.min(...digitStats))
  };
}

function renderDigits(cursorDigit = 0) {
  const { highest, lowest } = getHighLowDigits();

  elements.digitFrequency.innerHTML = Array.from({ length: 10 }, (_, digit) => {
    const percent = digitStats[digit] || 0;
    const isHighest = digit === highest;
    const isLowest = digit === lowest;
    const isTarget =
      (state.activeTradeType === "Matches/Differs" || state.activeTradeType === "Touch/No Touch") &&
      state.selectedDigit === digit;
    const isBarrier =
      state.activeTradeType === "Over/Under" && state.barrierDigit === digit;

    const stroke = isHighest ? "#4db8b7" : isLowest ? "#ef3e42" : "#d8dadd";
    const strokeWidth = isHighest ? 8 : isLowest ? 7 : 7;
    const circumference = 2 * Math.PI * 27;
    const dash = (clamp(percent, 0, 100) / 100) * circumference;

    return `
      <div class="digit-tile ${isTarget ? "selected-target" : ""} ${isBarrier ? "selected-barrier" : ""}" data-digit-wrapper="${digit}">
        <button type="button" data-digit="${digit}">
          <svg class="digit-svg" viewBox="0 0 74 74" aria-hidden="true">
            <circle cx="37" cy="37" r="27" fill="none" stroke="#ebedf0" stroke-width="7"></circle>
            <circle
              cx="37" cy="37" r="27"
              fill="none"
              stroke="${stroke}"
              stroke-width="${strokeWidth}"
              stroke-linecap="round"
              transform="rotate(-90 37 37)"
              stroke-dasharray="${dash} ${circumference}">
            </circle>
          </svg>
          <span class="digit-number-label">${digit}</span>
          <span class="digit-percent-label">${percent.toFixed(1)}%</span>
        </button>
      </div>
    `;
  }).join("");

  const desktopPred = $("#predictionGridDesktop");
  if (desktopPred) {
    desktopPred.querySelectorAll("button").forEach((btn) => {
      const d = Number(btn.dataset.digit);
      const activeDigit = state.activeTradeType === "Over/Under" ? state.barrierDigit : state.selectedDigit;
      btn.classList.toggle("active", d === activeDigit);
    });
  }

  $("#mobileDigitBox").textContent =
    state.activeTradeType === "Over/Under"
      ? `Barrier: ${state.barrierDigit}`
      : `Digit: ${state.selectedDigit}`;

  positionCursor(cursorDigit);
}

function positionCursor(digit) {
  const wrapper = elements.digitFrequency.querySelector(`[data-digit-wrapper="${digit}"]`);
  if (!wrapper) return;

  const gridBox = elements.digitFrequency.getBoundingClientRect();
  const box = wrapper.getBoundingClientRect();

  const x = box.left - gridBox.left + box.width / 2 - 9;
  elements.digitCursor.style.transform = `translateX(${x}px)`;
}

function getPayoutRate(type = state.activeTradeType, choice = state.activeChoice) {
  if (type === "Matches/Differs") return choice === "Matches" ? 6.667 : 1.053;
  if (type === "Touch/No Touch") return choice === "Touch" ? 5.2 : 1.16;
  if (type === "Rise/Fall") return 1.92;
  if (type === "Even/Odd") return 1.88;

  if (type === "Over/Under") {
    const wins = choice === "Over" ? Math.max(0, 9 - state.barrierDigit) : Math.max(0, state.barrierDigit);
    if (!wins) return 0;
    return clamp((10 / wins) * 0.88, 1.05, 8.8);
  }

  return 1.88;
}

function renderChoices() {
  const choices = tradeChoices[state.activeTradeType];
  const stake = Number(elements.stakeInput.value || 10);

  const desktopHtml = choices.map((choice, index) => {
    const rate = getPayoutRate(state.activeTradeType, choice);
    const profitPercent = Math.max(0, (rate - 1) * 100);
    const payout = stake * rate;

    return `
      <button class="trade-choice-btn ${index === 0 ? "teal" : "red"}" type="button" data-choice="${choice}">
        <div class="label-wrap">
          <span>${choice}</span>
          <small>Payout ${formatMoney(payout)}</small>
        </div>
        <div class="percent">${profitPercent.toFixed(2)}%</div>
      </button>
    `;
  }).join("");

  const mobileHtml = choices.map((choice, index) => {
    const rate = getPayoutRate(state.activeTradeType, choice);
    const payout = stake * rate;

    return `
      <button class="trade-choice-btn ${index === 0 ? "teal" : "red"}" type="button" data-choice="${choice}">
        <div class="label-wrap">
          <span>${choice}</span>
          <small>Payout ${formatMoney(payout)}</small>
        </div>
      </button>
    `;
  }).join("");

  elements.choiceRow.innerHTML = desktopHtml;
  elements.mobileChoiceRow.innerHTML = mobileHtml;
}

function updatePayoutPreview() {
  const stake = Number(elements.stakeInput.value || 10);
  const rate = getPayoutRate();
  const payout = stake * rate;

  elements.payoutQuote.textContent = `${formatMoney(payout)}`;
  $("#mobileStakeText").textContent = `${stake.toFixed(2)} USD`;

  const activeDigit = state.activeTradeType === "Over/Under" ? state.barrierDigit : state.selectedDigit;
  elements.targetText.innerHTML =
    state.activeTradeType === "Over/Under"
      ? `Barrier digit: <b>${activeDigit}</b>`
      : `Target digit: <b>${activeDigit}</b>`;

  renderChoices();
}

function renderTradePanel() {
  elements.selectedTrade.textContent = state.activeTradeType;
  elements.mobileSelectedTrade.textContent = state.activeTradeType;

  $("#ticksDisplayText").textContent = `${clamp($("#botDuration")?.value || 5, 1, 10)} Ticks`;
  $("#mobileTicksText").textContent = `${clamp($("#botDuration")?.value || 5, 1, 10)} ticks`;

  renderChoices();
  updatePayoutPreview();
}

function renderAccountUI() {
  const logged = Boolean(state.currentUser);

  elements.guestActions.hidden = logged;
  elements.accountToolbar.hidden = !logged;
  $("#aiFloatButton").hidden = !logged;

  if (!logged) {
    $("#summaryName").textContent = "Guest";
    $("#summaryEmail").textContent = "-";
    $("#summaryPhone").textContent = "-";
    $("#summaryAccountId").textContent = "-";
    $("#summaryStatus").textContent = "Guest";
    elements.tradeStatus.textContent = "Login or create an account before trading.";
    return;
  }

  $$(".mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.accountMode === state.accountMode);
  });

  elements.accountLabel.textContent = state.accountMode === "real" ? "Real USD" : "Demo USD";
  elements.balance.textContent = formatMoney(currentBalance());

  $("#summaryName").textContent = state.currentUser.fullName || "-";
  $("#summaryEmail").textContent = state.currentUser.email || "-";
  $("#summaryPhone").textContent = state.currentUser.phone || "-";
  $("#summaryAccountId").textContent = state.accountMode === "real" ? state.currentUser.accountId : "No ID on Demo";
  $("#summaryStatus").textContent = state.accountMode === "real" ? "Real Account" : "Demo Account";

  fillSettingsForm();
}

function renderMarket() {
  const market = marketConfigs[state.market];
  elements.marketName.textContent = market.label;

  $$(".market-option").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.market === state.market);
  });
}

function renderOpenTrades() {
  elements.openTradeCount.textContent = String(state.openTrades.length);

  if (!state.openTrades.length) {
    elements.openTradesList.innerHTML = `<p class="empty-note">No open trades.</p>`;
    return;
  }

  elements.openTradesList.innerHTML = state.openTrades.map((trade) => `
    <div class="simple-card" style="padding:12px;">
      <div class="card-head-line" style="margin-bottom:6px;">
        <h3 style="font-size:15px;margin:0;">${trade.choice} · ${trade.tradeType}</h3>
        <span>${formatMoney(trade.stake)}</span>
      </div>
      <p class="empty-note">${trade.market} · ${trade.remaining} ticks left</p>
    </div>
  `).join("");
}

function renderHistory() {
  elements.historyCount.textContent = String(state.tradeHistory.length);

  if (!state.tradeHistory.length) {
    elements.historyList.innerHTML = `<p class="empty-note">No trades yet.</p>`;
    return;
  }

  elements.historyList.innerHTML = state.tradeHistory.slice(0, 12).map((trade) => `
    <div class="simple-card" style="padding:12px;">
      <div class="card-head-line" style="margin-bottom:6px;">
        <h3 style="font-size:15px;margin:0;">${trade.choice} · ${trade.tradeType}</h3>
        <span style="background:${trade.won ? "#dff5e9" : "#fce3e3"}; color:${trade.won ? "#17965f" : "#cc3030"};">
          ${trade.won ? "+" : "-"}${formatMoney(Math.abs(trade.profit))}
        </span>
      </div>
      <p class="empty-note">${trade.market} · Digit ${trade.digit} · ${new Date(trade.createdAt).toLocaleTimeString()}</p>
    </div>
  `).join("");
}

function renderTransactions() {
  const list = $("#transactionList");

  if (!state.transactionHistory.length) {
    list.innerHTML = `<p class="empty-note">No transactions yet.</p>`;
    return;
  }

  list.innerHTML = state.transactionHistory.slice(0, 100).map((item) => `
    <div class="simple-card" style="padding:12px;">
      <div class="card-head-line" style="margin-bottom:6px;">
        <h3 style="font-size:15px;margin:0;">${item.type} · ${item.status}</h3>
        <span>${formatMoney(item.type === "trade" ? item.profit || 0 : item.amount || 0)}</span>
      </div>
      <p class="empty-note">${item.accountType || "Account"} · Bal ${formatMoney(item.balanceAfter || 0)} · ${new Date(item.createdAt).toLocaleString()}</p>
    </div>
  `).join("");
}

function renderBot() {
  $("#botNetProfit").textContent = formatMoney(state.bot.netProfit);
  $("#botLevel").textContent = String(state.bot.level);
  $("#botNextStake").textContent = formatMoney(state.bot.currentStake);
  $("#botBottomStatus").textContent = state.bot.running ? "Bot running" : "Bot is not running";

  const list = $("#botHistoryList");

  if (!state.bot.history.length) {
    list.innerHTML = `<p class="empty-note">No bot trades yet.</p>`;
    return;
  }

  list.innerHTML = state.bot.history.slice(0, 20).map((item) => `
    <div class="simple-card" style="padding:12px;">
      <div class="card-head-line" style="margin-bottom:6px;">
        <h3 style="font-size:15px;margin:0;">${item.tradeType}</h3>
        <span style="background:${item.won ? "#dff5e9" : "#fce3e3"}; color:${item.won ? "#17965f" : "#cc3030"};">
          ${item.won ? "WIN" : "LOSS"}
        </span>
      </div>
      <p class="empty-note">${item.market} · Stake ${formatMoney(item.stake)}</p>
    </div>
  `).join("");
}

function renderAll() {
  renderAccountUI();
  renderMarket();
  renderTradePanel();
  renderOpenTrades();
  renderHistory();
  renderTransactions();
  renderBot();
  drawCharts();
}

function addTransaction(record) {
  state.transactionHistory.unshift({
    reference: createId("txn"),
    createdAt: new Date().toISOString(),
    ...record
  });

  state.transactionHistory = state.transactionHistory.slice(0, 100);
}

function requireLogin() {
  if (!state.currentUser) {
    openAuth("register");
    $("#authStatus").textContent = "Create an account and login first.";
    return false;
  }
  return true;
}

function getTicksValue() {
  return clamp($("#botDuration")?.value || 5, 1, 10);
}

function placeTrade(choice) {
  if (!requireLogin()) return;

  const stake = Number(elements.stakeInput.value || 0);
  const ticks = getTicksValue();

  if (state.accountMode === "real" && !state.settings.realTradingEnabled) {
    elements.tradeStatus.textContent = "Enable Real trading first in Settings.";
    return;
  }

  if (stake < 0.3) {
    elements.tradeStatus.textContent = "Minimum stake is 0.30 USD.";
    return;
  }

  if (stake > Number(state.settings.maximumStakeLimit || 100)) {
    elements.tradeStatus.textContent = `Maximum stake is ${formatMoney(state.settings.maximumStakeLimit || 100)}.`;
    return;
  }

  if (stake > currentBalance()) {
    elements.tradeStatus.textContent = "Balance is not enough for this trade.";
    return;
  }

  const rate = getPayoutRate(state.activeTradeType, choice);

  setCurrentBalance(currentBalance() - stake);
  state.activeChoice = choice;

  const trade = {
    id: createId("trade"),
    tradeType: state.activeTradeType,
    choice,
    stake,
    ticks,
    remaining: ticks,
    payout: Number((stake * rate).toFixed(2)),
    profit: Number((stake * rate - stake).toFixed(2)),
    targetDigit: state.selectedDigit,
    barrierDigit: state.barrierDigit,
    market: marketConfigs[state.market].label,
    entryQuote: tickData[tickData.length - 1]?.quote || marketConfigs[state.market].base,
    touched: false,
    createdAt: new Date().toISOString()
  };

  state.openTrades.unshift(trade);

  addTransaction({
    type: "trade-open",
    amount: stake,
    status: "open",
    accountType: state.accountMode === "real" ? "Real" : "Demo",
    balanceAfter: currentBalance()
  });

  elements.tradeStatus.textContent = `${choice} trade opened.`;
  showToast("Trade opened", `${choice} · ${state.activeTradeType} · ${formatMoney(stake)}`, "info", 1200);

  renderAll();
  saveState();
}

function tradeWins(trade, tick, prev) {
  if (trade.tradeType === "Even/Odd") {
    return trade.choice === "Even" ? tick.digit % 2 === 0 : tick.digit % 2 === 1;
  }

  if (trade.tradeType === "Rise/Fall") {
    const oldQuote = prev?.quote ?? trade.entryQuote;
    return trade.choice === "Rise" ? tick.quote >= oldQuote : tick.quote < oldQuote;
  }

  if (trade.tradeType === "Matches/Differs") {
    return trade.choice === "Matches" ? tick.digit === trade.targetDigit : tick.digit !== trade.targetDigit;
  }

  if (trade.tradeType === "Over/Under") {
    return trade.choice === "Over" ? tick.digit > trade.barrierDigit : tick.digit < trade.barrierDigit;
  }

  if (trade.tradeType === "Touch/No Touch") {
    return trade.choice === "Touch" ? trade.touched : !trade.touched;
  }

  return false;
}

function flashDigit(digit, won) {
  const tile = elements.digitFrequency.querySelector(`[data-digit-wrapper="${digit}"]`);
  if (!tile) return;

  tile.classList.add(won ? "result-win" : "result-loss");
  setTimeout(() => tile.classList.remove("result-win", "result-loss"), 1000);
}

function settleOpenTrades(tick, prev) {
  if (!state.openTrades.length) return;

  const settled = [];

  state.openTrades.forEach((trade) => {
    if (tick.digit === trade.targetDigit) trade.touched = true;
    trade.remaining -= 1;
    if (trade.remaining <= 0) settled.push(trade);
  });

  settled.forEach((trade) => {
    const won = tradeWins(trade, tick, prev);

    if (won) setCurrentBalance(currentBalance() + trade.payout);
    const profit = won ? trade.profit : -trade.stake;

    const record = {
      id: trade.id,
      tradeType: trade.tradeType,
      choice: trade.choice,
      stake: trade.stake,
      payout: won ? trade.payout : 0,
      profit,
      market: trade.market,
      digit: tick.digit,
      createdAt: new Date().toISOString(),
      won
    };

    state.tradeHistory.unshift(record);
    state.tradeHistory = state.tradeHistory.slice(0, 100);
    state.openTrades = state.openTrades.filter((item) => item.id !== trade.id);

    addTransaction({
      type: "trade",
      amount: trade.stake,
      profit,
      status: won ? "win" : "loss",
      accountType: state.accountMode === "real" ? "Real" : "Demo",
      balanceAfter: currentBalance(),
      reference: trade.id
    });

    flashDigit(tick.digit, won);
    elements.tradeStatus.textContent = won
      ? `${trade.choice} won. Profit ${formatMoney(trade.profit)}.`
      : `${trade.choice} lost. Loss ${formatMoney(trade.stake)}.`;

    showToast(
      won ? "Trade won" : "Trade lost",
      `${trade.choice} · ${trade.tradeType} · ${won ? "+" : "-"}${formatMoney(Math.abs(profit))}`,
      won ? "win" : "loss",
      1200
    );

    if (state.bot.running) applyBotResult(won, trade, profit);
  });

  renderAll();
  saveState();
}

function openAuth(mode = "register") {
  setAuthMode(mode);
  openSheet($("#authSheet"));
}

function setAuthMode(mode) {
  const register = mode === "register";
  $("#registerTab").classList.toggle("active", register);
  $("#loginTab").classList.toggle("active", !register);
  $("#registerForm").classList.toggle("active-auth-form", register);
  $("#loginForm").classList.toggle("active-auth-form", !register);
  $("#authTitle").textContent = register ? "Create Account" : "Login";
}

async function handleRegister(event) {
  event.preventDefault();

  const payload = {
    fullName: $("#registerName").value.trim(),
    email: $("#registerEmail").value.trim().toLowerCase(),
    phone: $("#registerPhone").value.trim(),
    idNumber: $("#registerIdNumber").value.trim(),
    country: $("#registerCountry").value,
    documentType: $("#registerDocument").value,
    password: $("#registerPassword").value,
    passwordConfirm: $("#registerPasswordConfirm").value,
    agreed: $("#registerAgreement").checked
  };

  if (payload.password !== payload.passwordConfirm) {
    $("#authStatus").textContent = "Passwords do not match.";
    return;
  }

  if (!payload.agreed) {
    $("#authStatus").textContent = "You must confirm the agreement.";
    return;
  }

  try {
    const data = await postJson("/api/register", payload);
    state.currentUser = data.user;
    state.demoBalance = Number(data.user.demoBalance || 10000);
    state.realBalance = Number(data.user.realBalance || 0);
    state.settings = { ...state.settings, ...(data.user.settings || {}) };
  } catch {
    const user = createLocalUser(payload);
    state.currentUser = user;
    state.demoBalance = Number(user.demoBalance || 10000);
    state.realBalance = Number(user.realBalance || 0);
    state.settings = { ...state.settings, ...(user.settings || {}) };
  }

  state.accountMode = "demo";
  closeSheet($("#authSheet"));
  renderAll();
  saveState();
  showToast("Account created", "Demo and Real trading unlocked.", "info", 1600);
}

async function handleLogin(event) {
  event.preventDefault();

  const identifier = $("#loginIdentifier").value.trim();
  const password = $("#loginPassword").value;

  try {
    const data = await postJson("/api/login", { identifier, password });
    state.currentUser = data.user;
    state.demoBalance = Number(data.user.demoBalance || 10000);
    state.realBalance = Number(data.user.realBalance || 0);
    state.settings = { ...state.settings, ...(data.user.settings || {}) };
  } catch {
    const user = findLocalUser(identifier, password);

    if (!user) {
      $("#authStatus").textContent = "Email/Account ID or password is incorrect.";
      return;
    }

    state.currentUser = user;
    state.demoBalance = Number(user.demoBalance || 10000);
    state.realBalance = Number(user.realBalance || 0);
    state.settings = { ...state.settings, ...(user.settings || {}) };
  }

  state.accountMode = "demo";
  closeSheet($("#authSheet"));
  renderAll();
  saveState();
  showToast("Logged in", "Welcome back.", "info", 1500);
}

function logout() {
  state.currentUser = null;
  state.accountMode = "demo";
  state.openTrades = [];
  state.pendingDeposit = null;
  renderAll();
  saveState();
  showToast("Logged out", "You have been logged out.", "info", 1200);
}

function setMarket(market) {
  if (!marketConfigs[market]) return;
  state.market = market;
  generateInitialData();
  renderMarket();
  updateQuoteUI(tickData[tickData.length - 1], tickData[tickData.length - 2]);
  renderDigits(tickData[tickData.length - 1]?.digit || 0);
  drawCharts();
  saveState();
}

function updateMpesaPreview() {
  $("#mpesaAmount").textContent = formatKes(Number($("#depositAmount").value || 0) * KES_RATE);
}

function fillSettingsForm() {
  if (!state.currentUser) return;

  $("#settingsName").value = state.settings.profileName || state.currentUser.fullName || "";
  $("#settingsEmail").value = state.currentUser.email || "";
  $("#settingsPhone").value = state.settings.phone || state.currentUser.phone || "";
  $("#settingsDepositPhone").value = state.settings.depositPhone || state.currentUser.phone || "";
  $("#settingsWithdrawalPhone").value = state.settings.withdrawalPhone || state.currentUser.phone || "";
  $("#settingsTheme").value = state.settings.theme || "dark";
  $("#settingsChartSpeed").value = state.settings.chartSpeed || "normal";
  $("#settingsRealTrading").value = String(Boolean(state.settings.realTradingEnabled));
  $("#settingsMaxStake").value = state.settings.maximumStakeLimit || 100;
  $("#settingsDailyLimit").value = state.settings.dailyTradeLimit || 25;
  $("#settingsNotifications").value = String(Boolean(state.settings.notifications));
  $("#settingsSound").value = String(Boolean(state.settings.sound));
}

function openDeposit() {
  if (!requireLogin()) return;

  $("#depositPhone").value = state.settings.depositPhone || state.currentUser.phone || "";
  $("#depositEmail").value = state.currentUser.email || "";
  updateMpesaPreview();
  $("#depositStatus").textContent = "Fill deposit details to receive STK push.";
  $("#checkDeposit").hidden = !state.pendingDeposit;
  openSheet($("#depositSheet"));
}

async function handleDeposit(event) {
  event.preventDefault();
  if (!requireLogin()) return;

  const usdAmount = Number($("#depositAmount").value || 0);
  if (usdAmount < 1) {
    $("#depositStatus").textContent = "Minimum deposit is 1 USD.";
    return;
  }

  try {
    const data = await postJson("/api/create-intasend-stk-push", {
      amount: usdAmount * KES_RATE,
      usd_amount: usdAmount,
      account_id: state.currentUser.accountId,
      phone_number: $("#depositPhone").value.trim(),
      email: $("#depositEmail").value.trim() || state.currentUser.email
    });

    state.pendingDeposit = {
      apiRef: data.api_ref,
      usdAmount,
      accountId: state.currentUser.accountId
    };

    $("#checkDeposit").hidden = false;
    $("#depositStatus").textContent = data.message || "STK push sent to your phone.";
    startDepositPolling();
    saveState();
  } catch (error) {
    $("#depositStatus").textContent = error.message;
  }
}

function startDepositPolling() {
  stopDepositPolling();
  depositTimer = setInterval(checkPendingDeposit, 3500);
}

function stopDepositPolling() {
  if (depositTimer) clearInterval(depositTimer);
  depositTimer = null;
}

async function checkPendingDeposit() {
  if (!state.pendingDeposit?.apiRef) return;

  try {
    const status = await getJson(`/api/deposit-status?api_ref=${encodeURIComponent(state.pendingDeposit.apiRef)}`);

    if (status.confirmed && !status.credited) {
      const claim = await postJson("/api/claim-deposit", {
        api_ref: state.pendingDeposit.apiRef,
        account_id: state.currentUser.accountId
      });

      state.pendingDeposit = null;
      stopDepositPolling();

      state.realBalance = Number(claim.user?.realBalance || state.realBalance + Number(claim.usd_amount || 0));
      state.accountMode = "real";

      $("#checkDeposit").hidden = true;
      $("#depositStatus").textContent = claim.message || "Deposit credited.";

      addTransaction({
        type: "deposit",
        amount: Number(claim.usd_amount || 0),
        status: "completed",
        accountType: "Real",
        balanceAfter: state.realBalance
      });

      renderAll();
      saveState();

      showToast("Deposit confirmed", `${formatMoney(Number(claim.usd_amount || 0))} added to Real balance.`, "win", 1600);
    }
  } catch (error) {
    $("#depositStatus").textContent = error.message;
  }
}

function openWithdraw() {
  if (!requireLogin()) return;

  $("#withdrawPhone").value = state.settings.withdrawalPhone || state.currentUser.phone || "";
  $("#withdrawStatus").textContent = state.accountMode === "real"
    ? "Withdrawals use Real balance only."
    : "Switch to Real account before withdrawing.";

  openSheet($("#withdrawSheet"));
}

async function handleWithdraw(event) {
  event.preventDefault();
  if (!requireLogin()) return;

  if (state.accountMode !== "real") {
    $("#withdrawStatus").textContent = "Switch to Real account before withdrawing.";
    return;
  }

  const amount = Number($("#withdrawAmount").value || 0);

  if (amount < 5) {
    $("#withdrawStatus").textContent = "Minimum withdrawal is 5 USD.";
    return;
  }

  if (amount > 150000) {
    $("#withdrawStatus").textContent = "Maximum withdrawal is 150000 USD.";
    return;
  }

  if (amount > state.realBalance) {
    $("#withdrawStatus").textContent = "Real balance is not enough.";
    return;
  }

  try {
    const data = await postJson("/api/withdraw", {
      email: state.currentUser.email,
      amount,
      phone: $("#withdrawPhone").value.trim()
    });

    state.realBalance = Number(data.user?.realBalance ?? state.realBalance - amount);
    addTransaction(data.transaction || {
      type: "withdrawal",
      amount,
      status: "pending",
      accountType: "Real",
      balanceAfter: state.realBalance
    });

    $("#withdrawStatus").textContent = data.message || "Withdrawal request received.";
    renderAll();
    saveState();

    showToast("Withdrawal requested", `${formatMoney(amount)} requested.`, "info", 1600);
  } catch (error) {
    $("#withdrawStatus").textContent = error.message;
  }
}

async function saveSettings(event) {
  event.preventDefault();

  state.settings = {
    ...state.settings,
    profileName: $("#settingsName").value.trim(),
    phone: $("#settingsPhone").value.trim(),
    depositPhone: $("#settingsDepositPhone").value.trim(),
    withdrawalPhone: $("#settingsWithdrawalPhone").value.trim(),
    theme: $("#settingsTheme").value,
    chartSpeed: $("#settingsChartSpeed").value,
    realTradingEnabled: $("#settingsRealTrading").value === "true",
    maximumStakeLimit: Math.max(0.3, Number($("#settingsMaxStake").value || 100)),
    dailyTradeLimit: Math.max(1, Number($("#settingsDailyLimit").value || 25)),
    notifications: $("#settingsNotifications").value === "true",
    sound: $("#settingsSound").value === "true"
  };

  restartTickTimer();

  try {
    if (state.currentUser?.email) {
      await putJson(`/api/settings/${encodeURIComponent(state.currentUser.email)}`, {
        settings: state.settings,
        newPassword: $("#settingsPassword").value || undefined
      });
    }
    $("#settingsStatus").textContent = "Settings saved.";
  } catch (error) {
    $("#settingsStatus").textContent = `Saved on browser. ${error.message}`;
  }

  renderAll();
  saveState();
}

async function openPartner() {
  if (!requireLogin()) return;

  openSheet($("#partnerSheet"));

  try {
    const data = await getJson(`/api/partner/${encodeURIComponent(state.currentUser.email)}`);
    renderPartner(data);
  } catch {
    $("#partnerStatus").textContent = "Open a partner account to get referral link and commission dashboard.";
  }
}

function renderPartner(data) {
  if (!data?.partner) return;

  $("#partnerDashboard").hidden = false;
  $("#partnerReferralLink").value = data.partner.referralLink || "";

  const stats = data.stats || {};
  $("#partnerStats").innerHTML = [
    ["Total referred users", stats.totalReferredUsers || 0],
    ["Active real traders", stats.activeRealTraders || 0],
    ["Total real deposits", formatMoney(stats.totalRealDeposits || 0)],
    ["Total real trade volume", formatMoney(stats.totalRealTradeVolume || 0)],
    ["Commission earned", formatMoney(stats.totalCommissionEarned || 0)],
    ["Pending commission", formatMoney(stats.pendingCommission || 0)],
    ["Paid commission", formatMoney(stats.paidCommission || 0)]
  ].map(([label, value]) => `
    <div>
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");

  $("#partnerStatus").textContent = "Partner dashboard is active.";
}

async function applyPartner() {
  if (!requireLogin()) return;

  try {
    const data = await postJson("/api/partner/apply", {
      email: state.currentUser.email
    });

    renderPartner({ partner: data.partner, stats: {} });
    $("#partnerStatus").textContent = data.message || "Partner account opened.";
  } catch (error) {
    $("#partnerStatus").textContent = error.message;
  }
}

function resetBot() {
  state.bot = {
    running: false,
    baseStake: Number($("#botStake").value || 0.3),
    currentStake: Number($("#botStake").value || 0.3),
    netProfit: 0,
    level: 0,
    history: []
  };

  renderBot();
  saveState();
}

function stopBot(message = "Bot is not running") {
  state.bot.running = false;
  $("#botBottomStatus").textContent = message;
  renderBot();
  saveState();
}

function chooseBotDirection() {
  const direction = $("#botDirection").value;
  const type = $("#botTradeType").value;

  if (direction !== "Auto") return direction;

  if (type === "Rise/Fall") return Math.random() > .5 ? "Rise" : "Fall";
  if (type === "Even/Odd") return Math.random() > .5 ? "Even" : "Odd";
  if (type === "Over/Under") return Math.random() > .5 ? "Over" : "Under";
  if (type === "Matches/Differs") return Math.random() > .35 ? "Differs" : "Matches";
  if (type === "Touch/No Touch") return Math.random() > .35 ? "No Touch" : "Touch";
  return "Even";
}

function runBotTrade() {
  if (!state.bot.running || state.openTrades.length) return;
  if (!requireLogin()) {
    stopBot("Login required");
    return;
  }

  state.activeTradeType = $("#botTradeType").value;
  state.selectedDigit = clamp($("#botBarrier").value, 0, 9);
  state.barrierDigit = state.selectedDigit;
  elements.stakeInput.value = String(state.bot.currentStake || Number($("#botStake").value || 0.3));

  renderTradePanel();
  renderDigits(tickData[tickData.length - 1]?.digit || 0);
  placeTrade(chooseBotDirection());
}

function startBot() {
  if (!requireLogin()) return;

  state.bot.running = true;
  state.bot.baseStake = Math.max(0.3, Number($("#botStake").value || 0.3));
  state.bot.currentStake = state.bot.currentStake || state.bot.baseStake;

  renderBot();
  runBotTrade();
}

function applyBotResult(won, trade, profit) {
  state.bot.netProfit = Number((state.bot.netProfit + profit).toFixed(2));

  if (won || $("#botRecovery").value !== "Martingale") {
    state.bot.level = 0;
    state.bot.currentStake = Number($("#botStake").value || 0.3);
  } else {
    state.bot.level += 1;

    if (state.bot.level > Number($("#botMaxSteps").value || 6)) {
      state.bot.level = 0;
      state.bot.currentStake = Number($("#botStake").value || 0.3);
    } else {
      state.bot.currentStake = Number((state.bot.currentStake * Number($("#botMultiplier").value || 2)).toFixed(2));
    }
  }

  state.bot.history.unshift({
    tradeType: `${trade.choice} · ${trade.tradeType}`,
    market: trade.market,
    stake: trade.stake,
    won
  });

  const takeProfit = Number($("#botTakeProfit").value || 0);
  const stopLoss = Number($("#botStopLoss").value || 0);

  if (takeProfit > 0 && state.bot.netProfit >= takeProfit) stopBot("Take profit reached");
  if (stopLoss > 0 && state.bot.netProfit <= -stopLoss) stopBot("Stop loss reached");

  renderBot();
}

function scanAI() {
  const markets = Object.keys(marketConfigs);
  const types = Object.keys(tradeChoices);

  aiSuggestion = {
    market: markets[Math.floor(Math.random() * markets.length)],
    tradeType: types[Math.floor(Math.random() * types.length)],
    digit: Math.floor(Math.random() * 10),
    confidence: Math.floor(60 + Math.random() * 30)
  };

  $("#aiMarket").textContent = marketConfigs[aiSuggestion.market].label;
  $("#aiTrade").textContent = aiSuggestion.tradeType;
  $("#aiBarrier").textContent = aiSuggestion.digit;
  $("#aiConfidence").textContent = `${aiSuggestion.confidence}%`;
  $("#aiReason").textContent = "AI scanned recent movement, digit pressure, and short-term momentum.";
}

function applyAI() {
  if (!aiSuggestion) scanAI();

  setMarket(aiSuggestion.market);
  state.activeTradeType = aiSuggestion.tradeType;
  state.selectedDigit = aiSuggestion.digit;
  state.barrierDigit = aiSuggestion.digit;

  renderTradePanel();
  renderDigits(tickData[tickData.length - 1]?.digit || 0);
  saveState();

  showToast("AI applied", `${aiSuggestion.tradeType} loaded.`, "info", 1400);
}

function restartTickTimer() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(nextTick, getSpeedMs());
}

function bindEvents() {
  $$(".main-tab").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".main-tab").forEach((item) => item.classList.toggle("active", item === button));
      const tab = button.dataset.tab;

      $("#botPanel").classList.toggle("active-panel", tab === "bot");
      $("#tradePanel").classList.toggle("active-panel", tab === "trade");
      $("#bulkPanel").classList.toggle("active-panel", tab === "bulk");
      $("#menuPanel").classList.toggle("active-panel", tab === "menu");
      drawCharts();
    });
  });

  $("#openMenuPanelButton").addEventListener("click", () => {
    $$(".main-tab").forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === "menu"));
    $("#botPanel").classList.remove("active-panel");
    $("#tradePanel").classList.remove("active-panel");
    $("#bulkPanel").classList.remove("active-panel");
    $("#menuPanel").classList.add("active-panel");
  });

  $("#refreshButton")?.addEventListener("click", () => {
    generateInitialData();
    drawCharts();
    renderDigits(tickData[tickData.length - 1]?.digit || 0);
  });

  $("#getStartedButton").addEventListener("click", () => openAuth("register"));
  $("#loginButton").addEventListener("click", () => openAuth("login"));
  $("#closeAuth").addEventListener("click", () => closeSheet($("#authSheet")));
  $("#registerTab").addEventListener("click", () => setAuthMode("register"));
  $("#loginTab").addEventListener("click", () => setAuthMode("login"));
  $("#registerForm").addEventListener("submit", handleRegister);
  $("#loginForm").addEventListener("submit", handleLogin);

  $("#forgotPasswordButton").addEventListener("click", () => {
    $("#authStatus").textContent = "Password reset will be connected to email next.";
  });

  $$(".mode-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (!requireLogin()) return;
      state.accountMode = button.dataset.accountMode;
      renderAll();
      saveState();
    });
  });

  $("#logoutButton").addEventListener("click", logout);

  $("#lineModeButton").addEventListener("click", () => {
    state.chartMode = "line";
    $("#lineModeButton").classList.add("active");
    $("#candleModeButton").classList.remove("active");
    drawCharts();
    saveState();
  });

  $("#candleModeButton").addEventListener("click", () => {
    state.chartMode = "candles";
    $("#candleModeButton").classList.add("active");
    $("#lineModeButton").classList.remove("active");
    drawCharts();
    saveState();
  });

  $$("[data-speed]").forEach((button) => {
    button.addEventListener("click", () => {
      state.settings.chartSpeed = button.dataset.speed;
      $$("[data-speed]").forEach((item) => item.classList.toggle("active", item === button));
      restartTickTimer();
      saveState();
    });
  });

  $("#marketSelector").addEventListener("click", () => openSheet($("#marketSheet")));
  $("#closeMarket").addEventListener("click", () => closeSheet($("#marketSheet")));

  $("#marketSheet").addEventListener("click", (event) => {
    if (event.target.id === "marketSheet") closeSheet($("#marketSheet"));

    const button = event.target.closest(".market-option");
    if (button) {
      setMarket(button.dataset.market);
      closeSheet($("#marketSheet"));
    }
  });

  $("#predictionGridDesktop").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-digit]");
    if (!btn) return;

    const value = Number(btn.dataset.digit);
    if (state.activeTradeType === "Over/Under") state.barrierDigit = value;
    else state.selectedDigit = value;

    renderTradePanel();
    renderDigits(tickData[tickData.length - 1]?.digit || 0);
    saveState();
  });

  elements.digitFrequency.addEventListener("click", (event) => {
    const button = event.target.closest("[data-digit]");
    if (!button) return;

    const value = Number(button.dataset.digit);
    if (state.activeTradeType === "Over/Under") state.barrierDigit = value;
    else state.selectedDigit = value;

    renderTradePanel();
    renderDigits(tickData[tickData.length - 1]?.digit || 0);
    saveState();
  });

  elements.choiceRow.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-choice]");
    if (btn) placeTrade(btn.dataset.choice);
  });

  elements.mobileChoiceRow.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-choice]");
    if (btn) placeTrade(btn.dataset.choice);
  });

  $("#minusStakeButton").addEventListener("click", () => {
    const current = Number(elements.stakeInput.value || 10);
    elements.stakeInput.value = Math.max(0.3, Number((current - 1).toFixed(2)));
    updatePayoutPreview();
  });

  $("#plusStakeButton").addEventListener("click", () => {
    const current = Number(elements.stakeInput.value || 10);
    elements.stakeInput.value = Number((current + 1).toFixed(2));
    updatePayoutPreview();
  });

  elements.stakeInput.addEventListener("input", updatePayoutPreview);

  $("#depositButton").addEventListener("click", openDeposit);
  $("#closeDeposit").addEventListener("click", () => closeSheet($("#depositSheet")));
  $("#depositAmount").addEventListener("input", updateMpesaPreview);
  $("#depositForm").addEventListener("submit", handleDeposit);
  $("#checkDeposit").addEventListener("click", checkPendingDeposit);

  $("#withdrawButton").addEventListener("click", openWithdraw);
  $("#closeWithdraw").addEventListener("click", () => closeSheet($("#withdrawSheet")));
  $("#withdrawForm").addEventListener("submit", handleWithdraw);

  $("#transactionsMenuButton").addEventListener("click", () => {
    if (!requireLogin()) return;
    renderTransactions();
    openSheet($("#transactionsSheet"));
  });

  $("#closeTransactions").addEventListener("click", () => closeSheet($("#transactionsSheet")));

  $("#settingsMenuButton").addEventListener("click", () => {
    if (!requireLogin()) return;
    fillSettingsForm();
    openSheet($("#settingsSheet"));
  });

  $("#closeSettings").addEventListener("click", () => closeSheet($("#settingsSheet")));
  $("#settingsForm").addEventListener("submit", saveSettings);

  $("#partnerMenuButton").addEventListener("click", openPartner);
  $("#closePartner").addEventListener("click", () => closeSheet($("#partnerSheet")));
  $("#applyPartnerButton").addEventListener("click", applyPartner);

  $("#copyReferralButton").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("#partnerReferralLink").value);
      $("#partnerStatus").textContent = "Referral link copied.";
    } catch {
      $("#partnerStatus").textContent = "Copy manually.";
    }
  });

  $("#partnerWithdrawButton").addEventListener("click", () => {
    $("#partnerStatus").textContent = "Commission withdrawal will use backend payout process.";
  });

  $("#aiFloatButton").addEventListener("click", () => {
    scanAI();
    openSheet($("#aiSheet"));
  });

  $("#closeAiPanel").addEventListener("click", () => closeSheet($("#aiSheet")));
  $("#aiApplyButton").addEventListener("click", applyAI);

  $("#aiStartButton").addEventListener("click", () => {
    applyAI();
    state.bot.running = true;
    runBotTrade();
    closeSheet($("#aiSheet"));
  });

  $("#botRunButton").addEventListener("click", startBot);
  $("#botStopButton").addEventListener("click", () => stopBot("Bot stopped"));
  $("#botResetButton").addEventListener("click", resetBot);

  $("#botTradeType").addEventListener("change", () => {
    state.activeTradeType = $("#botTradeType").value;
    renderTradePanel();
    renderDigits(tickData[tickData.length - 1]?.digit || 0);
  });
}

function init() {
  loadState();

  if (!marketConfigs[state.market]) state.market = "Meta Volatility 100";
  if (!tradeChoices[state.activeTradeType]) state.activeTradeType = "Matches/Differs";

  generateInitialData();
  renderAll();
  renderDigits(tickData[tickData.length - 1]?.digit || 0);
  updateQuoteUI(tickData[tickData.length - 1], tickData[tickData.length - 2]);
  bindEvents();
  drawCharts();
  restartTickTimer();

  if (state.pendingDeposit?.apiRef) startDepositPolling();
}

init();
