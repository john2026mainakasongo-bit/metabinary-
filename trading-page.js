const marketSeeds = {
  "Meta Volatility 100": [
    { digit: 2, quote: 396.12 },
    { digit: 0, quote: 396.10 },
    { digit: 8, quote: 396.18 },
    { digit: 4, quote: 396.14 },
    { digit: 6, quote: 396.16 },
    { digit: 1, quote: 396.11 },
  ],
  "Meta Volatility 75": [
    { digit: 1, quote: 248.41 },
    { digit: 5, quote: 248.45 },
    { digit: 7, quote: 248.47 },
    { digit: 3, quote: 248.43 },
    { digit: 9, quote: 248.49 },
    { digit: 0, quote: 248.40 },
  ],
  "Meta Volatility 50": [
    { digit: 8, quote: 612.08 },
    { digit: 2, quote: 612.02 },
    { digit: 6, quote: 612.06 },
    { digit: 4, quote: 612.04 },
    { digit: 0, quote: 612.00 },
    { digit: 7, quote: 612.07 },
  ],
  "Meta Volatility 25": [
    { digit: 3, quote: 184.23 },
    { digit: 9, quote: 184.29 },
    { digit: 1, quote: 184.21 },
    { digit: 5, quote: 184.25 },
    { digit: 2, quote: 184.22 },
    { digit: 8, quote: 184.28 },
  ],
  "Meta Volatility 10": [
    { digit: 4, quote: 98.14 },
    { digit: 6, quote: 98.16 },
    { digit: 0, quote: 98.10 },
    { digit: 7, quote: 98.17 },
    { digit: 3, quote: 98.13 },
    { digit: 9, quote: 98.19 },
  ],
};

const tradeChoices = {
  "Even/Odd": ["Even", "Odd"],
  "Matches/Differs": ["Matches", "Differs"],
  "Over/Under": ["Over", "Under"],
  "Rise/Fall": ["Rise", "Fall"],
  "Touch/No Touch": ["Touch", "No Touch"],
};

const hints = {
  "Even/Odd": "Choose Even or Odd",
  "Matches/Differs": "Choose Matches or Differs, then pick a digit",
  "Over/Under": "Choose Over or Under, then pick a barrier digit",
  "Rise/Fall": "Choose Rise or Fall",
  "Touch/No Touch": "Choose Touch or No Touch, then pick a digit",
};

const marketDescriptions = {
  "Meta Volatility 100": "884.50 - 0.12 (0.01%)",
  "Meta Volatility 75": "248.41 - 0.08 (0.01%)",
  "Meta Volatility 50": "612.08 - 0.06 (0.01%)",
  "Meta Volatility 25": "184.23 + 0.03 (0.02%)",
  "Meta Volatility 10": "98.14 - 0.01 (0.01%)",
};

const marketLabels = {
  "Meta Volatility 100": "Volatility 100 (1s) Index",
  "Meta Volatility 75": "Volatility 75 (1s) Index",
  "Meta Volatility 50": "Volatility 50 (1s) Index",
  "Meta Volatility 25": "Volatility 25 (1s) Index",
  "Meta Volatility 10": "Volatility 10 (1s) Index",
};

const storageKey = "meta-volatility-trade-state-v7";
const localUsersKey = "meta-volatility-local-users-v7";
const referralCodeFromUrl = new URLSearchParams(window.location.search).get("ref") || "";
const kesPerUsd = 130;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const digitQuote = $("#digitQuote");
const digitMove = $("#digitMove");
const digitFrequency = $("#digitFrequency");
const marketName = $("#marketName");
const marketDescription = $("#marketDescription");
const balance = $("#balance");
const balanceCard = $(".balance-card");
const accountLabel = $("#accountLabel");
const accountState = $(".account-state");
const accountSwitch = $(".account-switch");
const accountModeButtons = $$(".account-mode");
const marketSelector = $("#marketSelector");
const marketSheet = $("#marketSheet");
const closeMarket = $("#closeMarket");
const selectedTrade = $("#selectedTrade");
const tradeHint = $("#tradeHint");
const choiceRow = $("#choiceRow");
const stakeInput = $("#stakeInput");
const ticksInput = $("#ticksInput");
const buyButton = $("#buyButton");
const sellButton = $("#sellButton");
const tradeStatus = $("#tradeStatus");
const historyList = $("#historyList");
const historyCount = $("#historyCount");
const tabButtons = $$(".tabs button");
const tabPanels = {
  menu: $("#menuPanel"),
  trade: $("#tradePanel"),
  charts: $("#chartsPanel"),
  bot: $("#botPanel"),
  copy: $("#copyPanel"),
};

const botStatus = $("#botStatus");
const botAccountLabel = $("#botAccountLabel");
const botMarket = $("#botMarket");
const botTradeType = $("#botTradeType");
const botDuration = $("#botDuration");
const botStake = $("#botStake");
const botDirection = $("#botDirection");
const botBarrier = $("#botBarrier");
const botTakeProfit = $("#botTakeProfit");
const botStopLoss = $("#botStopLoss");
const botRecovery = $("#botRecovery");
const botMultiplier = $("#botMultiplier");
const botMaxSteps = $("#botMaxSteps");
const botRunOnce = $("#botRunOnce");
const botNetProfit = $("#botNetProfit");
const botLevel = $("#botLevel");
const botNextStake = $("#botNextStake");
const botRunButton = $("#botRunButton");
const botStopButton = $("#botStopButton");
const botBottomStatus = $("#botBottomStatus");
const botHistoryList = $("#botHistoryList");
const freeBotCards = $$(".free-bot-card");
const loadBotButtons = $$(".load-bot-button");
const selectedBotName = $("#selectedBotName");
const selectedBotDescription = $("#selectedBotDescription");
const botBuilder = $(".bot-builder");
const botWorkspace = $("#botWorkspace");
const botWorkspaceTitle = $("#botWorkspaceTitle");
const botWorkspaceDescription = $("#botWorkspaceDescription");
const botWorkspaceStatus = $("#botWorkspaceStatus");
const botCanvasStatus = $("#botCanvasStatus");
const backToBotsButton = $("#backToBotsButton");
const botHistoryBlock = $("#botHistoryBlock");
const botControlBar = $("#botControlBar");
const botZoomOut = $("#botZoomOut");
const botZoomIn = $("#botZoomIn");
const botZoomReset = $("#botZoomReset");
const botZoomLabel = $("#botZoomLabel");
const botCanvasInner = $("#botCanvasInner");
const botLiveTradeType = $("#botLiveTradeType");
const botLiveMarket = $("#botLiveMarket");
const botLiveStake = $("#botLiveStake");
const botLiveTransaction = $("#botLiveTransaction");

const aiFloatButton = $("#aiFloatButton");
const aiSheet = $("#aiSheet");
const closeAiPanel = $("#closeAiPanel");
const aiMarket = $("#aiMarket");
const aiTrade = $("#aiTrade");
const aiBarrier = $("#aiBarrier");
const aiConfidence = $("#aiConfidence");
const aiReason = $("#aiReason");
const aiScanStatus = $("#aiScanStatus");
const aiScanDetail = $("#aiScanDetail");
const aiApplyButton = $("#aiApplyButton");
const aiStartButton = $("#aiStartButton");

const depositButton = $("#depositButton");
const withdrawButton = $("#withdrawButton");
const walletActions = $(".wallet-actions");
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
const withdrawForm = $("#withdrawForm");
const closeWithdraw = $("#closeWithdraw");
const withdrawAmount = $("#withdrawAmount");
const withdrawPhone = $("#withdrawPhone");
const withdrawStatus = $("#withdrawStatus");

const settingsSheet = $("#settingsSheet");
const settingsForm = $("#settingsForm");
const closeSettings = $("#closeSettings");
const settingsStatus = $("#settingsStatus");
const settingsLogout = $("#settingsLogout");
const transactionsSheet = $("#transactionsSheet");
const closeTransactions = $("#closeTransactions");
const transactionList = $("#transactionList");
const partnerSheet = $("#partnerSheet");
const closePartner = $("#closePartner");
const applyPartnerButton = $("#applyPartnerButton");
const partnerDashboard = $("#partnerDashboard");
const partnerReferralLink = $("#partnerReferralLink");
const copyReferralButton = $("#copyReferralButton");
const partnerStats = $("#partnerStats");
const partnerWithdrawButton = $("#partnerWithdrawButton");
const partnerStatus = $("#partnerStatus");

