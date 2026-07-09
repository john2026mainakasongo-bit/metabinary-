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
  "Matches/Differs": "Tap a digit first, then choose Matches or Differs.",
  "Over/Under": "Tap a digit first, then choose Over or Under.",
  "Rise/Fall": "Choose Rise or Fall. Settlement uses the next market movement.",
  "Touch/No Touch": "Tap a target digit first, then choose Touch or No Touch.",
};

const STORAGE_KEY = "metabinary-v10-state";
const LOCAL_USERS_KEY = "metabinary-v10-users";
const KES_RATE = 130;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

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

const elements = {
  guestActions: $("#guestActions"),
  accountToolbar: $("#accountToolbar"),
  balance: $("#balance"),
  accountLabel: $("#accountLabel"),

  marketName: $("#marketName"),
  marketDescription: $("#marketDescription"),
  quoteText: $("#quoteText"),

  digitQuote: $("#digitQuote"),
  digitMove: $("#digitMove"),
  digitFrequency: $("#digitFrequency"),
  digitCursor: $("#digitCursor"),

  selectedTrade: $("#selectedTrade"),
  tradeHint: $("#tradeHint"),
  payoutQuote: $("#payoutQuote"),
  choiceRow: $("#choiceRow"),
  stakeInput: $("#stakeInput"),
  ticksInput: $("#ticksInput"),
  maxStakeLabel: $("#maxStakeLabel"),
  targetText: $("#targetText"),
  tradeStatus: $("#tradeStatus"),

  openTradesList: $("#openTradesList"),
  openTradeCount: $("#openTradeCount"),
  historyList: $("#historyList"),
  historyCount: $("#historyCount"),

  toastStack: $("#toastStack"),

  chartCanvas: $("#chartCanvas"),
  chartCanvasLarge: $("#chartCanvasLarge"),

  chartOpenValue: $("#chartOpenValue"),
  chartHighValue: $("#chartHighValue"),
  chartLowValue: $("#chartLowValue"),
  chartCloseValue: $("#chartCloseValue"),
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

  if (state.accountMode === "real") {
    state.realBalance = clean;
  } else {
    state.demoBalance = clean;
  }
}

function getSpeedMs() {
  if (state.settings.chartSpeed === "fast") return 900;
  if (state.settings.chartSpeed === "slow") return 2500;
  return 1500;
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
      settings: {
        ...state.settings,
        ...(stored.settings || {}),
      },
      bot: {
        ...state.bot,
        ...(stored.bot || {}),
      },
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
      withdrawalPhone: data.phone.trim(),
    },
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
      settings: state.settings,
    };

    saveLocalUsers(users);
  }
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body || {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed.");
  }

  return data;
}

async function getJson(url) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed.");
  }

  return data;
}

async function putJson(url, body) {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body || {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed.");
  }

  return data;
}

