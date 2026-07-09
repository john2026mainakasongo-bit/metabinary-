const marketConfigs = {
  "Meta Volatility 100": { label: "Volatility 100 (1s) Index", base: 396.12, volatility: 0.24 },
  "Meta Volatility 75": { label: "Volatility 75 (1s) Index", base: 248.41, volatility: 0.18 },
  "Meta Volatility 50": { label: "Volatility 50 (1s) Index", base: 612.08, volatility: 0.14 },
  "Meta Volatility 25": { label: "Volatility 25 (1s) Index", base: 184.23, volatility: 0.09 },
  "Meta Volatility 10": { label: "Volatility 10 (1s) Index", base: 98.14, volatility: 0.05 },
};

const tradeChoices = {
  "Even/Odd": ["Even", "Odd"],
  "Matches/Differs": ["Matches", "Differs"],
  "Over/Under": ["Over", "Under"],
  "Rise/Fall": ["Rise", "Fall"],
  "Touch/No Touch": ["Touch", "No Touch"],
};

const tradeHints = {
  "Even/Odd": "Tap Even or Odd below to place a trade.",
  "Matches/Differs": "Choose Matches or Differs. The selected digit in the ring will be the target digit.",
  "Over/Under": "Choose Over or Under. The selected digit in the ring will be your barrier.",
  "Rise/Fall": "Choose Rise or Fall. The trade settles against the latest price movement.",
  "Touch/No Touch": "Choose Touch or No Touch. The selected digit in the ring is the touch target.",
};

const storageKey = "metabinary-v8-state";
const localUsersKey = "metabinary-v8-local-users";
const kesRate = 130;

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const guestActions = $("#guestActions");
const accountToolbar = $("#accountToolbar");
const balance = $("#balance");
const topAccountLabel = $("#topAccountLabel");
const marketName = $("#marketName");
const marketDescription = $("#marketDescription");
const quoteText = $("#quoteText");
const digitQuote = $("#digitQuote");
const digitMove = $("#digitMove");
const digitFrequency = $("#digitFrequency");
const digitCursor = $("#digitCursor");
const selectedTrade = $("#selectedTrade");
const tradeHint = $("#tradeHint");
const payoutQuote = $("#payoutQuote");
const choiceRow = $("#choiceRow");
const stakeInput = $("#stakeInput");
const ticksInput = $("#ticksInput");
const maxStakeLabel = $("#maxStakeLabel");
const barrierText = $("#barrierText");
const tradeStatus = $("#tradeStatus");
const historyList = $("#historyList");
const historyCount = $("#historyCount");
const openTradesList = $("#openTradesList");
const openTradeCount = $("#openTradeCount");
const toastStack = $("#toastStack");

const marketSelector = $("#marketSelector");
const marketSheet = $("#marketSheet");
const closeMarket = $("#closeMarket");

const lineModeButton = $("#lineModeButton");
const candleModeButton = $("#candleModeButton");
const chartCanvas = $("#chartCanvas");
const chartCanvasLarge = $("#chartCanvasLarge");
const chartOpenValue = $("#chartOpenValue");
const chartHighValue = $("#chartHighValue");
const chartLowValue = $("#chartLowValue");
const chartCloseValue = $("#chartCloseValue");

const tabButtons = $$(".main-tabs button");
const panels = {
  trade: $("#tradePanel"),
  charts: $("#chartsPanel"),
  bot: $("#botPanel"),
  copy: $("#copyPanel"),
  menu: $("#menuPanel"),
};

const getStartedButton = $("#getStartedButton");
const loginButton = $("#loginButton");
const mobileMenuButton = $("#mobileMenuButton");
const accountModeButtons = $$(".account-mode");
const logoutButton = $("#logoutButton");

const authSheet = $("#authSheet");
const closeAuth = $("#closeAuth");
const registerTab = $("#registerTab");
const loginTab = $("#loginTab");
const authTitle = $("#authTitle");
const registerForm = $("#registerForm");
const loginForm = $("#loginForm");
const authStatus = $("#authStatus");
const forgotPasswordButton = $("#forgotPasswordButton");

const depositButton = $("#depositButton");
const withdrawButton = $("#withdrawButton");
const transactionsMenuButton = $("#transactionsMenuButton");
const settingsMenuButton = $("#settingsMenuButton");
const partnerMenuButton = $("#partnerMenuButton");

const depositSheet = $("#depositSheet");
const closeDeposit = $("#closeDeposit");
const depositForm = $("#depositForm");
const depositAmount = $("#depositAmount");
const mpesaAmount = $("#mpesaAmount");
const depositPhone = $("#depositPhone");
const depositEmail = $("#depositEmail");
const depositSubmit = $("#depositSubmit");
const checkDeposit = $("#checkDeposit");
const depositStatus = $("#depositStatus");

const withdrawSheet = $("#withdrawSheet");
const closeWithdraw = $("#closeWithdraw");
const withdrawForm = $("#withdrawForm");
const withdrawAmount = $("#withdrawAmount");
const withdrawPhone = $("#withdrawPhone");
const withdrawStatus = $("#withdrawStatus");

const transactionsSheet = $("#transactionsSheet");
const closeTransactions = $("#closeTransactions");
const transactionList = $("#transactionList");

const settingsSheet = $("#settingsSheet");
const closeSettings = $("#closeSettings");
const settingsForm = $("#settingsForm");
const settingsStatus = $("#settingsStatus");
const settingsName = $("#settingsName");
const settingsEmail = $("#settingsEmail");
const settingsPhone = $("#settingsPhone");
const settingsDepositPhone = $("#settingsDepositPhone");
const settingsWithdrawalPhone = $("#settingsWithdrawalPhone");
const settingsTheme = $("#settingsTheme");
const settingsChartSpeed = $("#settingsChartSpeed");
const settingsRealTrading = $("#settingsRealTrading");
const settingsMaxStake = $("#settingsMaxStake");
const settingsDailyLimit = $("#settingsDailyLimit");
const settingsNotifications = $("#settingsNotifications");
const settingsSound = $("#settingsSound");
const settingsPassword = $("#settingsPassword");

const partnerSheet = $("#partnerSheet");
const closePartner = $("#closePartner");
const applyPartnerButton = $("#applyPartnerButton");
const partnerDashboard = $("#partnerDashboard");
const partnerReferralLink = $("#partnerReferralLink");
const copyReferralButton = $("#copyReferralButton");
const partnerStats = $("#partnerStats");
const partnerWithdrawButton = $("#partnerWithdrawButton");
const partnerStatus = $("#partnerStatus");

const aiFloatButton = $("#aiFloatButton");
const aiSheet = $("#aiSheet");
const closeAiPanel = $("#closeAiPanel");
const aiMarket = $("#aiMarket");
const aiTrade = $("#aiTrade");
const aiBarrier = $("#aiBarrier");
const aiConfidence = $("#aiConfidence");
const aiReason = $("#aiReason");
const aiApplyButton = $("#aiApplyButton");
const aiStartButton = $("#aiStartButton");

const summaryName = $("#summaryName");
const summaryEmail = $("#summaryEmail");
const summaryPhone = $("#summaryPhone");
const summaryAccountId = $("#summaryAccountId");
const summaryStatus = $("#summaryStatus");