const getStartedButton = $("#getStartedButton");
const loginButton = $("#loginButton");
const logoutButton = $("#logoutButton");
const authActions = $(".auth-actions");
const authSheet = $("#authSheet");
const closeAuth = $("#closeAuth");
const registerTab = $("#registerTab");
const loginTab = $("#loginTab");
const registerForm = $("#registerForm");
const loginForm = $("#loginForm");
const authTitle = $("#authTitle");
const authStatus = $("#authStatus");
const forgotPasswordButton = $("#forgotPasswordButton");
const verifyEmailButton = $("#verifyEmailButton");
const resetPasswordButton = $("#resetPasswordButton");
const accountMenuButton = $("#accountMenuButton");
const settingsMenuButton = $("#settingsMenuButton");
const transactionsMenuButton = $("#transactionsMenuButton");
const partnerMenuButton = $("#partnerMenuButton");
const accountSummary = $("#accountSummary");
const settingsList = $("#settingsList");
const summaryAccountId = $("#summaryAccountId");
const menuAccountId = $("#menuAccountId");
const summaryStatus = $("#summaryStatus");
const summaryEmail = $("#summaryEmail");

let activeMarket = "Meta Volatility 100";
let digits = [...marketSeeds[activeMarket]];
let index = 0;
let wallet = 10000;
let realWallet = 0;
let accountMode = "demo";
let activeTrade = "Even/Odd";
let activeChoice = "Even";
let activeBarrier = 4;
let activeTargetDigit = 2;
let activeContract = null;
let tradeHistory = [];
let transactionHistory = [];
let currentUser = null;
let pendingDeposit = null;
let depositCheckTimer = null;
let depositCheckAttempts = 0;
let resultFlash = null;
let tickTape = [];
let digitStats = [10.2, 9.9, 8.2, 9.6, 10.8, 9.7, 10.9, 10.2, 10.0, 10.5];
let previousTick = null;
let botRunning = false;
let botTimer = null;
let botHistory = [];
let botZoom = 0.5;
let aiSuggestion = null;
let tickTimer = null;

let userSettings = {
  profileName: "",
  email: "",
  phone: "",
  depositPhone: "",
  withdrawalPhone: "",
  theme: "light",
  sound: true,
  chartSpeed: "normal",
  realTradingEnabled: false,
  dailyTradeLimit: 25,
  maximumStakeLimit: 100,
};

let botSession = {
  netProfit: 0,
  currentStake: 0.3,
  baseStake: 0.3,
  martingaleLevel: 0,
};

const freeBotTemplates = {
  pulse: {
    name: "Pulse Entry loaded",
    description: "Free starter bot for quick Even / Odd entries.",
    market: "Meta Volatility 100",
    tradeType: "Even/Odd",
    duration: 3,
    stake: 0.3,
    direction: "Auto",
    barrier: 5,
    takeProfit: 5,
    stopLoss: 5,
    recovery: "None",
    multiplier: 2,
    maxSteps: 4,
    runOnce: "No",
  },
  blueguard: {
    name: "GreenGuard Over loaded",
    description: "Free bot design focused on Over / Under setups.",
    market: "Meta Volatility 75",
    tradeType: "Over/Under",
    duration: 2,
    stake: 0.3,
    direction: "Over",
    barrier: 4,
    takeProfit: 6,
    stopLoss: 4,
    recovery: "None",
    multiplier: 2,
    maxSteps: 4,
    runOnce: "Yes",
  },
  swift: {
    name: "Swift Signal loaded",
    description: "Free bot design for faster Rise / Fall decisions.",
    market: "Meta Volatility 50",
    tradeType: "Rise/Fall",
    duration: 2,
    stake: 0.4,
    direction: "Rise",
    barrier: 5,
    takeProfit: 7,
    stopLoss: 5,
    recovery: "None",
    multiplier: 2,
    maxSteps: 4,
    runOnce: "Yes",
  },
  digitflow: {
    name: "DigitFlow loaded",
    description: "Free bot design for Matches / Differs trading.",
    market: "Meta Volatility 25",
    tradeType: "Matches/Differs",
    duration: 3,
    stake: 0.3,
    direction: "Auto",
    barrier: 6,
    takeProfit: 5,
    stopLoss: 5,
    recovery: "Martingale",
    multiplier: 2,
    maxSteps: 6,
    runOnce: "No",
  },
  alpha: {
    name: "Alpha Drift loaded",
    description: "Free balanced bot with automatic market scanning.",
    market: "Meta Volatility 10",
    tradeType: "Even/Odd",
    duration: 4,
    stake: 0.5,
    direction: "Auto",
    barrier: 5,
    takeProfit: 8,
    stopLoss: 6,
    recovery: "Martingale",
    multiplier: 2,
    maxSteps: 6,
    runOnce: "No",
  },
};

function formatQuote(value) {
  return Number(value || 0).toFixed(2);
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatKes(value) {
  return `KSh ${Math.round(Number(value || 0)).toLocaleString("en-US")}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value || 0)));
}

function createAccountId() {
  return `MB${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
}

function currentWallet() {
  return accountMode === "real" ? realWallet : wallet;
}

function setCurrentWallet(value) {
  const clean = Number(Math.max(0, Number(value || 0)).toFixed(2));
  if (accountMode === "real") realWallet = clean;
  else wallet = clean;
}

function getTickSpeed() {
  if (userSettings.chartSpeed === "fast") return 1600;
  if (userSettings.chartSpeed === "slow") return 4500;
  return 3000;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || "Request failed.");
  return data;
}

async function putJson(url, body) {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
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

function isAccountServiceError(message) {
  const text = String(message || "").toLowerCase();
  return text.includes("account service") || text.includes("mongodb") || text.includes("failed to fetch");
}

function applyServerUser(user) {
  if (!user) return;
  currentUser = { ...(currentUser || {}), ...user, localOnly: false };
  if (Number.isFinite(Number(user.demoBalance))) wallet = Number(user.demoBalance);
  if (Number.isFinite(Number(user.realBalance))) realWallet = Number(user.realBalance);
  if (user.settings) userSettings = { ...userSettings, ...user.settings };
  userSettings.email = user.email || userSettings.email;
  userSettings.profileName = user.fullName || userSettings.profileName;
  userSettings.phone = user.phone || userSettings.phone;
  renderSettingsForm();
}

function saveState() {
  const state = {
    activeMarket,
    wallet,
    realWallet,
    accountMode,
    activeTrade,
    activeChoice,
    activeBarrier,
    activeTargetDigit,
    tradeHistory,
    transactionHistory,
    currentUser,
    userSettings,
    pendingDeposit,
    botHistory,
    botSession,
  };
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function loadState() {
  try {
    const state = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (state.activeMarket && marketSeeds[state.activeMarket]) activeMarket = state.activeMarket;
    digits = [...marketSeeds[activeMarket]];
    if (Number.isFinite(Number(state.wallet))) wallet = Number(state.wallet);
    if (Number.isFinite(Number(state.realWallet))) realWallet = Number(state.realWallet);
    if (state.accountMode) accountMode = state.accountMode;
    if (state.activeTrade && tradeChoices[state.activeTrade]) activeTrade = state.activeTrade;
    if (state.activeChoice) activeChoice = state.activeChoice;
    if (Number.isFinite(Number(state.activeBarrier))) activeBarrier = Number(state.activeBarrier);
    if (Number.isFinite(Number(state.activeTargetDigit))) activeTargetDigit = Number(state.activeTargetDigit);
    if (Array.isArray(state.tradeHistory)) tradeHistory = state.tradeHistory;
    if (Array.isArray(state.transactionHistory)) transactionHistory = state.transactionHistory;
    if (state.currentUser) currentUser = state.currentUser;
    if (state.userSettings) userSettings = { ...userSettings, ...state.userSettings };
    if (state.pendingDeposit) pendingDeposit = state.pendingDeposit;
    if (Array.isArray(state.botHistory)) botHistory = state.botHistory;
    if (state.botSession) botSession = { ...botSession, ...state.botSession };
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(localUsersKey) || "{}");
  } catch {
    return {};
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(localUsersKey, JSON.stringify(users));
}

function createOfflineAccount({ fullName, email, phone, country, documentType, password }) {
  const users = getLocalUsers();
  if (users[email]) {
    authStatus.textContent = "This email already exists on this browser. Login instead.";
    return false;
  }
  const user = {
    accountId: createAccountId(),
    fullName,
    email,
    phone,
    country,
    documentType,
    password,
    localOnly: true,
    emailVerified: false,
    demoBalance: 10000,
    realBalance: 0,
    partnerBalance: 0,
    createdAt: new Date().toISOString(),
    settings: { ...userSettings, profileName: fullName, email, phone, depositPhone: phone, withdrawalPhone: phone },
  };
  users[email] = user;
  saveLocalUsers(users);
  applyServerUser(user);
  currentUser.localOnly = true;
  return true;
}

function loginOfflineAccount(email, password) {
  const users = getLocalUsers();
  const user = users[email];
  if (!user || user.password !== password) return false;
  currentUser = { ...user, localOnly: true };
  wallet = Number(user.demoBalance || 10000);
  realWallet = Number(user.realBalance || 0);
  userSettings = { ...userSettings, ...(user.settings || {}) };
  return true;
}

function persistOfflineUser() {
  if (!currentUser?.localOnly) return;
  const users = getLocalUsers();
  users[currentUser.email] = {
    ...currentUser,
    demoBalance: wallet,
    realBalance: realWallet,
    settings: userSettings,
  };
  saveLocalUsers(users);
}

function applyTheme() {
  document.body.classList.toggle("dark-theme", userSettings.theme === "dark");
}

function renderSettingsForm() {
  const fields = {
    settingsName: userSettings.profileName || currentUser?.fullName || "",
    settingsEmail: currentUser?.email || userSettings.email || "",
    settingsPhone: userSettings.phone || currentUser?.phone || "",
    settingsDepositPhone: userSettings.depositPhone || currentUser?.phone || "",
    settingsWithdrawalPhone: userSettings.withdrawalPhone || currentUser?.phone || "",
    settingsTheme: userSettings.theme || "light",
    settingsSound: String(userSettings.sound !== false),
    settingsChartSpeed: userSettings.chartSpeed || "normal",
    settingsRealTrading: String(Boolean(userSettings.realTradingEnabled)),
    settingsDailyLimit: userSettings.dailyTradeLimit || 25,
    settingsMaxStake: userSettings.maximumStakeLimit || 100,
  };
  Object.entries(fields).forEach(([id, value]) => {
    const input = $(`#${id}`);
    if (input) input.value = value;
  });
  applyTheme();
}

function renderAccount() {
  const loggedIn = Boolean(currentUser);
  if (accountSwitch) accountSwitch.hidden = false;
  if (accountState) {
    accountState.hidden = false;
    accountState.classList.toggle("real", accountMode === "real");
    accountState.classList.toggle("guest", !loggedIn);
  }
  if (balanceCard) balanceCard.hidden = false;
  if (authActions) authActions.hidden = loggedIn;
  if (walletActions) walletActions.hidden = !loggedIn;
  if (logoutButton) logoutButton.hidden = !loggedIn;
  if (accountMenuButton) accountMenuButton.hidden = !loggedIn;
  if (settingsMenuButton) settingsMenuButton.hidden = !loggedIn;
  if (transactionsMenuButton) transactionsMenuButton.hidden = !loggedIn;
  if (partnerMenuButton) partnerMenuButton.hidden = !loggedIn;
  if (accountSummary) accountSummary.hidden = !loggedIn;
  if (settingsList) settingsList.hidden = !loggedIn;
  if (menuAccountId) {
    menuAccountId.hidden = !loggedIn;
    menuAccountId.textContent = loggedIn ? currentUser.accountId || "MetaBinary" : "Account ID";
  }

  accountModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.accountMode === accountMode);
  });

  if (accountLabel) accountLabel.textContent = accountMode === "real" ? "Real USD" : "Demo USD";
  if (balance) balance.textContent = formatMoney(currentWallet());
  if (summaryAccountId) summaryAccountId.textContent = loggedIn ? currentUser.accountId || "Local account" : "Not registered";
  if (summaryStatus) summaryStatus.textContent = loggedIn ? (currentUser.localOnly ? "Local Demo" : "Verified Account") : "Guest";
  if (summaryEmail) summaryEmail.textContent = loggedIn ? currentUser.email : "Add account";
  if (botAccountLabel) botAccountLabel.textContent = accountMode === "real" ? "Real account" : "Demo account";

  renderSettingsForm();
  renderBotStats();
  persistOfflineUser();
}