function showToast(title, text, type = "info", timeout = 1600) {
  if (!state.settings.notifications) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <strong>${title}</strong>
    <span>${text}</span>
  `;

  elements.toastStack.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, timeout);
}

function openSheet(sheet) {
  if (!sheet) return;
  sheet.classList.add("open");
}

function closeSheet(sheet) {
  if (!sheet) return;
  sheet.classList.remove("open");
}

function requireLogin() {
  if (!state.currentUser) {
    openAuth("register");
    $("#authStatus").textContent = "Create an account and login first.";
    return false;
  }

  return true;
}

function renderAccountUI() {
  const loggedIn = Boolean(state.currentUser);

  elements.guestActions.hidden = loggedIn;
  elements.accountToolbar.hidden = !loggedIn;
  $("#aiFloatButton").hidden = !loggedIn;

  if (!loggedIn) {
    elements.tradeStatus.textContent = "Create an account and login to unlock Demo and Real trading.";

    $("#summaryName").textContent = "Guest";
    $("#summaryEmail").textContent = "-";
    $("#summaryPhone").textContent = "-";
    $("#summaryAccountId").textContent = "-";
    $("#summaryStatus").textContent = "Guest";

    return;
  }

  $$(".account-mode").forEach((button) => {
    button.classList.toggle("active", button.dataset.accountMode === state.accountMode);
  });

  elements.accountLabel.textContent = state.accountMode === "real" ? "Real USD" : "Demo USD";
  elements.balance.textContent = formatMoney(currentBalance());

  $("#summaryName").textContent = state.currentUser.fullName || "-";
  $("#summaryEmail").textContent = state.currentUser.email || "-";
  $("#summaryPhone").textContent = state.currentUser.phone || "-";
  $("#summaryAccountId").textContent = state.accountMode === "real" ? state.currentUser.accountId : "No ID on Demo";
  $("#summaryStatus").textContent = state.accountMode === "real" ? "Real Account" : "Demo Account";

  fillSettingsForm();

  elements.maxStakeLabel.textContent = formatMoney(state.settings.maximumStakeLimit || 100);
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

function renderMarket() {
  const market = marketConfigs[state.market];

  elements.marketName.textContent = market.label;
  elements.marketDescription.textContent = `${state.market.replace("Meta ", "")} synthetic market`;

  $$(".market-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.market === state.market);
  });
}

function getTargetMeta() {
  if (state.activeTradeType === "Over/Under") {
    return `Barrier ${state.barrierDigit}`;
  }

  if (state.activeTradeType === "Matches/Differs" || state.activeTradeType === "Touch/No Touch") {
    return `Target digit ${state.selectedDigit}`;
  }

  return "Auto settlement";
}

function getPayoutRate(tradeType = state.activeTradeType, choice = state.activeChoice) {
  if (tradeType === "Matches/Differs") {
    return choice === "Matches" ? 8.333 : 1.087;
  }

  if (tradeType === "Touch/No Touch") {
    return choice === "Touch" ? 5.2 : 1.16;
  }

  if (tradeType === "Rise/Fall") {
    return 1.92;
  }

  if (tradeType === "Even/Odd") {
    return 1.88;
  }

  if (tradeType === "Over/Under") {
    const wins = choice === "Over"
      ? Math.max(0, 9 - state.barrierDigit)
      : Math.max(0, state.barrierDigit);

    if (!wins) return 0;

    return clamp((10 / wins) * 0.88, 1.05, 8.8);
  }

  return 1.88;
}

function renderTradePanel() {
  elements.selectedTrade.textContent = state.activeTradeType;
  elements.tradeHint.textContent = `${tradeHints[state.activeTradeType]} ${getTargetMeta()}`;

  elements.targetText.innerHTML = state.activeTradeType === "Over/Under"
    ? `Barrier digit: <b>${state.barrierDigit}</b>`
    : `Target digit: <b>${state.selectedDigit}</b>`;

  const buttons = tradeChoices[state.activeTradeType].map((choice, index) => {
    const rate = getPayoutRate(state.activeTradeType, choice);
    const stake = Number(elements.stakeInput.value || 0);
    const profit = Math.max(0, stake * rate - stake);

    return `
      <button class="choice-button ${index === 0 ? "buyish" : "sellish"}" type="button" data-choice="${choice}">
        <span>${choice}</span>
        <div>
          <strong>${Math.max(0, (rate - 1) * 100).toFixed(2)}%</strong>
          <small>${formatMoney(profit)} profit</small>
        </div>
      </button>
    `;
  });

  elements.choiceRow.innerHTML = buttons.join("");

  $$(".trade-type").forEach((button) => {
    button.classList.toggle("selected", button.dataset.tradeType === state.activeTradeType);
  });

  updatePayoutPreview();
}

function updatePayoutPreview() {
  const stake = Number(elements.stakeInput.value || 0);
  const rate = getPayoutRate();
  const payout = stake * rate;
  const profit = Math.max(0, payout - stake);

  elements.payoutQuote.textContent = `${formatMoney(payout)} payout · ${formatMoney(profit)} profit`;
  elements.maxStakeLabel.textContent = formatMoney(state.settings.maximumStakeLimit || 100);

  if (stake < 0.3) {
    elements.tradeStatus.textContent = "Minimum stake is 0.30 USD.";
  } else if (stake > Number(state.settings.maximumStakeLimit || 100)) {
    elements.tradeStatus.textContent = `Maximum stake is ${formatMoney(state.settings.maximumStakeLimit || 100)}.`;
  }
}

function generateInitialData() {
  const base = marketConfigs[state.market].base;

  tickData = [];
  candleData = [];

  let price = base;
  let open = base;

  for (let index = 0; index < 80; index += 1) {
    const move = (Math.random() - 0.5) * marketConfigs[state.market].volatility;

    price = Number((price + move).toFixed(2));

    tickData.push({
      quote: price,
      digit: Math.abs(Math.floor(price * 100)) % 10,
      move,
    });

    if (index % 4 === 0) {
      open = price;
    }

    if (index % 4 === 3) {
      const slice = tickData.slice(index - 3, index + 1).map((item) => item.quote);

      candleData.push({
        open,
        high: Math.max(...slice),
        low: Math.min(...slice),
        close: price,
      });
    }
  }
}

function updateQuoteUI(tick, previousTick) {
  if (!tick) return;

  const move = previousTick ? Number((tick.quote - previousTick.quote).toFixed(2)) : tick.move || 0;

  elements.quoteText.textContent = formatQuote(tick.quote);
  elements.digitQuote.textContent = formatQuote(tick.quote);
  elements.digitMove.textContent = `${move >= 0 ? "+" : ""}${move.toFixed(2)}`;
  elements.digitMove.classList.toggle("down", move < 0);

  const recent = tickData.slice(-25).map((item) => item.quote);

  if (recent.length) {
    elements.chartOpenValue.textContent = formatQuote(recent[0]);
    elements.chartHighValue.textContent = formatQuote(Math.max(...recent));
    elements.chartLowValue.textContent = formatQuote(Math.min(...recent));
    elements.chartCloseValue.textContent = formatQuote(recent[recent.length - 1]);
  }
}

function nextTick() {
  const previous = tickData[tickData.length - 1] || { quote: marketConfigs[state.market].base };
  const volatility = marketConfigs[state.market].volatility;

  const drift = (Math.random() - 0.5) * volatility;
  const noise = (Math.random() - 0.5) * volatility * 0.35;

  const quote = Number((previous.quote + drift + noise).toFixed(2));
  const move = Number((quote - previous.quote).toFixed(2));
  const digit = Math.abs(Math.floor(quote * 100)) % 10;

  const tick = {
    quote,
    move,
    digit,
  };

  tickData.push(tick);

  if (tickData.length > 120) {
    tickData.shift();
  }

  const candleIndex = tickData.length % 4;
  const lastCandle = candleData[candleData.length - 1];

  if (!lastCandle || candleIndex === 1) {
    candleData.push({
      open: quote,
      high: quote,
      low: quote,
      close: quote,
    });
  } else {
    lastCandle.high = Math.max(lastCandle.high, quote);
    lastCandle.low = Math.min(lastCandle.low, quote);
    lastCandle.close = quote;
  }

  if (candleData.length > 60) {
    candleData.shift();
  }

  const recentDigits = tickData.slice(-40).map((item) => item.digit);

  digitStats = Array.from({ length: 10 }, (_, digit) => {
    const count = recentDigits.filter((item) => item === digit).length;
    return Number(((count / recentDigits.length) * 100 || 0).toFixed(1));
  });

  updateQuoteUI(tick, previous);
  settleOpenTrades(tick, previous);
  renderDigits(tick.digit);
  drawCharts();

  if (state.bot.running && !state.openTrades.length) {
    runBotTrade();
  }
}

function drawChart(canvas, mode = state.chartMode) {
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  canvas.width = Math.max(320, Math.floor(rect.width * devicePixelRatio));
  canvas.height = Math.max(220, Math.floor(rect.height * devicePixelRatio));

  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  const width = rect.width;
  const height = rect.height;

  context.clearRect(0, 0, width, height);

  const padding = {
    left: 22,
    right: 22,
    top: 18,
    bottom: 26,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  context.strokeStyle = "rgba(255,255,255,0.08)";
  context.lineWidth = 1;

  for (let index = 0; index <= 5; index += 1) {
    const y = padding.top + (chartHeight / 5) * index;

    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
  }

  const source = mode === "candles" ? candleData : tickData;

  if (!source.length) return;

  const values = mode === "candles"
    ? source.flatMap((item) => [item.high, item.low])
    : source.map((item) => item.quote);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(0.01, max - min);

  if (mode === "line") {
    context.beginPath();

    source.forEach((point, index) => {
      const x = padding.left + (index / Math.max(1, source.length - 1)) * chartWidth;
      const y = padding.top + ((max - point.quote) / range) * chartHeight;

      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });

    context.lineWidth = 3;
    context.strokeStyle = "#28d8ca";
    context.stroke();

    const last = source[source.length - 1];
    const x = padding.left + chartWidth;
    const y = padding.top + ((max - last.quote) / range) * chartHeight;

    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.fillStyle = "#71ffd4";
    context.fill();
  } else {
    const candleWidth = Math.max(4, (chartWidth / Math.max(25, source.length)) * 0.55);

    source.forEach((candle, index) => {
      const x = padding.left + (index / Math.max(1, source.length - 1)) * chartWidth;
      const openY = padding.top + ((max - candle.open) / range) * chartHeight;
      const closeY = padding.top + ((max - candle.close) / range) * chartHeight;
      const highY = padding.top + ((max - candle.high) / range) * chartHeight;
      const lowY = padding.top + ((max - candle.low) / range) * chartHeight;

      const green = candle.close >= candle.open;

      context.strokeStyle = green ? "#2ee66b" : "#ff4258";
      context.fillStyle = green ? "#2ee66b" : "#ff4258";
      context.lineWidth = 1.4;

      context.beginPath();
      context.moveTo(x, highY);
      context.lineTo(x, lowY);
      context.stroke();

      const top = Math.min(openY, closeY);
      const bodyHeight = Math.max(3, Math.abs(closeY - openY));

      context.fillRect(x - candleWidth / 2, top, candleWidth, bodyHeight);
    });
  }

  context.fillStyle = "rgba(255,255,255,0.75)";
  context.font = "12px Arial";
  context.fillText(formatQuote(max), 4, 14);
  context.fillText(formatQuote(min), 4, height - 8);
}

function drawCharts() {
  drawChart(elements.chartCanvas, state.chartMode);
  drawChart(elements.chartCanvasLarge, state.chartMode);
}

function getHighLowDigits() {
  const highest = digitStats.indexOf(Math.max(...digitStats));
  const lowest = digitStats.indexOf(Math.min(...digitStats));

  return {
    highest,
    lowest,
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

    const isBarrier = state.activeTradeType === "Over/Under" && state.barrierDigit === digit;

    const stroke = isHighest ? "#2ee66b" : isLowest ? "#ff4258" : "#d2d9e2";
    const strokeWidth = isHighest ? 8 : isLowest ? 5 : 6;

    const circumference = 2 * Math.PI * 28;
    const dash = (clamp(percent, 0, 100) / 100) * circumference;

    const classes = [
      "digit-tile",
      isTarget ? "selected-target" : "",
      isBarrier ? "selected-barrier" : "",
    ].filter(Boolean).join(" ");

    return `
      <div class="${classes}" data-digit-wrapper="${digit}">
        <button type="button" data-digit="${digit}">
          <svg class="digit-svg" viewBox="0 0 84 84" aria-hidden="true">
            <circle cx="42" cy="42" r="28" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="6"></circle>
            <circle
              cx="42"
              cy="42"
              r="28"
              fill="none"
              stroke="${stroke}"
              stroke-width="${strokeWidth}"
              stroke-linecap="round"
              transform="rotate(-90 42 42)"
              stroke-dasharray="${dash} ${circumference}">
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
  const wrapper = elements.digitFrequency.querySelector(`[data-digit-wrapper="${digit}"]`);

  if (!wrapper) return;

  const gridBox = elements.digitFrequency.getBoundingClientRect();
  const wrapperBox = wrapper.getBoundingClientRect();

  const x = wrapperBox.left - gridBox.left + wrapperBox.width / 2 - 9;

  elements.digitCursor.style.transform = `translateX(${x}px)`;
}