const botTradeType = $("#botTradeType");
const botStake = $("#botStake");
const botDuration = $("#botDuration");
const botDirection = $("#botDirection");
const botBarrier = $("#botBarrier");
const botRecovery = $("#botRecovery");
const botMultiplier = $("#botMultiplier");
const botMaxSteps = $("#botMaxSteps");
const botStopLoss = $("#botStopLoss");
const botTakeProfit = $("#botTakeProfit");
const botRunButton = $("#botRunButton");
const botStopButton = $("#botStopButton");
const botResetButton = $("#botResetButton");
const botNetProfit = $("#botNetProfit");
const botLevel = $("#botLevel");
const botNextStake = $("#botNextStake");
const botBottomStatus = $("#botBottomStatus");
const botHistoryList = $("#botHistoryList");

let state = {
  market: "Meta Volatility 100",
  accountMode: "demo",
  activeTradeType: "Even/Odd",
  activeChoice: "Even",
  selectedDigit: 2,
  barrierDigit: 4,
  demoBalance: 10000,
  realBalance: 0,
  currentUser: null,
  tradeHistory: [],
  openTrades: [],
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
    profileName: "",
  },
  bot: {
    running: false,
    baseStake: 0.3,
    currentStake: 0.3,
    netProfit: 0,
    level: 0,
    history: [],
  },
};

let tickData = [];
let candleData = [];
let digitStats = Array.from({ length: 10 }, () => 10);
let tickTimer = null;
let depositTimer = null;
let aiSuggestion = null;
let tradeCounter = 0;

function randomId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}

function formatMoney(v) {
  return `$${Number(v || 0).toFixed(2)}`;
}

function formatQuote(v) {
  return Number(v || 0).toFixed(2);
}

function formatKes(v) {
  return `KSh ${Math.round(Number(v || 0)).toLocaleString("en-US")}`;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, Number(v || 0)));
}

function currentBalance() {
  return state.accountMode === "real" ? state.realBalance : state.demoBalance;
}

function setCurrentBalance(value) {
  const clean = Number(Math.max(0, value).toFixed(2));
  if (state.accountMode === "real") state.realBalance = clean;
  else state.demoBalance = clean;
}

function getSpeedMs() {
  if (state.settings.chartSpeed === "fast") return 900;
  if (state.settings.chartSpeed === "slow") return 2500;
  return 1500;
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
    state = {
      ...state,
      ...stored,
      settings: { ...state.settings, ...(stored.settings || {}) },
      bot: { ...state.bot, ...(stored.bot || {}) },
    };
  } catch {}
}

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(localUsersKey) || "[]");
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(localUsersKey, JSON.stringify(users));
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
      profileName: data.fullName,
      phone: data.phone.trim(),
      depositPhone: data.phone.trim(),
      withdrawalPhone: data.phone.trim(),
      theme: "dark",
      chartSpeed: "normal",
      realTradingEnabled: false,
      maximumStakeLimit: 100,
      dailyTradeLimit: 25,
      notifications: true,
      sound: true,
    },
  };
  users.push(user);
  saveLocalUsers(users);
  return user;
}

function findLocalUser(identifier, password) {
  const users = getLocalUsers();
  const key = String(identifier || "").trim().toLowerCase();
  const filtered = users
    .filter((u) => u.email.toLowerCase() === key || u.accountId.toLowerCase() === key)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return filtered.find((u) => u.password === password) || null;
}

function syncLocalUserFromState() {
  if (!state.currentUser) return;
  const users = getLocalUsers();
  const index = users.findIndex((u) => u.accountId === state.currentUser.accountId);
  if (index >= 0) {
    users[index] = {
      ...users[index],
      demoBalance: state.demoBalance,
      realBalance: state.realBalance,
      settings: state.settings,
      fullName: state.currentUser.fullName,
      phone: state.currentUser.phone,
    };
    saveLocalUsers(users);
  }
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed.");
  return data;
}

async function getJson(url) {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed.");
  return data;
}

async function putJson(url, body) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed.");
  return data;
}

function setActiveTab(name) {
  tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === name));
  Object.entries(panels).forEach(([key, panel]) => {
    panel.classList.toggle("active-panel", key === name);
  });
  if (name === "charts") drawAllCharts();
}

function openSheet(sheet) {
  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
}

function closeSheet(sheet) {
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
}

function showToast(title, text, type = "info", timeout = 1600) {
  if (!state.settings.notifications) return;
  const div = document.createElement("div");
  div.className = `toast ${type}`;
  div.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
  toastStack.appendChild(div);
  setTimeout(() => div.remove(), timeout);
}

function renderAccountUI() {
  const loggedIn = Boolean(state.currentUser);

  guestActions.hidden = loggedIn;
  accountToolbar.hidden = !loggedIn;
  aiFloatButton.hidden = !loggedIn;

  if (!loggedIn) {
    tradeStatus.textContent = "Create an account and login to unlock Demo and Real trading.";
    summaryName.textContent = "Guest";
    summaryEmail.textContent = "-";
    summaryPhone.textContent = "-";
    summaryAccountId.textContent = "-";
    summaryStatus.textContent = "Guest";
    return;
  }

  accountModeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.accountMode === state.accountMode);
  });

  topAccountLabel.textContent = state.accountMode === "real" ? "Real USD" : "Demo USD";
  balance.textContent = formatMoney(currentBalance());

  summaryName.textContent = state.currentUser.fullName || "-";
  summaryEmail.textContent = state.currentUser.email || "-";
  summaryPhone.textContent = state.currentUser.phone || "-";
  summaryAccountId.textContent = state.accountMode === "real" ? state.currentUser.accountId : "No ID on Demo";
  summaryStatus.textContent = state.accountMode === "real" ? "Real Account" : "Demo Account";

  settingsName.value = state.settings.profileName || state.currentUser.fullName || "";
  settingsEmail.value = state.currentUser.email || "";
  settingsPhone.value = state.settings.phone || state.currentUser.phone || "";
  settingsDepositPhone.value = state.settings.depositPhone || state.currentUser.phone || "";
  settingsWithdrawalPhone.value = state.settings.withdrawalPhone || state.currentUser.phone || "";
  settingsTheme.value = state.settings.theme || "dark";
  settingsChartSpeed.value = state.settings.chartSpeed || "normal";
  settingsRealTrading.value = String(Boolean(state.settings.realTradingEnabled));
  settingsMaxStake.value = state.settings.maximumStakeLimit || 100;
  settingsDailyLimit.value = state.settings.dailyTradeLimit || 25;
  settingsNotifications.value = String(Boolean(state.settings.notifications));
  settingsSound.value = String(Boolean(state.settings.sound));

  maxStakeLabel.textContent = formatMoney(state.settings.maximumStakeLimit || 100);
}

function renderMarket() {
  const config = marketConfigs[state.market];
  marketName.textContent = config.label;
  marketDescription.textContent = `${state.market.replace("Meta ", "")} synthetic market`;
  $$(".market-option").forEach((btn) => btn.classList.toggle("active", btn.dataset.market === state.market));
}

function getCurrentTradeMeta() {
  return state.activeTradeType === "Over/Under"
    ? `Barrier ${state.barrierDigit}`
    : state.activeTradeType === "Matches/Differs" || state.activeTradeType === "Touch/No Touch"
      ? `Target digit ${state.selectedDigit}`
      : "Auto settlement";
}