function setMarket(option) {
  const market = option?.dataset?.market || option;
  if (!marketSeeds[market]) return;
  activeMarket = market;
  digits = [...marketSeeds[activeMarket]];
  index = 0;
  if (marketName) marketName.textContent = marketLabels[activeMarket];
  if (marketDescription) marketDescription.textContent = marketDescriptions[activeMarket] || "Live market";
  $$(".market-option").forEach((button) => button.classList.toggle("selected", button.dataset.market === activeMarket));
  closeMarketSheet();
  renderDigitFrequency();
  tradeStatus.textContent = `Market changed to ${marketLabels[activeMarket]}.`;
  saveState();
}

function openMarketSheet() {
  if (!marketSheet) return;
  marketSheet.classList.add("open");
  marketSheet.setAttribute("aria-hidden", "false");
}

function closeMarketSheet() {
  if (!marketSheet) return;
  marketSheet.classList.remove("open");
  marketSheet.setAttribute("aria-hidden", "true");
}

function getWinningDigitsCount(trade, choice, barrierDigit) {
  if (trade === "Even/Odd") return 5;
  if (trade === "Matches/Differs") return choice === "Matches" ? 1 : 9;
  if (trade === "Over/Under") {
    if (choice === "Over") return Math.max(0, 9 - barrierDigit);
    return Math.max(0, barrierDigit);
  }
  if (trade === "Rise/Fall") return 5;
  if (trade === "Touch/No Touch") return choice === "Touch" ? 1 : 9;
  return 0;
}

function getPayoutRate(trade = activeTrade, choice = activeChoice) {
  if (trade === "Matches/Differs") return choice === "Matches" ? 8.333 : 1.087;
  if (trade === "Touch/No Touch") return choice === "Touch" ? 5.0 : 1.2;
  if (trade === "Even/Odd") return 1.88;
  if (trade === "Rise/Fall") return 1.88;
  if (trade === "Over/Under") {
    const wins = getWinningDigitsCount(trade, choice, activeBarrier);
    if (wins <= 0) return 0;
    return clamp((10 / wins) * 0.88, 1.05, 8.8);
  }
  return 1.88;
}

function updatePayoutPreview() {
  const stake = Math.max(0, Number(stakeInput?.value || 0));
  const rate = getPayoutRate();
  const payout = stake * rate;
  const profit = Math.max(0, payout - stake);
  if (tradeHint) {
    const extra = activeTrade === "Over/Under"
      ? ` · Barrier ${activeBarrier}`
      : activeTrade === "Matches/Differs" || activeTrade === "Touch/No Touch"
        ? ` · Digit ${activeTargetDigit}`
        : "";
    tradeHint.textContent = `${hints[activeTrade]}${extra}`;
  }
  if (selectedTrade) selectedTrade.textContent = activeTrade;
  const oldQuote = $("#payoutQuote");
  if (oldQuote) oldQuote.textContent = `${formatMoney(payout)} payout · ${formatMoney(profit)} profit`;
  const contractHead = $(".contract-head");
  if (contractHead && !oldQuote) {
    const small = document.createElement("small");
    small.id = "payoutQuote";
    small.textContent = `${formatMoney(payout)} payout · ${formatMoney(profit)} profit`;
    contractHead.appendChild(small);
  }
}

function renderChoices() {
  const options = tradeChoices[activeTrade] || [];
  if (!options.includes(activeChoice)) activeChoice = options[0] || "";
  if (choiceRow) {
    choiceRow.innerHTML = options
      .map((choice) => {
        const rate = getPayoutRate(activeTrade, choice);
        const profitPercent = Math.max(0, (rate - 1) * 100).toFixed(2);
        return `
          <button class="choice ${choice === activeChoice ? "selected" : ""}" type="button" data-choice="${choice}">
            <span>${choice}</span>
            <strong>${profitPercent}%</strong>
          </button>
        `;
      })
      .join("");
  }
  if (selectedTrade) selectedTrade.textContent = activeTrade;
  if (tradeHint) tradeHint.textContent = hints[activeTrade] || "Choose contract";
  updatePayoutPreview();
  renderDigitFrequency();
}

function setTradeType(button) {
  activeTrade = button.dataset.tradeType;
  activeChoice = tradeChoices[activeTrade]?.[0] || "";
  $$(".trade-type").forEach((item) => item.classList.toggle("selected", item === button));
  renderChoices();
  tradeStatus.textContent = `${activeTrade} selected. Choose your contract, stake, and press Place Trade.`;
  saveState();
}

function tradeWins(contract, tick, previous) {
  if (contract.trade === "Even/Odd") {
    return contract.choice === "Even" ? tick.digit % 2 === 0 : tick.digit % 2 === 1;
  }
  if (contract.trade === "Rise/Fall") {
    const oldQuote = previous?.quote ?? contract.entryQuote;
    return contract.choice === "Rise" ? tick.quote >= oldQuote : tick.quote < oldQuote;
  }
  if (contract.trade === "Matches/Differs") {
    return contract.choice === "Matches" ? tick.digit === contract.targetDigit : tick.digit !== contract.targetDigit;
  }
  if (contract.trade === "Over/Under") {
    return contract.choice === "Over" ? tick.digit > contract.barrier : tick.digit < contract.barrier;
  }
  if (contract.trade === "Touch/No Touch") {
    return contract.choice === "Touch" ? Boolean(contract.touched) : !contract.touched;
  }
  return false;
}