function renderOpenTrades() {
  elements.openTradeCount.textContent = String(state.openTrades.length);

  if (!state.openTrades.length) {
    elements.openTradesList.innerHTML = `<p class="empty">No open trades.</p>`;
    return;
  }

  elements.openTradesList.innerHTML = state.openTrades.map((trade) => `
    <div class="item">
      <div class="item-top">
        <strong>${trade.choice} · ${trade.tradeType}</strong>
        <span class="amount">${formatMoney(trade.stake)}</span>
      </div>
      <div class="meta">${trade.market} · ${trade.meta} · ${trade.remaining} ticks left</div>
    </div>
  `).join("");
}

function renderHistory() {
  elements.historyCount.textContent = String(state.tradeHistory.length);

  if (!state.tradeHistory.length) {
    elements.historyList.innerHTML = `<p class="empty">No trades yet.</p>`;
    return;
  }

  elements.historyList.innerHTML = state.tradeHistory.slice(0, 12).map((trade) => `
    <div class="item">
      <div class="item-top">
        <strong>${trade.choice} · ${trade.tradeType}</strong>
        <span class="amount ${trade.won ? "" : "loss"}">${trade.won ? "+" : "-"}${formatMoney(Math.abs(trade.profit))}</span>
      </div>
      <div class="meta">${trade.market} · Stake ${formatMoney(trade.stake)} · Digit ${trade.digit} · ${new Date(trade.createdAt).toLocaleTimeString()}</div>
    </div>
  `).join("");
}