function getPayoutRate(tradeType, choice) {
  if (tradeType === "Matches/Differs") return choice === "Matches" ? 8.333 : 1.087;
  if (tradeType === "Touch/No Touch") return choice === "Touch" ? 5.2 : 1.16;
  if (tradeType === "Rise/Fall") return 1.92;
  if (tradeType === "Even/Odd") return 1.88;
  if (tradeType === "Over/Under") {
    const barrier = state.barrierDigit;
    const wins = choice === "Over" ? Math.max(0, 9 - barrier) : Math.max(0, barrier);
    if (wins <= 0) return 0;
    return clamp((10 / wins) * 0.88, 1.05, 8.8);
  }
  return 1.88;
}

function renderTradePanel() {
  selectedTrade.textContent = state.activeTradeType;
  tradeHint.textContent = `${tradeHints[state.activeTradeType]} ${getCurrentTradeMeta()}`;
  barrierText.innerHTML =
    state.activeTradeType === "Over/Under"
      ? `Barrier digit: <strong>${state.barrierDigit}</strong>`
      : `Target digit: <strong>${state.selectedDigit}</strong>`;

  const choices = tradeChoices[state.activeTradeType];
  choiceRow.innerHTML = choices
    .map((choice, index) => {
      const rate = getPayoutRate(state.activeTradeType, choice);
      const profit = Math.max(0, ((Number(stakeInput.value || 0) * rate) - Number(stakeInput.value || 0))).toFixed(2);
      return `
        <button class="choice-button ${index === 0 ? "buyish" : "sellish"}" type="button" data-choice="${choice}">
          <span>${choice}</span>
          <div>
            <strong>${(Math.max(0, (rate - 1) * 100)).toFixed(2)}%</strong>
            <small>$${profit} profit</small>
          </div>
        </button>
      `;
    })
    .join("");

  updatePayoutPreview();
  $$(".trade-type").forEach((btn) => btn.classList.toggle("selected", btn.dataset.tradeType === state.activeTradeType));
}

function updatePayoutPreview() {
  const stake = Number(stakeInput.value || 0);
  const rate = getPayoutRate(state.activeTradeType, state.activeChoice);
  const payout = stake * rate;
  const profit = Math.max(0, payout - stake);
  payoutQuote.textContent = `${formatMoney(payout)} payout · ${formatMoney(profit)} profit`;
  maxStakeLabel.textContent = formatMoney(state.settings.maximumStakeLimit || 100);

  if (stake < 0.3) {
    tradeStatus.textContent = "Minimum stake is 0.30 USD.";
  } else if (stake > Number(state.settings.maximumStakeLimit || 100)) {
    tradeStatus.textContent = `Maximum stake is ${formatMoney(state.settings.maximumStakeLimit || 100)}.`;
  } else if (Number(ticksInput.value) > 10) {
    tradeStatus.textContent = "Ticks cannot be more than 10.";
  }
}

function generateInitialMarketData() {
  const base = marketConfigs[state.market].base;
  tickData = [];
  candleData = [];
  let price = base;
  let open = base;

  for (let i = 0; i < 80; i++) {
    const move = (Math.random() - 0.5) * marketConfigs[state.market].volatility;
    price = Number((price + move).toFixed(2));
    tickData.push({ quote: price, digit: Math.abs(Math.floor(price * 100)) % 10, move });
    if (i % 4 === 0) open = price;
    if (i % 4 === 3) {
      const slice = tickData.slice(i - 3, i + 1).map((x) => x.quote);
      candleData.push({
        open,
        high: Math.max(...slice),
        low: Math.min(...slice),
        close: price,
      });
    }
  }
}

function nextTick() {
  const prev = tickData[tickData.length - 1] || { quote: marketConfigs[state.market].base };
  const drift = (Math.random() - 0.5) * marketConfigs[state.market].volatility;
  const noise = (Math.random() - 0.5) * (marketConfigs[state.market].volatility * 0.35);
  const quote = Number((prev.quote + drift + noise).toFixed(2));
  const move = Number((quote - prev.quote).toFixed(2));
  const digit = Math.abs(Math.floor(quote * 100)) % 10;
  const tick = { quote, move, digit };
  tickData.push(tick);
  if (tickData.length > 120) tickData.shift();

  const lastCandle = candleData[candleData.length - 1];
  const candleIndex = tickData.length % 4;

  if (!lastCandle || candleIndex === 1) {
    candleData.push({ open: quote, high: quote, low: quote, close: quote });
  } else {
    lastCandle.high = Math.max(lastCandle.high, quote);
    lastCandle.low = Math.min(lastCandle.low, quote);
    lastCandle.close = quote;
  }
  if (candleData.length > 60) candleData.shift();

  const recentDigits = tickData.slice(-40).map((t) => t.digit);
  digitStats = Array.from({ length: 10 }, (_, digit) => {
    const count = recentDigits.filter((d) => d === digit).length;
    return Number(((count / recentDigits.length) * 100 || 0).toFixed(1));
  });

  updateQuoteUI(tick, prev);
  settleOpenTrades(tick, prev);
  renderDigits(tick.digit);
  drawAllCharts();
}

function updateQuoteUI(tick, prev) {
  quoteText.textContent = formatQuote(tick.quote);
  digitQuote.textContent = formatQuote(tick.quote);
  digitMove.textContent = `${tick.move >= 0 ? "+" : ""}${tick.move.toFixed(2)}`;
  digitMove.classList.toggle("down", tick.move < 0);

  const prices = tickData.slice(-25).map((t) => t.quote);
  chartOpenValue.textContent = formatQuote(prices[0]);
  chartHighValue.textContent = formatQuote(Math.max(...prices));
  chartLowValue.textContent = formatQuote(Math.min(...prices));
  chartCloseValue.textContent = formatQuote(prices[prices.length - 1]);
}