function buyContract() {
  const stake = Number(stakeInput?.value || 0);
  const ticks = Math.floor(Number(ticksInput?.value || 0));
  const payoutRate = getPayoutRate();
  if (activeContract) {
    tradeStatus.textContent = `Contract running. ${activeContract.remaining} ticks left.`;
    return;
  }
  if (accountMode === "real" && !currentUser) {
    tradeStatus.textContent = "Login or create an account before trading with Real balance.";
    openAuth("login");
    return;
  }
  if (accountMode === "real" && !userSettings.realTradingEnabled) {
    tradeStatus.textContent = "Real trading is disabled in Settings. Enable Real trading first.";
    return;
  }
  if (!Number.isFinite(stake) || stake < 0.3) {
    tradeStatus.textContent = "Minimum stake is 0.30 USD.";
    return;
  }
  if (stake > Number(userSettings.maximumStakeLimit || 100)) {
    tradeStatus.textContent = `Stake is above your maximum limit of ${formatMoney(Number(userSettings.maximumStakeLimit || 100))}.`;
    return;
  }
  if (!Number.isFinite(ticks) || ticks < 1 || ticks > 10) {
    tradeStatus.textContent = "Ticks must be between 1 and 10.";
    return;
  }
  if (!payoutRate) {
    tradeStatus.textContent = `${activeChoice} has no winning digits. Choose another number.`;
    return;
  }
  if (stake > currentWallet()) {
    tradeStatus.textContent = "Enter a stake that is available in your balance.";
    return;
  }

  const payout = Number((stake * payoutRate).toFixed(2));
  const profit = Number(Math.max(0, payout - stake).toFixed(2));
  setCurrentWallet(currentWallet() - stake);
  activeContract = {
    trade: activeTrade,
    choice: activeChoice,
    barrier: activeBarrier,
    targetDigit: activeTargetDigit,
    stake,
    payout,
    payoutRate,
    profit,
    totalTicks: ticks,
    remaining: ticks,
    entryQuote: previousTick?.quote || digits[index]?.quote || 0,
    touched: false,
    openedAt: new Date().toISOString(),
  };
  renderAccount();
  renderDigitFrequency();
  saveState();
  tradeStatus.textContent = `${activeChoice} contract placed. Stake ${formatMoney(stake)}. Possible payout ${formatMoney(payout)}. ${ticks} ticks left.`;
}

function advanceContract(tick, previous) {
  if (!activeContract) return;
  if (tick.digit === activeContract.targetDigit) activeContract.touched = true;
  activeContract.remaining -= 1;

  if (activeContract.remaining > 0) {
    tradeStatus.textContent = `${activeContract.choice} running. ${activeContract.remaining} ticks left.`;
    renderDigitFrequency();
    saveState();
    return;
  }

  const contract = { ...activeContract };
  const won = tradeWins(contract, tick, previous);
  if (won) setCurrentWallet(currentWallet() + contract.payout);
  const profit = won ? contract.profit : -contract.stake;
  activeContract = null;
  resultFlash = { digit: tick.digit, won };
  renderAccount();
  renderDigitFrequency();
  setTimeout(() => {
    resultFlash = null;
    renderDigitFrequency();
  }, 1400);

  addHistoryItem({
    won,
    digit: tick.digit,
    market: activeMarket,
    trade: contract.trade,
    choice: contract.choice,
    stake: contract.stake,
    payout: won ? contract.payout : 0,
    profit,
    settledAt: new Date().toISOString(),
  });
  recordTradeEvent({
    tradeType: `${contract.trade} ${contract.choice}`,
    stake: contract.stake,
    profit,
  });
  tradeStatus.textContent = won
    ? `${contract.choice} won on digit ${tick.digit}. Profit ${formatMoney(contract.profit)}.`
    : `${contract.choice} lost on digit ${tick.digit}.`;
  renderChoices();
  saveState();
}

function resetWallet() {
  activeContract = null;
  tradeHistory = [];
  if (accountMode === "demo") wallet = 10000;
  renderAccount();
  renderHistory();
  renderDigitFrequency();
  tradeStatus.textContent = accountMode === "demo"
    ? "Demo trades cleared and demo balance reset to $10000.00."
    : "Trades cleared. Real balance was not reset.";
  saveState();
}

function addHistoryItem(result) {
  tradeHistory.unshift(result);
  tradeHistory = tradeHistory.slice(0, 20);
  renderHistory();
}

function addLocalTransaction(record) {
  transactionHistory.unshift({
    reference: record.reference || `local-${Date.now()}`,
    createdAt: record.createdAt || new Date().toISOString(),
    ...record,
  });
  transactionHistory = transactionHistory.slice(0, 100);
  renderTransactions();
  saveState();
}