function renderTransactions() {
  const list = $("#transactionList");

  if (!state.transactionHistory.length) {
    list.innerHTML = `<p class="empty">No transactions yet.</p>`;
    return;
  }

  list.innerHTML = state.transactionHistory.slice(0, 100).map((item) => `
    <div class="item">
      <div class="item-top">
        <strong>${item.type} · ${item.status}</strong>
        <span class="amount ${item.status === "loss" ? "loss" : ""}">${item.type === "trade" ? formatMoney(item.profit || 0) : formatMoney(item.amount || 0)}</span>
      </div>
      <div class="meta">${item.accountType || "Account"} · Bal ${formatMoney(item.balanceAfter || 0)} · ${new Date(item.createdAt).toLocaleString()} · ${item.reference || ""}</div>
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
    list.innerHTML = `<p class="empty">No bot trades yet.</p>`;
    return;
  }

  list.innerHTML = state.bot.history.slice(0, 20).map((item) => `
    <div class="item">
      <div class="item-top">
        <strong>${item.tradeType}</strong>
        <span class="amount ${item.won ? "" : "loss"}">${item.won ? "WIN" : "LOSS"}</span>
      </div>
      <div class="meta">${item.market} · Stake ${formatMoney(item.stake)}</div>
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
  updatePayoutPreview();
  drawCharts();
}

function addTransaction(record) {
  state.transactionHistory.unshift({
    reference: createId("txn"),
    createdAt: new Date().toISOString(),
    ...record,
  });

  state.transactionHistory = state.transactionHistory.slice(0, 100);

  renderTransactions();
}

function placeTrade(choice) {
  if (!requireLogin()) return;

  const stake = Number(elements.stakeInput.value || 0);
  const ticks = Math.floor(Number(elements.ticksInput.value || 0));

  if (state.accountMode === "real" && !state.settings.realTradingEnabled) {
    elements.tradeStatus.textContent = "Real trading is disabled in Settings. Enable it first.";
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

  if (ticks < 1 || ticks > 10) {
    elements.tradeStatus.textContent = "Ticks should be between 1 and 10.";
    return;
  }

  if (stake > currentBalance()) {
    elements.tradeStatus.textContent = "Balance is not enough for this trade.";
    return;
  }

  const rate = getPayoutRate(state.activeTradeType, choice);

  if (!rate) {
    elements.tradeStatus.textContent = "This contract has no winning range. Select another target digit or barrier.";
    return;
  }

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
    createdAt: new Date().toISOString(),
    meta: getTargetMeta(),
  };

  state.openTrades.unshift(trade);

  elements.tradeStatus.textContent = `${choice} trade opened for ${formatMoney(stake)} on ${state.activeTradeType}.`;

  addTransaction({
    type: "trade-open",
    amount: stake,
    status: "open",
    accountType: state.accountMode === "real" ? "Real" : "Demo",
    balanceAfter: currentBalance(),
  });

  showToast("Trade opened", `${choice} · ${state.activeTradeType} · Stake ${formatMoney(stake)}`, "info", 1200);

  renderAll();
  saveState();
}

function tradeWins(trade, tick, previousTick) {
  if (trade.tradeType === "Even/Odd") {
    return trade.choice === "Even" ? tick.digit % 2 === 0 : tick.digit % 2 === 1;
  }

  if (trade.tradeType === "Rise/Fall") {
    const oldQuote = previousTick?.quote ?? trade.entryQuote;
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

  setTimeout(() => {
    tile.classList.remove("result-win", "result-loss");
  }, 1000);
}

function settleOpenTrades(tick, previousTick) {
  if (!state.openTrades.length) return;

  const settled = [];

  state.openTrades.forEach((trade) => {
    if (tick.digit === trade.targetDigit) {
      trade.touched = true;
    }

    trade.remaining -= 1;

    if (trade.remaining <= 0) {
      settled.push(trade);
    }
  });

  settled.forEach((trade) => {
    const won = tradeWins(trade, tick, previousTick);

    if (won) {
      setCurrentBalance(currentBalance() + trade.payout);
    }

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
      won,
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
      reference: trade.id,
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

    if (state.bot.running) {
      applyBotResult(won, trade, profit);
    }
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
    agreed: $("#registerAgreement").checked,
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
    state.settings = {
      ...state.settings,
      ...(data.user.settings || {}),
    };
  } catch {
    const user = createLocalUser(payload);

    state.currentUser = user;
    state.demoBalance = Number(user.demoBalance || 10000);
    state.realBalance = Number(user.realBalance || 0);
    state.settings = {
      ...state.settings,
      ...(user.settings || {}),
    };
  }

  state.accountMode = "demo";

  closeSheet($("#authSheet"));
  renderAll();
  saveState();

  showToast("Account created", "Demo and Real accounts are now available.", "info", 1800);
}

async function handleLogin(event) {
  event.preventDefault();

  const identifier = $("#loginIdentifier").value.trim();
  const password = $("#loginPassword").value;

  try {
    const data = await postJson("/api/login", {
      identifier,
      password,
    });

    state.currentUser = data.user;
    state.demoBalance = Number(data.user.demoBalance || 10000);
    state.realBalance = Number(data.user.realBalance || 0);
    state.settings = {
      ...state.settings,
      ...(data.user.settings || {}),
    };
  } catch {
    const user = findLocalUser(identifier, password);

    if (!user) {
      $("#authStatus").textContent = "Email/Account ID or password is incorrect.";
      return;
    }

    state.currentUser = user;
    state.demoBalance = Number(user.demoBalance || 10000);
    state.realBalance = Number(user.realBalance || 0);
    state.settings = {
      ...state.settings,
      ...(user.settings || {}),
    };
  }

  state.accountMode = "demo";

  closeSheet($("#authSheet"));
  renderAll();
  saveState();

  showToast("Logged in", "Demo and Real accounts are now available.", "info", 1600);
}

function logout() {
  state.currentUser = null;
  state.accountMode = "demo";
  state.openTrades = [];
  state.pendingDeposit = null;

  renderAll();
  saveState();

  showToast("Logged out", "You have been logged out.", "info", 1400);
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
      email: $("#depositEmail").value.trim() || state.currentUser.email,
    });

    state.pendingDeposit = {
      apiRef: data.api_ref,
      usdAmount,
      accountId: state.currentUser.accountId,
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
  if (depositTimer) {
    clearInterval(depositTimer);
  }

  depositTimer = null;
}

async function checkPendingDeposit() {
  if (!state.pendingDeposit?.apiRef) return;

  try {
    const status = await getJson(`/api/deposit-status?api_ref=${encodeURIComponent(state.pendingDeposit.apiRef)}`);

    if (status.confirmed && !status.credited) {
      const claim = await postJson("/api/claim-deposit", {
        api_ref: state.pendingDeposit.apiRef,
        account_id: state.currentUser.accountId,
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
        balanceAfter: state.realBalance,
      });

      renderAll();
      saveState();

      showToast("Deposit confirmed", `${formatMoney(Number(claim.usd_amount || 0))} added to Real balance.`, "win", 1800);
    } else if (status.credited) {
      state.pendingDeposit = null;
      stopDepositPolling();
      $("#checkDeposit").hidden = true;
      $("#depositStatus").textContent = "Payment already credited.";
      saveState();
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
      phone: $("#withdrawPhone").value.trim(),
    });

    state.realBalance = Number(data.user?.realBalance ?? state.realBalance - amount);

    addTransaction(data.transaction || {
      type: "withdrawal",
      amount,
      status: "pending",
      accountType: "Real",
      balanceAfter: state.realBalance,
    });

    $("#withdrawStatus").textContent = data.message || "Withdrawal request received.";

    renderAll();
    saveState();

    showToast("Withdrawal requested", `${formatMoney(amount)} requested from Real balance.`, "info", 1800);
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
    sound: $("#settingsSound").value === "true",
  };

  restartTickTimer();

  try {
    if (state.currentUser?.email) {
      await putJson(`/api/settings/${encodeURIComponent(state.currentUser.email)}`, {
        settings: state.settings,
        newPassword: $("#settingsPassword").value || undefined,
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
    ["Paid commission", formatMoney(stats.paidCommission || 0)],
  ].map(([label, value]) => `
    <div>
      <span>${label}</span>
      <b>${value}</b>
    </div>
  `).join("");

  $("#partnerStatus").textContent = "Partner dashboard is active.";
}

async function applyPartner() {
  if (!requireLogin()) return;

  try {
    const data = await postJson("/api/partner/apply", {
      email: state.currentUser.email,
    });

    renderPartner({
      partner: data.partner,
      stats: {},
    });

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
    history: [],
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
  const tradeType = $("#botTradeType").value;

  if (direction !== "Auto") return direction;

  if (tradeType === "Rise/Fall") return Math.random() > 0.5 ? "Rise" : "Fall";
  if (tradeType === "Even/Odd") return Math.random() > 0.5 ? "Even" : "Odd";
  if (tradeType === "Over/Under") return Math.random() > 0.5 ? "Over" : "Under";
  if (tradeType === "Matches/Differs") return Math.random() > 0.35 ? "Differs" : "Matches";
  if (tradeType === "Touch/No Touch") return Math.random() > 0.35 ? "No Touch" : "Touch";

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
  elements.ticksInput.value = String(clamp($("#botDuration").value, 1, 10));

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
    won,
  });

  const takeProfit = Number($("#botTakeProfit").value || 0);
  const stopLoss = Number($("#botStopLoss").value || 0);

  if (takeProfit > 0 && state.bot.netProfit >= takeProfit) {
    stopBot("Take profit reached");
  }

  if (stopLoss > 0 && state.bot.netProfit <= -stopLoss) {
    stopBot("Stop loss reached");
  }

  renderBot();
}

function scanAI() {
  const markets = Object.keys(marketConfigs);
  const tradeTypes = Object.keys(tradeChoices);

  aiSuggestion = {
    market: markets[Math.floor(Math.random() * markets.length)],
    tradeType: tradeTypes[Math.floor(Math.random() * tradeTypes.length)],
    digit: Math.floor(Math.random() * 10),
    confidence: Math.floor(60 + Math.random() * 30),
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
  if (tickTimer) {
    clearInterval(tickTimer);
  }

  tickTimer = setInterval(nextTick, getSpeedMs());
}

function bindEvents() {
  $$(".tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".tabs button").forEach((item) => item.classList.toggle("active", item === button));

      const panels = {
        trade: $("#tradePanel"),
        charts: $("#chartsPanel"),
        bot: $("#botPanel"),
        copy: $("#copyPanel"),
        menu: $("#menuPanel"),
      };

      Object.entries(panels).forEach(([name, panel]) => {
        panel.classList.toggle("active-panel", name === button.dataset.tab);
      });

      drawCharts();
    });
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

  $$(".account-mode").forEach((button) => {
    button.addEventListener("click", () => {
      if (!requireLogin()) return;

      state.accountMode = button.dataset.accountMode;

      renderAll();
      saveState();
    });
  });

  $("#logoutButton").addEventListener("click", logout);

  $$(".trade-type").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTradeType = button.dataset.tradeType;
      state.activeChoice = tradeChoices[state.activeTradeType][0];

      renderTradePanel();
      renderDigits(tickData[tickData.length - 1]?.digit || 0);
      saveState();
    });
  });

  elements.choiceRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-choice]");

    if (button) {
      placeTrade(button.dataset.choice);
    }
  });

  elements.digitFrequency.addEventListener("click", (event) => {
    const button = event.target.closest("[data-digit]");

    if (!button) return;

    const value = Number(button.dataset.digit);

    if (state.activeTradeType === "Over/Under") {
      state.barrierDigit = value;
    } else {
      state.selectedDigit = value;
    }

    renderTradePanel();
    renderDigits(tickData[tickData.length - 1]?.digit || 0);
    saveState();
  });

  elements.stakeInput.addEventListener("input", updatePayoutPreview);

  elements.ticksInput.addEventListener("input", () => {
    elements.ticksInput.value = String(clamp(elements.ticksInput.value, 1, 10));
    updatePayoutPreview();
  });

  $$(".quick button[data-stake]").forEach((button) => {
    button.addEventListener("click", () => {
      elements.stakeInput.value = button.dataset.stake;
      updatePayoutPreview();
    });
  });

  $$(".quick button[data-ticks]").forEach((button) => {
    button.addEventListener("click", () => {
      elements.ticksInput.value = button.dataset.ticks;
      updatePayoutPreview();
    });
  });

  $("#marketSelector").addEventListener("click", () => openSheet($("#marketSheet")));
  $("#closeMarket").addEventListener("click", () => closeSheet($("#marketSheet")));

  $("#marketSheet").addEventListener("click", (event) => {
    if (event.target.id === "marketSheet") {
      closeSheet($("#marketSheet"));
    }

    const button = event.target.closest(".market-option");

    if (button) {
      setMarket(button.dataset.market);
      closeSheet($("#marketSheet"));
    }
  });

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
      $("#partnerReferralLink").select();
      $("#partnerStatus").textContent = "Referral link selected. Copy it manually.";
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
}

function init() {
  loadState();

  if (!marketConfigs[state.market]) {
    state.market = "Meta Volatility 100";
  }

  if (!tradeChoices[state.activeTradeType]) {
    state.activeTradeType = "Even/Odd";
  }

  if (!tradeChoices[state.activeTradeType].includes(state.activeChoice)) {
    state.activeChoice = tradeChoices[state.activeTradeType][0];
  }

  generateInitialData();
  renderMarket();
  renderAll();
  renderDigits(tickData[tickData.length - 1]?.digit || 0);
  updateQuoteUI(tickData[tickData.length - 1], tickData[tickData.length - 2]);
  drawCharts();
  bindEvents();
  restartTickTimer();

  if (state.pendingDeposit?.apiRef) {
    startDepositPolling();
  }
}

init();