function drawChart(canvas, mode = state.chartMode) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, Math.floor(rect.width * devicePixelRatio));
  canvas.height = Math.max(220, Math.floor(rect.height * devicePixelRatio));
  ctx.scale(devicePixelRatio, devicePixelRatio);

  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const padding = { left: 20, right: 20, top: 18, bottom: 24 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartH / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  const source = mode === "candles" ? candleData : tickData;
  if (!source.length) return;

  const values = mode === "candles"
    ? source.flatMap((x) => [x.high, x.low])
    : source.map((x) => x.quote);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(0.01, max - min);

  if (mode === "line") {
    ctx.beginPath();
    source.forEach((point, index) => {
      const x = padding.left + (index / Math.max(1, source.length - 1)) * chartW;
      const y = padding.top + ((max - point.quote) / range) * chartH;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#28d8ca";
    ctx.stroke();

    const last = source[source.length - 1];
    const x = padding.left + chartW;
    const y = padding.top + ((max - last.quote) / range) * chartH;
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#71ffd4";
    ctx.fill();
  } else {
    const candleWidth = Math.max(4, chartW / Math.max(25, source.length) * 0.55);
    source.forEach((candle, index) => {
      const x = padding.left + (index / Math.max(1, source.length - 1)) * chartW;
      const openY = padding.top + ((max - candle.open) / range) * chartH;
      const closeY = padding.top + ((max - candle.close) / range) * chartH;
      const highY = padding.top + ((max - candle.high) / range) * chartH;
      const lowY = padding.top + ((max - candle.low) / range) * chartH;
      const green = candle.close >= candle.open;
      ctx.strokeStyle = green ? "#2ee66b" : "#ff4258";
      ctx.fillStyle = green ? "#2ee66b" : "#ff4258";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(3, Math.abs(closeY - openY));
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });
  }

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "12px Arial";
  ctx.fillText(formatQuote(max), 4, 14);
  ctx.fillText(formatQuote(min), 4, height - 8);
}

function drawAllCharts() {
  drawChart(chartCanvas, state.chartMode);
  drawChart(chartCanvasLarge, state.chartMode);
}

function getTopLowDigits() {
  const top = digitStats.indexOf(Math.max(...digitStats));
  const low = digitStats.indexOf(Math.min(...digitStats));
  return { top, low };
}

function renderDigits(cursorDigit = 0) {
  const { top, low } = getTopLowDigits();

  digitFrequency.innerHTML = Array.from({ length: 10 }, (_, digit) => {
    const percent = digitStats[digit] || 0;
    const isTop = digit === top;
    const isLow = digit === low;
    const activeTarget =
      (state.activeTradeType === "Matches/Differs" || state.activeTradeType === "Touch/No Touch")
      && state.selectedDigit === digit;
    const activeBarrier = state.activeTradeType === "Over/Under" && state.barrierDigit === digit;

    const outerColor = isTop ? "#2ee66b" : isLow ? "#ff4258" : "#d2d9e2";
    const outerWidth = isTop ? 8 : isLow ? 5 : 6;
    const percentArc = clamp(percent, 0, 100);
    const circumference = 2 * Math.PI * 28;
    const dash = (percentArc / 100) * circumference;
    const dashOffset = circumference - dash;
    const tileClass = [
      "digit-tile",
      activeTarget ? "selected-target" : "",
      activeBarrier ? "selected-barrier" : "",
    ].join(" ");

    return `
      <div class="${tileClass}" data-digit-wrapper="${digit}">
        <button type="button" data-digit="${digit}">
          <svg class="digit-svg" viewBox="0 0 84 84" aria-hidden="true">
            <circle cx="42" cy="42" r="28" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="6"></circle>
            <circle
              cx="42"
              cy="42"
              r="28"
              fill="none"
              stroke="${outerColor}"
              stroke-width="${outerWidth}"
              stroke-linecap="round"
              transform="rotate(-90 42 42)"
              stroke-dasharray="${dash} ${circumference}"
              stroke-dashoffset="${dashOffset}">
            </circle>
          </svg>
          <span class="digit-number-label">${digit}</span>
          <span class="digit-percent-label">${percent.toFixed(1)}%</span>
        </button>
      </div>
    `;
  }).join("");

  positionCursor(cursorDigit);
}

function positionCursor(digit) {
  const wrapper = digitFrequency.querySelector(`[data-digit-wrapper="${digit}"]`);
  if (!wrapper) return;
  const gridRect = digitFrequency.getBoundingClientRect();
  const box = wrapper.getBoundingClientRect();
  const x = box.left - gridRect.left + box.width / 2 - 9;
  digitCursor.style.transform = `translateX(${x}px)`;
}

function renderHistory() {
  historyCount.textContent = String(state.tradeHistory.length);

  if (!state.tradeHistory.length) {
    historyList.innerHTML = `<p class="empty-state">No trades yet.</p>`;
    return;
  }

  historyList.innerHTML = state.tradeHistory.slice(0, 12).map((item) => `
    <div class="history-item">
      <div class="history-top">
        <strong>${item.choice} · ${item.tradeType}</strong>
        <span class="item-amount ${item.won ? "" : "loss"}">${item.won ? "+" : "-"}${formatMoney(Math.abs(item.profit))}</span>
      </div>
      <div class="item-meta">${item.market} · Stake ${formatMoney(item.stake)} · Digit ${item.digit} · ${new Date(item.createdAt).toLocaleTimeString()}</div>
    </div>
  `).join("");
}

function renderOpenTrades() {
  openTradeCount.textContent = String(state.openTrades.length);

  if (!state.openTrades.length) {
    openTradesList.innerHTML = `<p class="empty-state">No open trades.</p>`;
    return;
  }

  openTradesList.innerHTML = state.openTrades.map((item) => `
    <div class="open-trade-item">
      <div class="open-trade-top">
        <strong>${item.choice} · ${item.tradeType}</strong>
        <span class="item-amount">${formatMoney(item.stake)}</span>
      </div>
      <div class="item-meta">${item.market} · ${item.meta} · ${item.remaining} ticks left</div>
    </div>
  `).join("");
}

function renderTransactions() {
  if (!state.transactionHistory.length) {
    transactionList.innerHTML = `<p class="empty-state">No transactions yet.</p>`;
    return;
  }

  transactionList.innerHTML = state.transactionHistory.slice(0, 100).map((item) => `
    <div class="transaction-item">
      <div class="transaction-top">
        <strong>${item.type} · ${item.status}</strong>
        <span class="item-amount ${item.status === "loss" ? "loss" : ""}">${item.type === "trade" ? formatMoney(item.profit || 0) : formatMoney(item.amount || 0)}</span>
      </div>
      <div class="item-meta">${item.accountType || "Account"} · Bal ${formatMoney(item.balanceAfter || 0)} · ${new Date(item.createdAt).toLocaleString()} · ${item.reference || ""}</div>
    </div>
  `).join("");
}

function renderBot() {
  botNetProfit.textContent = formatMoney(state.bot.netProfit);
  botLevel.textContent = String(state.bot.level);
  botNextStake.textContent = formatMoney(state.bot.currentStake);
  botBottomStatus.textContent = state.bot.running ? "Bot running" : "Bot is not running";

  if (!state.bot.history.length) {
    botHistoryList.innerHTML = `<p class="empty-state">No bot trades yet.</p>`;
    return;
  }

  botHistoryList.innerHTML = state.bot.history.slice(0, 20).map((item) => `
    <div class="bot-history-item">
      <strong>${item.tradeType}</strong>
      <span class="item-meta">${item.market} · ${formatMoney(item.stake)} · ${item.won ? "WIN" : "LOSS"}</span>
    </div>
  `).join("");
}

function addTransaction(record) {
  state.transactionHistory.unshift({
    reference: randomId("txn"),
    createdAt: new Date().toISOString(),
    ...record,
  });
  state.transactionHistory = state.transactionHistory.slice(0, 100);
  renderTransactions();
}

function ensureLoggedIn(forReal = false) {
  if (!state.currentUser) {
    openSheet(authSheet);
    authStatus.textContent = "Create an account and login first.";
    return false;
  }
  if (forReal && state.accountMode === "real" && !state.settings.realTradingEnabled) {
    tradeStatus.textContent = "Real trading is disabled in Settings. Enable it first.";
    return false;
  }
  return true;
}

function placeTrade(choice) {
  const stake = Number(stakeInput.value || 0);
  const ticks = Math.floor(Number(ticksInput.value || 0));

  if (!ensureLoggedIn(state.accountMode === "real")) return;

  if (stake < 0.3) {
    tradeStatus.textContent = "Minimum stake is 0.30 USD.";
    return;
  }

  if (stake > Number(state.settings.maximumStakeLimit || 100)) {
    tradeStatus.textContent = `Maximum stake is ${formatMoney(state.settings.maximumStakeLimit || 100)}.`;
    return;
  }

  if (ticks < 1 || ticks > 10) {
    tradeStatus.textContent = "Ticks should be between 1 and 10.";
    return;
  }

  if (stake > currentBalance()) {
    tradeStatus.textContent = "Balance is not enough for this trade.";
    return;
  }

  const rate = getPayoutRate(state.activeTradeType, choice);
  if (!rate) {
    tradeStatus.textContent = "This contract has no winning range. Select another target digit or barrier.";
    return;
  }

  setCurrentBalance(currentBalance() - stake);
  state.activeChoice = choice;

  const trade = {
    id: randomId("trade"),
    tradeType: state.activeTradeType,
    choice,
    stake,
    ticks,
    remaining: ticks,
    payout: Number((stake * rate).toFixed(2)),
    profit: Number(((stake * rate) - stake).toFixed(2)),
    targetDigit: state.selectedDigit,
    barrierDigit: state.barrierDigit,
    market: marketConfigs[state.market].label,
    entryQuote: tickData[tickData.length - 1]?.quote || marketConfigs[state.market].base,
    touched: false,
    createdAt: new Date().toISOString(),
    meta: getCurrentTradeMeta(),
  };

  state.openTrades.unshift(trade);
  renderAccountUI();
  renderOpenTrades();
  syncLocalUserFromState();
  saveState();

  tradeStatus.textContent = `${choice} trade opened for ${formatMoney(stake)} on ${state.activeTradeType}.`;
  showToast("Trade opened", `${choice} · ${state.activeTradeType} · Stake ${formatMoney(stake)}`, "info", 1200);

  addTransaction({
    type: "trade-open",
    amount: stake,
    status: "open",
    accountType: state.accountMode === "real" ? "Real" : "Demo",
    balanceAfter: currentBalance(),
  });
}

function tradeWins(trade, tick, prevTick) {
  if (trade.tradeType === "Even/Odd") {
    return trade.choice === "Even" ? tick.digit % 2 === 0 : tick.digit % 2 === 1;
  }
  if (trade.tradeType === "Rise/Fall") {
    const prev = prevTick?.quote ?? trade.entryQuote;
    return trade.choice === "Rise" ? tick.quote >= prev : tick.quote < prev;
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

function markResultDigit(digit, won) {
  const tile = digitFrequency.querySelector(`[data-digit-wrapper="${digit}"]`);
  if (!tile) return;
  tile.classList.add(won ? "result-win" : "result-loss");
  setTimeout(() => {
    tile.classList.remove("result-win", "result-loss");
  }, 1000);
}

function settleOpenTrades(tick, prevTick) {
  if (!state.openTrades.length) return;

  const settled = [];
  state.openTrades.forEach((trade) => {
    if (tick.digit === trade.targetDigit) trade.touched = true;
    trade.remaining -= 1;
    if (trade.remaining <= 0) settled.push(trade);
  });

  settled.forEach((trade) => {
    const won = tradeWins(trade, tick, prevTick);
    if (won) setCurrentBalance(currentBalance() + trade.payout);

    const profitValue = won ? trade.profit : -trade.stake;
    const record = {
      id: trade.id,
      tradeType: trade.tradeType,
      choice: trade.choice,
      stake: trade.stake,
      payout: won ? trade.payout : 0,
      profit: profitValue,
      market: trade.market,
      digit: tick.digit,
      createdAt: new Date().toISOString(),
      won,
    };

    state.tradeHistory.unshift(record);
    state.tradeHistory = state.tradeHistory.slice(0, 100);
    state.openTrades = state.openTrades.filter((t) => t.id !== trade.id);

    addTransaction({
      type: "trade",
      amount: trade.stake,
      profit: profitValue,
      status: won ? "win" : "loss",
      accountType: state.accountMode === "real" ? "Real" : "Demo",
      balanceAfter: currentBalance(),
      reference: trade.id,
    });

    markResultDigit(tick.digit, won);

    tradeStatus.textContent = won
      ? `${trade.choice} won. Profit ${formatMoney(trade.profit)}.`
      : `${trade.choice} lost. Loss ${formatMoney(trade.stake)}.`;

    showToast(
      won ? "Trade won" : "Trade lost",
      `${trade.choice} · ${trade.tradeType} · ${won ? "+" : "-"}${formatMoney(Math.abs(profitValue))}`,
      won ? "win" : "loss",
      1200
    );

    if (state.bot.running) applyBotResult(won, trade, profitValue);
  });

  renderAccountUI();
  renderHistory();
  renderOpenTrades();
  renderBot();
  syncLocalUserFromState();
  saveState();
}

function applyBotResult(won, trade, profitValue) {
  state.bot.netProfit = Number((state.bot.netProfit + profitValue).toFixed(2));
  if (won || botRecovery.value !== "Martingale") {
    state.bot.level = 0;
    state.bot.currentStake = Number(botStake.value || 0.3);
  } else {
    state.bot.level += 1;
    if (state.bot.level > Number(botMaxSteps.value || 6)) {
      state.bot.level = 0;
      state.bot.currentStake = Number(botStake.value || 0.3);
    } else {
      state.bot.currentStake = Number((state.bot.currentStake * Number(botMultiplier.value || 2)).toFixed(2));
    }
  }

  state.bot.history.unshift({
    tradeType: `${trade.choice} · ${trade.tradeType}`,
    market: trade.market,
    stake: trade.stake,
    won,
    createdAt: new Date().toISOString(),
  });

  const tp = Number(botTakeProfit.value || 0);
  const sl = Number(botStopLoss.value || 0);

  if (tp > 0 && state.bot.netProfit >= tp) {
    stopBot("Take profit reached");
  } else if (sl > 0 && state.bot.netProfit <= -sl) {
    stopBot("Stop loss reached");
  }

  renderBot();
}

function openAuth(mode = "register") {
  setAuthMode(mode);
  openSheet(authSheet);
}

function setAuthMode(mode) {
  const register = mode === "register";
  registerTab.classList.toggle("active", register);
  loginTab.classList.toggle("active", !register);
  registerForm.classList.toggle("active-auth-form", register);
  loginForm.classList.toggle("active-auth-form", !register);
  authTitle.textContent = register ? "Create Account" : "Login";
}

async function handleRegister(e) {
  e.preventDefault();

  const payload = {
    fullName: $("#registerName").value.trim(),
    email: $("#registerEmail").value.trim().toLowerCase(),
    phone: $("#registerPhone").value.trim(),
    idNumber: $("#registerIdNumber").value.trim(),
    country: $("#registerCountry").value,
    documentType: $("#registerDocument").value,
    password: $("#registerPassword").value,
    passwordConfirm: $("#registerPasswordConfirm").value,
    agreed: $("#registerAgreement").checked,
  };

  if (payload.password !== payload.passwordConfirm) {
    authStatus.textContent = "Passwords do not match.";
    return;
  }

  if (!payload.agreed) {
    authStatus.textContent = "You must confirm the agreement.";
    return;
  }

  try {
    const data = await postJson("/api/register", payload);
    state.currentUser = data.user;
    state.demoBalance = Number(data.user.demoBalance || 10000);
    state.realBalance = Number(data.user.realBalance || 0);
    state.settings = { ...state.settings, ...(data.user.settings || {}) };
    state.accountMode = "demo";
    authStatus.textContent = data.message || "Account created.";
    closeSheet(authSheet);
  } catch (error) {
    const user = createLocalUser(payload);
    state.currentUser = user;
    state.demoBalance = Number(user.demoBalance || 10000);
    state.realBalance = Number(user.realBalance || 0);
    state.settings = { ...state.settings, ...(user.settings || {}) };
    state.accountMode = "demo";
    authStatus.textContent = "Account created on this browser.";
    closeSheet(authSheet);
  }

  renderAccountUI();
  renderHistory();
  renderOpenTrades();
  saveState();
  showToast("Account created", "You can now switch between Demo and Real after login.", "info");
}

async function handleLogin(e) {
  e.preventDefault();

  const identifier = $("#loginIdentifier").value.trim();
  const password = $("#loginPassword").value;

  try {
    const data = await postJson("/api/login", { identifier, password });
    state.currentUser = data.user;
    state.demoBalance = Number(data.user.demoBalance || 10000);
    state.realBalance = Number(data.user.realBalance || 0);
    state.settings = { ...state.settings, ...(data.user.settings || {}) };
    state.accountMode = "demo";
    authStatus.textContent = data.message || "Logged in.";
    closeSheet(authSheet);
  } catch (error) {
    const user = findLocalUser(identifier, password);
    if (!user) {
      authStatus.textContent = "Email/Account ID or password is incorrect.";
      return;
    }
    state.currentUser = user;
    state.demoBalance = Number(user.demoBalance || 10000);
    state.realBalance = Number(user.realBalance || 0);
    state.settings = { ...state.settings, ...(user.settings || {}) };
    state.accountMode = "demo";
    authStatus.textContent = "Logged in on this browser.";
    closeSheet(authSheet);
  }

  renderAccountUI();
  saveState();
  showToast("Logged in", "Demo and Real accounts are now available.", "info");
}

async function handleForgotPassword() {
  const identifier = $("#loginIdentifier").value.trim();
  if (!identifier) {
    authStatus.textContent = "Enter your email first.";
    return;
  }
  try {
    const data = await postJson("/api/reset-password", { identifier });
    authStatus.textContent = data.message || "Password reset request received.";
  } catch (error) {
    authStatus.textContent = "Password reset is available when backend email is connected.";
  }
}

function logout() {
  state.currentUser = null;
  state.accountMode = "demo";
  state.openTrades = [];
  state.pendingDeposit = null;
  renderAccountUI();
  renderOpenTrades();
  saveState();
  showToast("Logged out", "You have been logged out.", "info");
}

function handleTradeTypeClick(btn) {
  state.activeTradeType = btn.dataset.tradeType;
  const options = tradeChoices[state.activeTradeType];
  state.activeChoice = options[0];
  renderTradePanel();
  renderDigits(tickData[tickData.length - 1]?.digit || 0);
  saveState();
}

function setDigitTarget(value) {
  if (state.activeTradeType === "Over/Under") state.barrierDigit = value;
  else state.selectedDigit = value;
  renderTradePanel();
  renderDigits(tickData[tickData.length - 1]?.digit || 0);
  saveState();
}

function setMarket(market) {
  if (!marketConfigs[market]) return;
  state.market = market;
  renderMarket();
  generateInitialMarketData();
  updateQuoteUI(tickData[tickData.length - 1], tickData[tickData.length - 2] || tickData[tickData.length - 1]);
  renderDigits(tickData[tickData.length - 1]?.digit || 0);
  drawAllCharts();
  saveState();
}

function updateMpesaPreview() {
  mpesaAmount.textContent = formatKes((Number(depositAmount.value || 0) * kesRate));
}

function openDeposit() {
  if (!ensureLoggedIn()) return;
  depositPhone.value = state.settings.depositPhone || state.currentUser.phone || "";
  depositEmail.value = state.currentUser.email || "";
  updateMpesaPreview();
  depositStatus.textContent = "Fill deposit details to receive STK push.";
  checkDeposit.hidden = !state.pendingDeposit;
  openSheet(depositSheet);
}

function openWithdraw() {
  if (!ensureLoggedIn()) return;
  withdrawPhone.value = state.settings.withdrawalPhone || state.currentUser.phone || "";
  withdrawStatus.textContent = state.accountMode === "real"
    ? "Withdrawals use Real balance only."
    : "Switch to Real account before withdrawing.";
  openSheet(withdrawSheet);
}

async function handleDeposit(e) {
  e.preventDefault();
  if (!ensureLoggedIn()) return;

  const usdAmount = Number(depositAmount.value || 0);
  if (usdAmount < 1) {
    depositStatus.textContent = "Minimum deposit is 1 USD.";
    return;
  }

  try {
    const data = await postJson("/api/create-intasend-stk-push", {
      amount: usdAmount * kesRate,
      usd_amount: usdAmount,
      account_id: state.currentUser.accountId,
      phone_number: depositPhone.value.trim(),
      email: depositEmail.value.trim() || state.currentUser.email,
    });

    state.pendingDeposit = {
      apiRef: data.api_ref,
      usdAmount,
      accountId: state.currentUser.accountId,
    };
    checkDeposit.hidden = false;
    depositStatus.textContent = data.message || "STK push sent to your phone.";
    startDepositPolling();
    saveState();
  } catch (error) {
    depositStatus.textContent = error.message;
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
    const data = await getJson(`/api/deposit-status?api_ref=${encodeURIComponent(state.pendingDeposit.apiRef)}`);
    if (data.confirmed && !data.credited) {
      const claim = await postJson("/api/claim-deposit", {
        api_ref: state.pendingDeposit.apiRef,
        account_id: state.currentUser.accountId,
      });
      state.pendingDeposit = null;
      stopDepositPolling();
      state.realBalance = Number(claim.user?.realBalance || state.realBalance + Number(claim.usd_amount || 0));
      state.accountMode = "real";
      renderAccountUI();
      depositStatus.textContent = claim.message || "Deposit credited.";
      showToast("Deposit confirmed", `${formatMoney(Number(claim.usd_amount || 0))} added to Real balance.`, "win", 1800);
      checkDeposit.hidden = true;
      addTransaction({
        type: "deposit",
        amount: Number(claim.usd_amount || 0),
        status: "completed",
        accountType: "Real",
        balanceAfter: state.realBalance,
      });
      syncLocalUserFromState();
      saveState();
    } else if (data.credited) {
      state.pendingDeposit = null;
      stopDepositPolling();
      checkDeposit.hidden = true;
      depositStatus.textContent = "Payment already credited.";
      saveState();
    }
  } catch (error) {
    depositStatus.textContent = error.message;
  }
}

async function handleWithdraw(e) {
  e.preventDefault();
  if (!ensureLoggedIn(true)) return;

  if (state.accountMode !== "real") {
    withdrawStatus.textContent = "Switch to Real account before withdrawing.";
    return;
  }

  const amount = Number(withdrawAmount.value || 0);
  if (amount < 5) {
    withdrawStatus.textContent = "Minimum withdrawal is 5 USD.";
    return;
  }
  if (amount > 150000) {
    withdrawStatus.textContent = "Maximum withdrawal is 150000 USD.";
    return;
  }
  if (amount > state.realBalance) {
    withdrawStatus.textContent = "Real balance is not enough.";
    return;
  }

  try {
    const data = await postJson("/api/withdraw", {
      email: state.currentUser.email,
      amount,
      phone: withdrawPhone.value.trim(),
    });
    state.realBalance = Number(data.user?.realBalance ?? state.realBalance - amount);
    withdrawStatus.textContent = data.message || "Withdrawal request received.";
    addTransaction(data.transaction || {
      type: "withdrawal",
      amount,
      status: "pending",
      accountType: "Real",
      balanceAfter: state.realBalance,
    });
    renderAccountUI();
    syncLocalUserFromState();
    saveState();
    showToast("Withdrawal requested", `${formatMoney(amount)} was requested from Real balance.`, "info", 1800);
  } catch (error) {
    withdrawStatus.textContent = error.message;
  }
}

function openTransactions() {
  if (!ensureLoggedIn()) return;
  renderTransactions();
  openSheet(transactionsSheet);
}

async function openSettings() {
  if (!ensureLoggedIn()) return;
  renderAccountUI();
  openSheet(settingsSheet);
}

async function handleSettings(e) {
  e.preventDefault();
  state.settings = {
    ...state.settings,
    profileName: settingsName.value.trim(),
    phone: settingsPhone.value.trim(),
    depositPhone: settingsDepositPhone.value.trim(),
    withdrawalPhone: settingsWithdrawalPhone.value.trim(),
    theme: settingsTheme.value,
    chartSpeed: settingsChartSpeed.value,
    realTradingEnabled: settingsRealTrading.value === "true",
    maximumStakeLimit: Math.max(0.3, Number(settingsMaxStake.value || 100)),
    dailyTradeLimit: Math.max(1, Number(settingsDailyLimit.value || 25)),
    notifications: settingsNotifications.value === "true",
    sound: settingsSound.value === "true",
  };

  document.body.dataset.theme = state.settings.theme;
  restartTickTimer();
  renderAccountUI();
  renderTradePanel();
  updatePayoutPreview();

  try {
    if (state.currentUser?.email) {
      const data = await putJson(`/api/settings/${encodeURIComponent(state.currentUser.email)}`, {
        settings: state.settings,
        newPassword: settingsPassword.value.trim() || undefined,
      });
      if (data.user) {
        state.currentUser = { ...state.currentUser, ...data.user };
      }
    }
    settingsStatus.textContent = "Settings saved.";
  } catch (error) {
    settingsStatus.textContent = `Saved on this browser. ${error.message}`;
  }

  syncLocalUserFromState();
  saveState();
}

async function openPartner() {
  if (!ensureLoggedIn()) return;
  openSheet(partnerSheet);
  partnerDashboard.hidden = true;
  partnerStatus.textContent = "Open a partner account to unlock referral features.";
  try {
    const data = await getJson(`/api/partner/${encodeURIComponent(state.currentUser.email)}`);
    renderPartnerDashboard(data);
  } catch {}
}

function renderPartnerDashboard(data) {
  if (!data?.partner) return;
  partnerDashboard.hidden = false;
  partnerReferralLink.value = data.partner.referralLink || "";
  const stats = data.stats || {};
  partnerStats.innerHTML = [
    ["Total referred users", stats.totalReferredUsers || 0],
    ["Active real traders", stats.activeRealTraders || 0],
    ["Total real deposits", formatMoney(stats.totalRealDeposits || 0)],
    ["Total real trade volume", formatMoney(stats.totalRealTradeVolume || 0)],
    ["Commission earned", formatMoney(stats.totalCommissionEarned || 0)],
    ["Pending commission", formatMoney(stats.pendingCommission || 0)],
    ["Paid commission", formatMoney(stats.paidCommission || 0)],
  ].map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("");
  partnerStatus.textContent = "Partner dashboard is active.";
}

async function handlePartnerApply() {
  if (!ensureLoggedIn()) return;
  try {
    const data = await postJson("/api/partner/apply", { email: state.currentUser.email });
    renderPartnerDashboard({ partner: data.partner, stats: {} });
    partnerStatus.textContent = data.message || "Partner account opened.";
  } catch (error) {
    partnerStatus.textContent = error.message;
  }
}

async function copyReferral() {
  if (!partnerReferralLink.value) return;
  try {
    await navigator.clipboard.writeText(partnerReferralLink.value);
    partnerStatus.textContent = "Referral link copied.";
  } catch {
    partnerReferralLink.select();
    partnerStatus.textContent = "Referral link selected. Copy it manually.";
  }
}

function resetBot() {
  state.bot.running = false;
  state.bot.baseStake = Number(botStake.value || 0.3);
  state.bot.currentStake = Number(botStake.value || 0.3);
  state.bot.netProfit = 0;
  state.bot.level = 0;
  state.bot.history = [];
  renderBot();
  saveState();
}

function stopBot(message = "Bot is not running") {
  state.bot.running = false;
  botBottomStatus.textContent = message;
  renderBot();
  saveState();
}

function chooseBotDirection() {
  const d = botDirection.value;
  if (d !== "Auto") return d;
  const t = botTradeType.value;
  if (t === "Rise/Fall") return Math.random() > 0.5 ? "Rise" : "Fall";
  if (t === "Even/Odd") return Math.random() > 0.5 ? "Even" : "Odd";
  if (t === "Over/Under") return Math.random() > 0.5 ? "Over" : "Under";
  if (t === "Matches/Differs") return Math.random() > 0.35 ? "Differs" : "Matches";
  if (t === "Touch/No Touch") return Math.random() > 0.35 ? "No Touch" : "Touch";
  return "Even";
}

function runBotTrade() {
  if (!state.bot.running || state.openTrades.length) return;
  if (!ensureLoggedIn(state.accountMode === "real")) {
    stopBot("Login required");
    return;
  }

  state.activeTradeType = botTradeType.value;
  state.selectedDigit = clamp(botBarrier.value, 0, 9);
  state.barrierDigit = clamp(botBarrier.value, 0, 9);
  stakeInput.value = String(state.bot.currentStake);
  ticksInput.value = String(clamp(botDuration.value, 1, 10));
  renderTradePanel();
  renderDigits(tickData[tickData.length - 1]?.digit || 0);

  const choice = chooseBotDirection();
  placeTrade(choice);
}

function startBot() {
  if (!ensureLoggedIn(state.accountMode === "real")) return;
  state.bot.running = true;
  state.bot.baseStake = Math.max(0.3, Number(botStake.value || 0.3));
  state.bot.currentStake = state.bot.currentStake || state.bot.baseStake;
  renderBot();
  runBotTrade();
}

function scanAI() {
  const markets = Object.keys(marketConfigs);
  const types = Object.keys(tradeChoices);
  aiSuggestion = {
    market: markets[Math.floor(Math.random() * markets.length)],
    tradeType: types[Math.floor(Math.random() * types.length)],
    digit: Math.floor(Math.random() * 10),
    confidence: Math.floor(60 + Math.random() * 30),
  };

  aiMarket.textContent = marketConfigs[aiSuggestion.market].label;
  aiTrade.textContent = aiSuggestion.tradeType;
  aiBarrier.textContent = String(aiSuggestion.digit);
  aiConfidence.textContent = `${aiSuggestion.confidence}%`;
  aiReason.textContent = "AI scanned recent synthetic movement, digit pressure, and short-term momentum.";
}

function applyAIToTrade() {
  if (!aiSuggestion) scanAI();
  setMarket(aiSuggestion.market);
  state.activeTradeType = aiSuggestion.tradeType;
  state.selectedDigit = aiSuggestion.digit;
  state.barrierDigit = aiSuggestion.digit;
  state.activeChoice = tradeChoices[state.activeTradeType][0];
  renderTradePanel();
  renderDigits(tickData[tickData.length - 1]?.digit || 0);
  saveState();
  showToast("AI applied", `${aiSuggestion.tradeType} loaded on trade panel.`, "info");
}

function restartTickTimer() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(nextTick, getSpeedMs());
}

function bindEvents() {
  tabButtons.forEach((btn) => btn.addEventListener("click", () => setActiveTab(btn.dataset.tab)));

  getStartedButton.addEventListener("click", () => openAuth("register"));
  loginButton.addEventListener("click", () => openAuth("login"));
  closeAuth.addEventListener("click", () => closeSheet(authSheet));
  registerTab.addEventListener("click", () => setAuthMode("register"));
  loginTab.addEventListener("click", () => setAuthMode("login"));
  registerForm.addEventListener("submit", handleRegister);
  loginForm.addEventListener("submit", handleLogin);
  forgotPasswordButton.addEventListener("click", handleForgotPassword);

  accountModeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!ensureLoggedIn()) return;
      state.accountMode = btn.dataset.accountMode;
      renderAccountUI();
      saveState();
    });
  });

  logoutButton.addEventListener("click", logout);

  $$(".trade-type").forEach((btn) => btn.addEventListener("click", () => handleTradeTypeClick(btn)));

  choiceRow.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-choice]");
    if (!btn) return;
    placeTrade(btn.dataset.choice);
  });

  digitFrequency.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-digit]");
    if (!btn) return;
    setDigitTarget(Number(btn.dataset.digit));
  });

  stakeInput.addEventListener("input", updatePayoutPreview);
  ticksInput.addEventListener("input", () => {
    ticksInput.value = String(clamp(ticksInput.value, 1, 10));
    updatePayoutPreview();
  });

  $$(".quick-stakes button").forEach((btn) => btn.addEventListener("click", () => {
    stakeInput.value = btn.dataset.stake;
    updatePayoutPreview();
  }));

  $$(".quick-ticks button").forEach((btn) => btn.addEventListener("click", () => {
    ticksInput.value = btn.dataset.ticks;
    updatePayoutPreview();
  }));

  marketSelector.addEventListener("click", () => openSheet(marketSheet));
  closeMarket.addEventListener("click", () => closeSheet(marketSheet));
  marketSheet.addEventListener("click", (e) => {
    if (e.target === marketSheet) closeSheet(marketSheet);
    const btn = e.target.closest(".market-option");
    if (!btn) return;
    setMarket(btn.dataset.market);
    closeSheet(marketSheet);
  });

  lineModeButton.addEventListener("click", () => {
    state.chartMode = "line";
    lineModeButton.classList.add("active");
    candleModeButton.classList.remove("active");
    drawAllCharts();
    saveState();
  });

  candleModeButton.addEventListener("click", () => {
    state.chartMode = "candles";
    candleModeButton.classList.add("active");
    lineModeButton.classList.remove("active");
    drawAllCharts();
    saveState();
  });

  $$('[data-speed]').forEach((btn) => btn.addEventListener("click", () => {
    state.settings.chartSpeed = btn.dataset.speed;
    $$('[data-speed]').forEach((x) => x.classList.toggle("active", x === btn));
    restartTickTimer();
    saveState();
  }));

  depositButton.addEventListener("click", openDeposit);
  closeDeposit.addEventListener("click", () => closeSheet(depositSheet));
  depositSheet.addEventListener("click", (e) => { if (e.target === depositSheet) closeSheet(depositSheet); });
  depositAmount.addEventListener("input", updateMpesaPreview);
  depositForm.addEventListener("submit", handleDeposit);
  checkDeposit.addEventListener("click", checkPendingDeposit);

  withdrawButton.addEventListener("click", openWithdraw);
  closeWithdraw.addEventListener("click", () => closeSheet(withdrawSheet));
  withdrawSheet.addEventListener("click", (e) => { if (e.target === withdrawSheet) closeSheet(withdrawSheet); });
  withdrawForm.addEventListener("submit", handleWithdraw);

  transactionsMenuButton.addEventListener("click", openTransactions);
  closeTransactions.addEventListener("click", () => closeSheet(transactionsSheet));
  transactionsSheet.addEventListener("click", (e) => { if (e.target === transactionsSheet) closeSheet(transactionsSheet); });

  settingsMenuButton.addEventListener("click", openSettings);
  closeSettings.addEventListener("click", () => closeSheet(settingsSheet));
  settingsSheet.addEventListener("click", (e) => { if (e.target === settingsSheet) closeSheet(settingsSheet); });
  settingsForm.addEventListener("submit", handleSettings);

  partnerMenuButton.addEventListener("click", openPartner);
  closePartner.addEventListener("click", () => closeSheet(partnerSheet));
  partnerSheet.addEventListener("click", (e) => { if (e.target === partnerSheet) closeSheet(partnerSheet); });
  applyPartnerButton.addEventListener("click", handlePartnerApply);
  copyReferralButton.addEventListener("click", copyReferral);
  partnerWithdrawButton.addEventListener("click", () => {
    partnerStatus.textContent = "Partner commission withdrawal will use the backend payout process.";
  });

  aiFloatButton.addEventListener("click", () => {
    scanAI();
    openSheet(aiSheet);
  });
  closeAiPanel.addEventListener("click", () => closeSheet(aiSheet));
  aiSheet.addEventListener("click", (e) => { if (e.target === aiSheet) closeSheet(aiSheet); });
  aiApplyButton.addEventListener("click", applyAIToTrade);
  aiStartButton.addEventListener("click", () => {
    applyAIToTrade();
    state.bot.running = true;
    runBotTrade();
    closeSheet(aiSheet);
  });

  botRunButton.addEventListener("click", startBot);
  botStopButton.addEventListener("click", () => stopBot("Bot stopped"));
  botResetButton.addEventListener("click", resetBot);

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => setActiveTab("menu"));
  }
}

function init() {
  loadState();
  document.body.dataset.theme = state.settings.theme;
  if (!marketConfigs[state.market]) state.market = "Meta Volatility 100";
  if (!tradeChoices[state.activeTradeType]) state.activeTradeType = "Even/Odd";
  if (!tradeChoices[state.activeTradeType].includes(state.activeChoice)) {
    state.activeChoice = tradeChoices[state.activeTradeType][0];
  }

  generateInitialMarketData();
  renderMarket();
  renderAccountUI();
  renderTradePanel();
  updatePayoutPreview();
  renderDigits(tickData[tickData.length - 1]?.digit || 0);
  renderHistory();
  renderOpenTrades();
  renderTransactions();
  renderBot();
  drawAllCharts();

  if (state.chartMode === "candles") {
    candleModeButton.classList.add("active");
    lineModeButton.classList.remove("active");
  }

  $$('[data-speed]').forEach((btn) => btn.classList.toggle("active", btn.dataset.speed === state.settings.chartSpeed));

  bindEvents();
  restartTickTimer();
  if (state.pendingDeposit?.apiRef) startDepositPolling();
}

init();