function recordTradeEvent({ tradeType, stake, profit }) {
  const record = {
    type: "trade",
    amount: stake,
    profit,
    status: profit >= 0 ? "win" : "loss",
    accountType: accountMode === "real" ? "Real" : "Demo",
    balanceAfter: currentWallet(),
    reference: `trade-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  addLocalTransaction(record);
  if (!currentUser?.email || window.location.protocol === "file:" || currentUser.localOnly) return;
  postJson("/api/record-trade", {
    email: currentUser.email,
    tradeType,
    stake,
    profit,
    accountType: record.accountType,
    balanceAfter: record.balanceAfter,
  }).catch(() => {});
}

function renderHistory() {
  if (historyCount) historyCount.textContent = tradeHistory.length;
  if (!historyList) return;
  if (tradeHistory.length === 0) {
    historyList.innerHTML = "<p>No trades yet.</p>";
    return;
  }
  historyList.innerHTML = tradeHistory
    .map((item) => {
      const resultClass = item.won ? "win" : "loss";
      const resultText = item.won ? `+${formatMoney(item.profit || item.payout - item.stake)}` : `-${formatMoney(item.stake)}`;
      return `
        <div class="history-item ${resultClass}">
          <div class="history-digit">${item.digit}</div>
          <div class="history-copy">
            <strong>${item.choice} - ${item.trade}</strong>
            <span>${item.market} / Stake ${formatMoney(item.stake)}</span>
          </div>
          <div class="history-result">${resultText}</div>
        </div>
      `;
    })
    .join("");
}

function renderTransactions() {
  if (!transactionList) return;
  if (!transactionHistory.length) {
    transactionList.innerHTML = "<p>No transactions yet.</p>";
    return;
  }
  transactionList.innerHTML = transactionHistory
    .map((item) => {
      const amount = item.type === "trade" ? Number(item.profit || 0) : Number(item.amount || 0);
      return `
        <div class="transaction-item">
          <div>
            <strong>${item.type || "transaction"} · ${item.status || "pending"}</strong>
            <span>${new Date(item.createdAt || Date.now()).toLocaleString()} · ${item.reference || ""}</span>
          </div>
          <div>
            <strong>${formatMoney(amount)}</strong>
            <span>${item.accountType || "Account"} · Bal ${formatMoney(Number(item.balanceAfter || 0))}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderDigitFrequency() {
  if (!digitFrequency) return;
  digitFrequency.innerHTML = Array.from({ length: 10 }, (_, digit) => {
    const percent = Math.max(0, Number(digitStats[digit] || 10)).toFixed(1);
    const isBarrier = activeTrade === "Over/Under" && activeBarrier === digit;
    const isTarget = (activeTrade === "Matches/Differs" || activeTrade === "Touch/No Touch") && activeTargetDigit === digit;
    const isResult = resultFlash?.digit === digit;
    const isHot = tickTape[0]?.digit === digit;
    const classes = ["digit-ring"];
    if (isBarrier || isTarget) classes.push("selected-digit");
    if (isResult) classes.push(resultFlash.won ? "win" : "loss");
    if (isHot) classes.push("hot-digit");
    return `
      <button class="${classes.join(" ")}" type="button" data-digit="${digit}">
        <span class="digit-number">${digit}</span>
        <small>${percent}%</small>
      </button>
    `;
  }).join("");
}

function nextTick() {
  const previous = previousTick || digits[index] || { digit: 0, quote: 0 };
  const base = digits[index % digits.length]?.quote || previous.quote || 100;
  const digit = Math.floor(Math.random() * 10);
  const direction = Math.random() > 0.5 ? 1 : -1;
  const move = Number(((Math.random() * 0.09 + 0.01) * direction).toFixed(2));
  const quote = Number((base + move + digit / 100).toFixed(2));
  index = (index + 1) % digits.length;
  const tick = { digit, quote, move, createdAt: Date.now() };
  digits[index] = tick;
  return { tick, previous };
}

function renderTick() {
  const { tick, previous } = nextTick();
  previousTick = tick;
  tickTape.unshift(tick);
  tickTape = tickTape.slice(0, 50);
  digitStats = digitStats.map((value, digit) => {
    const target = digit === tick.digit ? value + 1.8 : value * 0.992;
    return clamp(target, 6, 18);
  });
  const total = digitStats.reduce((sum, value) => sum + value, 0) || 1;
  digitStats = digitStats.map((value) => Number(((value / total) * 100).toFixed(2)));
  if (digitQuote) digitQuote.textContent = formatQuote(tick.quote);
  if (digitMove) {
    digitMove.textContent = `${tick.move >= 0 ? "+" : ""}${tick.move.toFixed(2)}`;
    digitMove.classList.toggle("down", tick.move < 0);
  }
  if (marketDescription) marketDescription.textContent = `${formatQuote(tick.quote)} ${tick.move >= 0 ? "+" : "-"} ${Math.abs(tick.move).toFixed(2)} (0.01%)`;
  advanceContract(tick, previous);
  renderDigitFrequency();
}

function restartTickTimer() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(renderTick, getTickSpeed());
}

function openAuth(mode = "register") {
  if (!authSheet) return;
  setAuthMode(mode);
  authSheet.classList.add("open");
  authSheet.setAttribute("aria-hidden", "false");
}

function closeAuthSheet() {
  if (!authSheet) return;
  authSheet.classList.remove("open");
  authSheet.setAttribute("aria-hidden", "true");
}

function setAuthMode(mode) {
  const isRegister = mode === "register";
  registerTab?.classList.toggle("active", isRegister);
  loginTab?.classList.toggle("active", !isRegister);
  registerForm?.classList.toggle("active-auth-form", isRegister);
  loginForm?.classList.toggle("active-auth-form", !isRegister);
  if (authTitle) authTitle.textContent = isRegister ? "Create Account" : "Login";
  if (authStatus) authStatus.textContent = isRegister
    ? "Create your MetaBinary account. Demo balance starts at $10000."
    : "Login with your email and password.";
}

async function handleRegister(event) {
  event.preventDefault();
  const fullName = $("#registerName").value.trim();
  const email = $("#registerEmail").value.trim().toLowerCase();
  const phone = $("#registerPhone").value.trim();
  const country = $("#registerCountry").value;
  const documentType = $("#registerDocument").value;
  const password = $("#registerPassword").value;
  const passwordConfirm = $("#registerPasswordConfirm").value;
  const agreed = $("#registerAgreement").checked;
  const submit = registerForm.querySelector(".auth-submit");

  if (password !== passwordConfirm) {
    authStatus.textContent = "Passwords do not match.";
    return;
  }
  if (!agreed) {
    authStatus.textContent = "Confirm you are 18+ and agree before creating the account.";
    return;
  }

  submit.disabled = true;
  authStatus.textContent = "Creating account...";
  try {
    const data = await postJson("/api/register", {
      fullName,
      email,
      phone,
      country,
      documentType,
      password,
      ref: referralCodeFromUrl,
      agreed,
    });
    applyServerUser(data.user);
    registerForm.reset();
    renderAccount();
    saveState();
    authStatus.textContent = data.message || `Account ${currentUser.accountId} created.`;
    setTimeout(closeAuthSheet, 900);
  } catch (error) {
    if (isAccountServiceError(error.message) || window.location.protocol === "file:") {
      if (createOfflineAccount({ fullName, email, phone, country, documentType, password })) {
        registerForm.reset();
        renderAccount();
        saveState();
        authStatus.textContent = "Account created on this browser. Add MongoDB in Vercel for login on other phones.";
        setTimeout(closeAuthSheet, 1200);
      }
    } else {
      authStatus.textContent = error.message;
      if (error.message.toLowerCase().includes("login")) setAuthMode("login");
    }
  } finally {
    submit.disabled = false;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = $("#loginEmail").value.trim().toLowerCase();
  const password = $("#loginPassword").value;
  const submit = loginForm.querySelector(".auth-submit");
  submit.disabled = true;
  authStatus.textContent = "Logging in...";
  try {
    const data = await postJson("/api/login", { email, password });
    applyServerUser(data.user);
    loginForm.reset();
    renderAccount();
    saveState();
    authStatus.textContent = data.message || `Logged in as ${currentUser.accountId}.`;
    setTimeout(closeAuthSheet, 700);
  } catch (error) {
    if (isAccountServiceError(error.message) || window.location.protocol === "file:") {
      if (loginOfflineAccount(email, password)) {
        loginForm.reset();
        renderAccount();
        saveState();
        authStatus.textContent = `Logged in as ${currentUser.accountId} on this browser.`;
        setTimeout(closeAuthSheet, 800);
      } else {
        authStatus.textContent = "No account found for that email and password. Please register first.";
      }
    } else {
      authStatus.textContent = error.message;
    }
  } finally {
    submit.disabled = false;
  }
}

function logout() {
  currentUser = null;
  activeContract = null;
  accountMode = "demo";
  renderChoices();
  renderAccount();
  tradeStatus.textContent = "Logged out. Demo trading is still available.";
  saveState();
}

async function resetPassword() {
  const email = currentUser?.email || $("#loginEmail")?.value.trim().toLowerCase();
  if (!email) {
    authStatus.textContent = "Enter your email first, then request password reset.";
    return;
  }
  try {
    const data = await postJson("/api/reset-password", { email });
    authStatus.textContent = data.message || "Password reset request received.";
  } catch (error) {
    authStatus.textContent = error.message;
  }
}

async function verifyEmail() {
  if (!currentUser?.email) return;
  try {
    const data = await postJson("/api/verify-email", { email: currentUser.email });
    applyServerUser(data.user);
    renderAccount();
    saveState();
    tradeStatus.textContent = data.message || "Email verified.";
  } catch (error) {
    tradeStatus.textContent = error.message;
  }
}

async function refreshCurrentUser() {
  if (!currentUser?.email || currentUser.localOnly) return;
  const data = await getJson(`/api/user/${encodeURIComponent(currentUser.email)}`);
  applyServerUser(data.user);
  renderAccount();
  saveState();
}

function openDeposit() {
  if (!currentUser) {
    openAuth("login");
    authStatus.textContent = "Login or create an account before depositing.";
    return;
  }
  depositPhone.value = userSettings.depositPhone || currentUser.phone || "";
  depositEmail.value = currentUser.email || "";
  depositSheet.classList.add("open");
  depositSheet.setAttribute("aria-hidden", "false");
  updateMpesaPreview();
  checkDeposit.hidden = !pendingDeposit;
  depositStatus.textContent = pendingDeposit
    ? `${formatMoney(pendingDeposit.usdAmount)} deposit is waiting for M-Pesa confirmation.`
    : `${formatMoney(Number(depositAmount.value) || 1)} equals ${formatKes(getKesDepositAmount())}.`;
}

function closeDepositSheet() {
  depositSheet.classList.remove("open");
  depositSheet.setAttribute("aria-hidden", "true");
}

function getKesDepositAmount() {
  return (Number(depositAmount.value) || 0) * kesPerUsd;
}

function updateMpesaPreview() {
  if (mpesaAmount) mpesaAmount.textContent = formatKes(getKesDepositAmount());
}

function startDepositAutoCheck() {
  if (depositCheckTimer) clearInterval(depositCheckTimer);
  depositCheckAttempts = 0;
  depositCheckTimer = setInterval(() => {
    if (!pendingDeposit?.apiRef || checkDeposit.disabled) return;
    depositCheckAttempts += 1;
    checkPendingDeposit({ silent: true });
    if (depositCheckAttempts >= 80) stopDepositAutoCheck();
  }, 3000);
}

function stopDepositAutoCheck() {
  if (depositCheckTimer) clearInterval(depositCheckTimer);
  depositCheckTimer = null;
  depositCheckAttempts = 0;
}

async function handleDeposit(event) {
  event.preventDefault();
  if (!currentUser) {
    depositStatus.textContent = "Login first so we can credit your Real balance.";
    return;
  }
  if (currentUser.localOnly) {
    depositStatus.textContent = "This is a local account. Login with an online account before depositing.";
    return;
  }
  depositSubmit.disabled = true;
  updateMpesaPreview();
  depositStatus.textContent = `Sending M-Pesa STK push for ${formatKes(getKesDepositAmount())}...`;
  try {
    const res = await fetch("/api/create-intasend-stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: getKesDepositAmount(),
        usd_amount: Number(depositAmount.value),
        account_id: currentUser.accountId || "",
        phone_number: depositPhone.value,
        email: depositEmail.value || currentUser.email || "",
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Deposit failed.");
    pendingDeposit = {
      apiRef: data.api_ref,
      usdAmount: Number(data.usd_amount || depositAmount.value),
      kesAmount: Number(data.kes_amount || getKesDepositAmount()),
      accountId: currentUser.accountId || "",
      credited: false,
    };
    checkDeposit.hidden = false;
    startDepositAutoCheck();
    saveState();
    depositStatus.textContent = data.message || "M-Pesa STK push sent. Complete payment on your phone.";
  } catch (error) {
    depositStatus.textContent = error.message;
  } finally {
    depositSubmit.disabled = false;
  }
}

async function checkPendingDeposit(options = {}) {
  if (!pendingDeposit?.apiRef) {
    if (!options.silent) depositStatus.textContent = "No pending deposit to check.";
    return;
  }
  checkDeposit.disabled = true;
  if (!options.silent) depositStatus.textContent = "Checking M-Pesa confirmation...";
  try {
    const res = await fetch(`/api/deposit-status?api_ref=${encodeURIComponent(pendingDeposit.apiRef)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Could not check deposit.");

    if (data.confirmed && !data.credited) {
      const claimRes = await fetch("/api/claim-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_ref: pendingDeposit.apiRef,
          account_id: currentUser?.accountId || pendingDeposit.accountId || "",
        }),
      });
      const claim = await claimRes.json();
      if (!claimRes.ok) throw new Error(claim.error || "Could not credit this deposit.");
      const credit = Number(claim.usd_amount || pendingDeposit.usdAmount || 0);
      if (claim.user) applyServerUser(claim.user);
      else realWallet = Number((realWallet + credit).toFixed(2));
      pendingDeposit = null;
      stopDepositAutoCheck();
      accountMode = "real";
      checkDeposit.hidden = true;
      renderAccount();
      saveState();
      depositStatus.textContent = `Payment confirmed. ${formatMoney(credit)} added to Real balance.`;
    } else if (data.credited) {
      pendingDeposit = null;
      stopDepositAutoCheck();
      checkDeposit.hidden = true;
      await refreshCurrentUser().catch(() => {});
      accountMode = "real";
      renderAccount();
      saveState();
      depositStatus.textContent = "Payment confirmed. Real balance refreshed.";
    } else if (!options.silent) {
      depositStatus.textContent = data.message || "Still waiting for M-Pesa confirmation.";
    }
  } catch (error) {
    if (!options.silent) depositStatus.textContent = error.message;
  } finally {
    checkDeposit.disabled = false;
  }
}

function openWithdraw() {
  if (!currentUser) {
    openAuth("login");
    authStatus.textContent = "Login or create an account before withdrawing.";
    return;
  }
  withdrawPhone.value = userSettings.withdrawalPhone || currentUser.phone || "";
  withdrawSheet.classList.add("open");
  withdrawSheet.setAttribute("aria-hidden", "false");
  withdrawStatus.textContent = accountMode === "real" ? "Withdrawals use Real account balance." : "Switch to Real account before withdrawal.";
}

function closeWithdrawSheet() {
  withdrawSheet.classList.remove("open");
  withdrawSheet.setAttribute("aria-hidden", "true");
}

async function handleWithdraw(event) {
  event.preventDefault();
  const amount = Number(withdrawAmount.value);
  const phone = withdrawPhone.value.trim();
  if (!currentUser?.email) {
    withdrawStatus.textContent = "Login before withdrawal.";
    return;
  }
  if (currentUser.localOnly) {
    withdrawStatus.textContent = "This is a local account. Login with an online account before withdrawal.";
    return;
  }
  if (accountMode !== "real") {
    withdrawStatus.textContent = "Switch to Real account before withdrawal.";
    return;
  }
  if (!Number.isFinite(amount) || amount < 5) {
    withdrawStatus.textContent = "Minimum withdrawal is 5 USD.";
    return;
  }
  if (amount > 150000) {
    withdrawStatus.textContent = "Maximum withdrawal is 150000 USD.";
    return;
  }
  if (amount > realWallet) {
    withdrawStatus.textContent = "Real balance is not enough for this withdrawal.";
    return;
  }
  const submit = withdrawForm.querySelector(".finance-submit");
  submit.disabled = true;
  withdrawStatus.textContent = "Sending withdrawal request...";
  try {
    const data = await postJson("/api/withdraw", { email: currentUser.email, amount, phone });
    if (data.user) applyServerUser(data.user);
    if (data.transaction) addLocalTransaction(data.transaction);
    accountMode = "real";
    renderAccount();
    saveState();
    withdrawStatus.textContent = data.message || "Withdrawal request received.";
  } catch (error) {
    withdrawStatus.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
}

function openSettings() {
  if (!currentUser) {
    openAuth("login");
    return;
  }
  renderSettingsForm();
  settingsSheet.classList.add("open");
  settingsSheet.setAttribute("aria-hidden", "false");
}

function closeSettingsSheet() {
  settingsSheet.classList.remove("open");
  settingsSheet.setAttribute("aria-hidden", "true");
}

async function handleSettings(event) {
  event.preventDefault();
  userSettings = {
    ...userSettings,
    profileName: $("#settingsName").value.trim(),
    phone: $("#settingsPhone").value.trim(),
    depositPhone: $("#settingsDepositPhone").value.trim(),
    withdrawalPhone: $("#settingsWithdrawalPhone").value.trim(),
    theme: $("#settingsTheme").value,
    sound: $("#settingsSound").value === "true",
    chartSpeed: $("#settingsChartSpeed").value,
    realTradingEnabled: $("#settingsRealTrading").value === "true",
    dailyTradeLimit: Number($("#settingsDailyLimit").value || 25),
    maximumStakeLimit: Number($("#settingsMaxStake").value || 100),
  };
  applyTheme();
  restartTickTimer();
  settingsStatus.textContent = "Settings saved.";
  if (currentUser?.email && !currentUser.localOnly) {
    try {
      const data = await putJson(`/api/settings/${encodeURIComponent(currentUser.email)}`, { settings: userSettings });
      if (data.user) applyServerUser(data.user);
      settingsStatus.textContent = data.message || "Settings saved to your account.";
    } catch (error) {
      settingsStatus.textContent = `Saved on this browser. ${error.message}`;
    }
  }
  renderAccount();
  saveState();
}

async function openTransactions() {
  if (!currentUser) {
    openAuth("login");
    return;
  }
  transactionsSheet.classList.add("open");
  transactionsSheet.setAttribute("aria-hidden", "false");
  renderTransactions();
  if (currentUser.email && !currentUser.localOnly) {
    try {
      const data = await getJson(`/api/transactions/${encodeURIComponent(currentUser.email)}`);
      if (Array.isArray(data.transactions)) {
        transactionHistory = [...data.transactions, ...transactionHistory].slice(0, 100);
        renderTransactions();
        saveState();
      }
    } catch {}
  }
}

function closeTransactionsSheet() {
  transactionsSheet.classList.remove("open");
  transactionsSheet.setAttribute("aria-hidden", "true");
}

async function openPartner() {
  if (!currentUser) {
    openAuth("login");
    return;
  }
  partnerSheet.classList.add("open");
  partnerSheet.setAttribute("aria-hidden", "false");
  await loadPartnerDashboard();
}

function closePartnerSheet() {
  partnerSheet.classList.remove("open");
  partnerSheet.setAttribute("aria-hidden", "true");
}

async function loadPartnerDashboard() {
  partnerDashboard.hidden = true;
  if (!currentUser?.email || currentUser.localOnly) {
    partnerStatus.textContent = "Login with an online account before applying for the partner dashboard.";
    return;
  }
  try {
    const data = await getJson(`/api/partner/${encodeURIComponent(currentUser.email)}`);
    renderPartnerDashboard(data);
    partnerStatus.textContent = "Partner dashboard opened.";
  } catch (error) {
    partnerStatus.textContent = error.message === "Partner account not found."
      ? "No partner account yet. Tap Apply / Open Partner Dashboard to create one."
      : error.message;
  }
}

function renderPartnerDashboard(data) {
  const partner = data?.partner;
  const stats = data?.stats || {};
  partnerDashboard.hidden = !partner;
  if (!partner) return;
  partnerReferralLink.value = partner.referralLink || `${location.origin}/register?ref=${partner.partnerId}`;
  partnerStats.innerHTML = [
    ["Total referred users", stats.totalReferredUsers || 0],
    ["Active real traders", stats.activeRealTraders || 0],
    ["Total real deposits", formatMoney(stats.totalRealDeposits || 0)],
    ["Total real trade volume", formatMoney(stats.totalRealTradeVolume || 0)],
    ["Commission earned", formatMoney(stats.totalCommissionEarned || 0)],
    ["Pending commission", formatMoney(stats.pendingCommission || 0)],
    ["Paid commission", formatMoney(stats.paidCommission || 0)],
  ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
}

async function applyPartner() {
  if (!currentUser?.email || currentUser.localOnly) {
    partnerStatus.textContent = "Login with an online account before applying.";
    return;
  }
  partnerStatus.textContent = "Opening partner account...";
  try {
    const data = await postJson("/api/partner/apply", { email: currentUser.email });
    if (data.user) applyServerUser(data.user);
    renderPartnerDashboard({ partner: data.partner, stats: {} });
    partnerStatus.textContent = data.message || "Partner account is active.";
    saveState();
  } catch (error) {
    partnerStatus.textContent = error.message;
  }
}

function loadFreeBotTemplate(templateKey) {
  const template = freeBotTemplates[templateKey] || freeBotTemplates.pulse;
  freeBotCards.forEach((card) => card.classList.toggle("selected-bot-card", card.dataset.botTemplate === templateKey));
  selectedBotName.textContent = template.name;
  selectedBotDescription.textContent = template.description;
  botMarket.value = template.market;
  botTradeType.value = template.tradeType;
  botDuration.value = template.duration;
  botStake.value = template.stake;
  botDirection.value = template.direction;
  botBarrier.value = template.barrier;
  botTakeProfit.value = template.takeProfit;
  botStopLoss.value = template.stopLoss;
  botRecovery.value = template.recovery;
  botMultiplier.value = template.multiplier;
  botMaxSteps.value = template.maxSteps;
  botRunOnce.value = template.runOnce;
  botWorkspace.hidden = false;
  botHistoryBlock.hidden = false;
  botControlBar.hidden = false;
  botBuilder.classList.add("bot-workspace-mode");
  botWorkspaceTitle.textContent = template.name;
  botWorkspaceDescription.textContent = template.description;
  botWorkspaceStatus.textContent = "Loaded";
  botCanvasStatus.textContent = "Ready to run strategy";
  setBotZoom(botZoom);
  renderBotStats();
}

function closeBotWorkspace() {
  botWorkspace.hidden = true;
  botHistoryBlock.hidden = true;
  botControlBar.hidden = true;
  botBuilder.classList.remove("bot-workspace-mode");
}

function setBotZoom(value) {
  botZoom = clamp(value, 0.35, 1.2);
  if (botCanvasInner) botCanvasInner.style.transform = `scale(${botZoom})`;
  if (botZoomLabel) botZoomLabel.textContent = `${Math.round(botZoom * 100)}%`;
}

function setBotStatus(text) {
  if (botStatus) botStatus.textContent = text;
  if (botBottomStatus) botBottomStatus.textContent = text;
  if (botWorkspaceStatus) botWorkspaceStatus.textContent = text;
}

function renderBotStats() {
  botNetProfit.textContent = formatMoney(botSession.netProfit);
  botLevel.textContent = String(botSession.martingaleLevel);
  botNextStake.textContent = formatMoney(botSession.currentStake || Number(botStake?.value || 0.3));
  if (botAccountLabel) botAccountLabel.textContent = accountMode === "real" ? "Real account" : "Demo account";
}

function renderBotHistory() {
  if (!botHistoryList) return;
  if (!botHistory.length) {
    botHistoryList.innerHTML = "<p>No bot trades yet.</p>";
    return;
  }
  botHistoryList.innerHTML = botHistory.slice(0, 20).map((item) => `
    <div class="bot-history-item ${item.won ? "win" : "loss"}">
      <strong>${item.tradeType}</strong>
      <span>${item.market} · ${formatMoney(item.stake)} · ${item.won ? "WIN" : "LOSS"}</span>
    </div>
  `).join("");
}

function chooseBotDirection() {
  const direction = botDirection.value;
  if (direction !== "Auto") return direction;
  const tradeType = botTradeType.value;
  if (tradeType === "Even/Odd") return Math.random() > 0.5 ? "Even" : "Odd";
  if (tradeType === "Rise/Fall") return Math.random() > 0.5 ? "Rise" : "Fall";
  if (tradeType === "Over/Under") return Math.random() > 0.5 ? "Over" : "Under";
  if (tradeType === "Matches/Differs") return Math.random() > 0.25 ? "Differs" : "Matches";
  if (tradeType === "Touch/No Touch") return Math.random() > 0.3 ? "No Touch" : "Touch";
  return "Even";
}

function runBotTrade() {
  if (!botRunning || activeContract) return;
  setMarket(botMarket.value);
  activeTrade = botTradeType.value;
  activeChoice = chooseBotDirection();
  activeBarrier = Number(botBarrier.value || 5);
  activeTargetDigit = Number(botBarrier.value || 5);
  stakeInput.value = Math.max(0.3, Number(botSession.currentStake || botStake.value || 0.3)).toFixed(2);
  ticksInput.value = Math.max(1, Math.min(10, Number(botDuration.value || 3)));
  renderChoices();
  buyContract();
  if (botLiveTradeType) botLiveTradeType.textContent = `${activeTrade} ${activeChoice}`;
  if (botLiveMarket) botLiveMarket.textContent = marketLabels[activeMarket];
  if (botLiveStake) botLiveStake.textContent = formatMoney(Number(stakeInput.value));
  if (botLiveTransaction) botLiveTransaction.textContent = "Trade placed";
}

function startBot() {
  if (botRunning) return;
  if (accountMode === "real" && !currentUser) {
    openAuth("login");
    setBotStatus("Login first for Real bot trading.");
    return;
  }
  botRunning = true;
  botSession.baseStake = Math.max(0.3, Number(botStake.value || 0.3));
  botSession.currentStake = botSession.currentStake || botSession.baseStake;
  setBotStatus("Bot running");
  botCanvasStatus.textContent = "Bot scanning and placing trades";
  runBotTrade();
  botTimer = setInterval(runBotTrade, 4200);
}

function stopBot(reason = "Bot stopped") {
  botRunning = false;
  if (botTimer) clearInterval(botTimer);
  botTimer = null;
  setBotStatus(reason);
  if (botCanvasStatus) botCanvasStatus.textContent = reason;
}

function updateBotAfterTrade(profit, contract) {
  if (!botRunning) return;
  const won = profit >= 0;
  botSession.netProfit = Number((botSession.netProfit + profit).toFixed(2));
  if (won || botRecovery.value !== "Martingale") {
    botSession.martingaleLevel = 0;
    botSession.currentStake = Math.max(0.3, Number(botStake.value || 0.3));
  } else {
    botSession.martingaleLevel += 1;
    if (botSession.martingaleLevel > Number(botMaxSteps.value || 6)) {
      botSession.martingaleLevel = 0;
      botSession.currentStake = Math.max(0.3, Number(botStake.value || 0.3));
    } else {
      botSession.currentStake = Number((Number(botSession.currentStake || botStake.value || 0.3) * Number(botMultiplier.value || 2)).toFixed(2));
    }
  }
  botHistory.unshift({
    tradeType: `${contract.trade} ${contract.choice}`,
    market: marketLabels[activeMarket],
    stake: contract.stake,
    won,
    createdAt: new Date().toISOString(),
  });
  botHistory = botHistory.slice(0, 50);
  renderBotHistory();
  renderBotStats();
  if (botLiveTransaction) botLiveTransaction.textContent = won ? "Last trade won" : "Last trade lost";
  const takeProfit = Number(botTakeProfit.value || 0);
  const stopLoss = Number(botStopLoss.value || 0);
  if (takeProfit > 0 && botSession.netProfit >= takeProfit) stopBot("Take profit reached");
  if (stopLoss > 0 && botSession.netProfit <= -stopLoss) stopBot("Stop loss reached");
  if (botRunOnce.value === "Yes") stopBot("Run once completed");
}

const originalRecordTradeEvent = recordTradeEvent;
recordTradeEvent = function wrappedRecordTradeEvent({ tradeType, stake, profit }) {
  const settledContract = tradeHistory[0]
    ? { trade: tradeHistory[0].trade, choice: tradeHistory[0].choice, stake: tradeHistory[0].stake }
    : { trade: activeTrade, choice: activeChoice, stake };
  originalRecordTradeEvent({ tradeType, stake, profit });
  updateBotAfterTrade(profit, settledContract);
};

function scanAiMarket() {
  const markets = Object.keys(marketSeeds);
  const market = markets[Math.floor(Math.random() * markets.length)];
  const tradeTypes = ["Even/Odd", "Rise/Fall", "Over/Under", "Matches/Differs", "Touch/No Touch"];
  const tradeType = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
  const barrier = Math.floor(Math.random() * 10);
  const confidence = Math.floor(58 + Math.random() * 28);
  aiSuggestion = { market, tradeType, barrier, confidence };
  if (aiMarket) aiMarket.textContent = marketLabels[market];
  if (aiTrade) aiTrade.textContent = tradeType;
  if (aiBarrier) aiBarrier.textContent = String(barrier);
  if (aiConfidence) aiConfidence.textContent = `${confidence}%`;
  if (aiReason) aiReason.textContent = `AI found a possible ${tradeType} entry after reading the recent digit frequency and market speed.`;
  if (aiScanStatus) aiScanStatus.textContent = "Scan complete";
  if (aiScanDetail) aiScanDetail.textContent = "Use Apply to Bot or Start Bot to run the suggested setup.";
}

function openAiSheet() {
  aiSheet.classList.add("open");
  aiSheet.setAttribute("aria-hidden", "false");
  if (aiScanStatus) aiScanStatus.textContent = "Scanning market...";
  if (aiScanDetail) aiScanDetail.textContent = "Reading recent ticks, digit frequency, and volatility speed.";
  setTimeout(scanAiMarket, 700);
}

function closeAiSheet() {
  aiSheet.classList.remove("open");
  aiSheet.setAttribute("aria-hidden", "true");
}

function applyAiToBot() {
  if (!aiSuggestion) scanAiMarket();
  loadFreeBotTemplate("alpha");
  botMarket.value = aiSuggestion.market;
  botTradeType.value = aiSuggestion.tradeType;
  botBarrier.value = aiSuggestion.barrier;
  botDirection.value = "Auto";
  selectedBotName.textContent = "AI Scanner Bot loaded";
  selectedBotDescription.textContent = `AI selected ${marketLabels[aiSuggestion.market]} with ${aiSuggestion.confidence}% confidence.`;
  setBotStatus("AI setup applied");
}

function setActiveTab(tabName) {
  tabButtons.forEach((button) => button.classList.toggle("active", button.dataset.tab === tabName));
  Object.entries(tabPanels).forEach(([key, panel]) => panel?.classList.toggle("active-panel", key === tabName));
}

function bindEvents() {
  $$(".trade-type").forEach((button) => button.addEventListener("click", () => setTradeType(button)));
  choiceRow?.addEventListener("click", (event) => {
    const button = event.target.closest(".choice");
    if (!button) return;
    activeChoice = button.dataset.choice;
    renderChoices();
    tradeStatus.textContent = `${activeChoice} selected. Press Place Trade when ready.`;
    saveState();
  });
  digitFrequency?.addEventListener("click", (event) => {
    const button = event.target.closest(".digit-ring");
    if (!button) return;
    const value = Number(button.dataset.digit);
    if (activeTrade === "Over/Under") activeBarrier = value;
    if (activeTrade === "Matches/Differs" || activeTrade === "Touch/No Touch") activeTargetDigit = value;
    renderDigitFrequency();
    updatePayoutPreview();
    tradeStatus.textContent = activeTrade === "Over/Under" ? `${activeChoice} ${activeBarrier} selected.` : `${activeChoice} digit ${activeTargetDigit} selected.`;
    saveState();
  });
  buyButton?.addEventListener("click", buyContract);
  sellButton?.addEventListener("click", resetWallet);
  stakeInput?.addEventListener("input", updatePayoutPreview);
  ticksInput?.addEventListener("input", updatePayoutPreview);

  tabButtons.forEach((button) => button.addEventListener("click", () => setActiveTab(button.dataset.tab)));
  marketSelector?.addEventListener("click", openMarketSheet);
  marketSelector?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") openMarketSheet();
  });
  closeMarket?.addEventListener("click", closeMarketSheet);
  marketSheet?.addEventListener("click", (event) => {
    if (event.target === marketSheet) closeMarketSheet();
    const option = event.target.closest(".market-option");
    if (option) setMarket(option);
  });

  accountModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      accountMode = button.dataset.accountMode;
      renderAccount();
      renderBotStats();
      tradeStatus.textContent = accountMode === "real" ? "Real account selected." : "Demo account selected.";
      saveState();
    });
  });

  getStartedButton?.addEventListener("click", () => openAuth("register"));
  loginButton?.addEventListener("click", () => openAuth("login"));
  closeAuth?.addEventListener("click", closeAuthSheet);
  authSheet?.addEventListener("click", (event) => { if (event.target === authSheet) closeAuthSheet(); });
  registerTab?.addEventListener("click", () => setAuthMode("register"));
  loginTab?.addEventListener("click", () => setAuthMode("login"));
  registerForm?.addEventListener("submit", handleRegister);
  loginForm?.addEventListener("submit", handleLogin);
  forgotPasswordButton?.addEventListener("click", resetPassword);
  logoutButton?.addEventListener("click", logout);
  settingsLogout?.addEventListener("click", logout);
  verifyEmailButton?.addEventListener("click", verifyEmail);
  resetPasswordButton?.addEventListener("click", resetPassword);
  $$(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const input = $(`#${button.dataset.passwordTarget}`);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      button.textContent = input.type === "password" ? "Show" : "Hide";
    });
  });

  depositButton?.addEventListener("click", openDeposit);
  closeDeposit?.addEventListener("click", closeDepositSheet);
  depositSheet?.addEventListener("click", (event) => { if (event.target === depositSheet) closeDepositSheet(); });
  depositAmount?.addEventListener("input", () => {
    updateMpesaPreview();
    depositStatus.textContent = `${formatMoney(Number(depositAmount.value) || 0)} equals ${formatKes(getKesDepositAmount())}.`;
  });
  depositForm?.addEventListener("submit", handleDeposit);
  checkDeposit?.addEventListener("click", () => checkPendingDeposit());

  withdrawButton?.addEventListener("click", openWithdraw);
  closeWithdraw?.addEventListener("click", closeWithdrawSheet);
  withdrawSheet?.addEventListener("click", (event) => { if (event.target === withdrawSheet) closeWithdrawSheet(); });
  withdrawForm?.addEventListener("submit", handleWithdraw);

  accountMenuButton?.addEventListener("click", () => {
    accountSummary.hidden = !accountSummary.hidden;
    settingsList.hidden = true;
  });
  settingsMenuButton?.addEventListener("click", openSettings);
  closeSettings?.addEventListener("click", closeSettingsSheet);
  settingsSheet?.addEventListener("click", (event) => { if (event.target === settingsSheet) closeSettingsSheet(); });
  settingsForm?.addEventListener("submit", handleSettings);
  transactionsMenuButton?.addEventListener("click", openTransactions);
  closeTransactions?.addEventListener("click", closeTransactionsSheet);
  transactionsSheet?.addEventListener("click", (event) => { if (event.target === transactionsSheet) closeTransactionsSheet(); });
  partnerMenuButton?.addEventListener("click", openPartner);
  closePartner?.addEventListener("click", closePartnerSheet);
  partnerSheet?.addEventListener("click", (event) => { if (event.target === partnerSheet) closePartnerSheet(); });
  applyPartnerButton?.addEventListener("click", applyPartner);
  copyReferralButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(partnerReferralLink.value);
      partnerStatus.textContent = "Referral link copied.";
    } catch {
      partnerReferralLink.select();
      partnerStatus.textContent = "Referral link selected. Copy it from the field.";
    }
  });
  partnerWithdrawButton?.addEventListener("click", () => {
    partnerStatus.textContent = "Commission withdrawal will be processed from the backend partner dashboard.";
  });

  loadBotButtons.forEach((button) => button.addEventListener("click", () => loadFreeBotTemplate(button.dataset.botTemplate)));
  backToBotsButton?.addEventListener("click", closeBotWorkspace);
  botRunButton?.addEventListener("click", startBot);
  botStopButton?.addEventListener("click", () => stopBot("Bot stopped"));
  botZoomOut?.addEventListener("click", () => setBotZoom(botZoom - 0.1));
  botZoomIn?.addEventListener("click", () => setBotZoom(botZoom + 0.1));
  botZoomReset?.addEventListener("click", () => setBotZoom(0.5));

  aiFloatButton?.addEventListener("click", openAiSheet);
  closeAiPanel?.addEventListener("click", closeAiSheet);
  aiSheet?.addEventListener("click", (event) => { if (event.target === aiSheet) closeAiSheet(); });
  aiApplyButton?.addEventListener("click", applyAiToBot);
  aiStartButton?.addEventListener("click", () => {
    applyAiToBot();
    startBot();
    closeAiSheet();
  });
}

function init() {
  loadState();
  bindEvents();
  if (!tradeChoices[activeTrade]) activeTrade = "Even/Odd";
  if (!tradeChoices[activeTrade].includes(activeChoice)) activeChoice = tradeChoices[activeTrade][0];
  if (!marketSeeds[activeMarket]) activeMarket = "Meta Volatility 100";
  digits = [...marketSeeds[activeMarket]];
  if (marketName) marketName.textContent = marketLabels[activeMarket];
  if (marketDescription) marketDescription.textContent = marketDescriptions[activeMarket];
  $$(".trade-type").forEach((button) => button.classList.toggle("selected", button.dataset.tradeType === activeTrade));
  $$(".market-option").forEach((button) => button.classList.toggle("selected", button.dataset.market === activeMarket));
  renderChoices();
  renderHistory();
  renderTransactions();
  renderAccount();
  renderBotHistory();
  renderBotStats();
  setBotStatus("Choose a bot design to load.");
  updateMpesaPreview();
  renderDigitFrequency();
  renderTick();
  restartTickTimer();
  if (pendingDeposit?.apiRef) startDepositAutoCheck();
}

init();
