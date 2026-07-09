const marketSeeds = {
  "Meta Volatility 100": [
    { digit: 2, quote: 396.12, x: 88, y: 50 },
    { digit: 0, quote: 396.10, x: 52, y: 50 },
    { digit: 8, quote: 396.18, x: 70, y: 43 },
    { digit: 4, quote: 396.14, x: 31, y: 56 },
    { digit: 6, quote: 396.16, x: 82, y: 47 },
    { digit: 1, quote: 396.11, x: 44, y: 52 },
  ],
  "Meta Volatility 75": [
    { digit: 1, quote: 248.41, x: 76, y: 48 },
    { digit: 5, quote: 248.45, x: 38, y: 55 },
    { digit: 7, quote: 248.47, x: 66, y: 45 },
    { digit: 3, quote: 248.43, x: 24, y: 52 },
    { digit: 9, quote: 248.49, x: 88, y: 42 },
    { digit: 0, quote: 248.40, x: 50, y: 58 },
  ],
  "Meta Volatility 50": [
    { digit: 8, quote: 612.08, x: 84, y: 46 },
    { digit: 2, quote: 612.02, x: 42, y: 53 },
    { digit: 6, quote: 612.06, x: 68, y: 49 },
    { digit: 4, quote: 612.04, x: 29, y: 51 },
    { digit: 0, quote: 612.00, x: 55, y: 57 },
    { digit: 7, quote: 612.07, x: 78, y: 44 },
  ],
  "Meta Volatility 25": [
    { digit: 3, quote: 184.23, x: 42, y: 48 },
    { digit: 9, quote: 184.29, x: 63, y: 44 },
    { digit: 1, quote: 184.21, x: 36, y: 55 },
    { digit: 5, quote: 184.25, x: 72, y: 50 },
    { digit: 2, quote: 184.22, x: 48, y: 53 },
    { digit: 8, quote: 184.28, x: 82, y: 45 },
  ],
  "Meta Volatility 10": [
    { digit: 4, quote: 98.14, x: 40, y: 49 },
    { digit: 6, quote: 98.16, x: 58, y: 47 },
    { digit: 0, quote: 98.10, x: 34, y: 55 },
    { digit: 7, quote: 98.17, x: 70, y: 46 },
    { digit: 3, quote: 98.13, x: 46, y: 52 },
    { digit: 9, quote: 98.19, x: 80, y: 44 },
  ],
};

const tradeChoices = {
  "Rise/Fall": ["Rise", "Fall"],
  "Even/Odd": ["Even", "Odd"],
  "Matches/Differs": ["Matches", "Differs"],
  "Over/Under": ["Over", "Under"],
  "Touch/No Touch": ["Touch", "No Touch"],
};

const hints = {
  "Rise/Fall": "Choose Rise or Fall",
  "Even/Odd": "Choose Even or Odd",
  "Matches/Differs": "Choose Matches or Differs",
  "Over/Under": "Choose Over or Under",
  "Touch/No Touch": "Choose Touch or No Touch",
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

const storageKey = "meta-volatility-trade-state";
const localUsersKey = "meta-volatility-local-users";
const accountResetKey = "meta-volatility-account-reset-version";
const accountResetVersion = "2026-07-08-demo-10000-reset";
const referralCodeFromUrl = new URLSearchParams(window.location.search).get("ref") || "";

const digitQuote = document.querySelector("#digitQuote");
const digitMove = document.querySelector("#digitMove");
const digitFrequency = document.querySelector("#digitFrequency");
const marketName = document.querySelector("#marketName");
const marketDescription = document.querySelector("#marketDescription");
const balance = document.querySelector("#balance");
const balanceCard = document.querySelector(".balance-card");
const accountLabel = document.querySelector("#accountLabel");
const accountState = document.querySelector(".account-state");
const accountSwitch = document.querySelector(".account-switch");
const accountModeButtons = document.querySelectorAll(".account-mode");
const changeMarket = document.querySelector("#changeMarket");
const marketSelector = document.querySelector("#marketSelector");
const marketSheet = document.querySelector("#marketSheet");
const closeMarket = document.querySelector("#closeMarket");
const selectedTrade = document.querySelector("#selectedTrade");
const tradeHint = document.querySelector("#tradeHint");
const choiceRow = document.querySelector("#choiceRow");
const stakeInput = document.querySelector("#stakeInput");
const ticksInput = document.querySelector("#ticksInput");
const sellButton = document.querySelector("#sellButton");
const tradeStatus = document.querySelector("#tradeStatus");
const historyList = document.querySelector("#historyList");
const historyCount = document.querySelector("#historyCount");
const tabButtons = document.querySelectorAll(".tabs button");
const tabPanels = {
  menu: document.querySelector("#menuPanel"),
  trade: document.querySelector("#tradePanel"),
  charts: document.querySelector("#chartsPanel"),
  bot: document.querySelector("#botPanel"),
  copy: document.querySelector("#copyPanel"),
};
const botStatus = document.querySelector("#botStatus");
const botAccountLabel = document.querySelector("#botAccountLabel");
const botMarket = document.querySelector("#botMarket");
const botTradeType = document.querySelector("#botTradeType");
const botDuration = document.querySelector("#botDuration");
const botStake = document.querySelector("#botStake");
const botDirection = document.querySelector("#botDirection");
const botBarrier = document.querySelector("#botBarrier");
const botTakeProfit = document.querySelector("#botTakeProfit");
const botStopLoss = document.querySelector("#botStopLoss");
const botRecovery = document.querySelector("#botRecovery");
const botMultiplier = document.querySelector("#botMultiplier");
const botMaxSteps = document.querySelector("#botMaxSteps");
const botRunOnce = document.querySelector("#botRunOnce");
const botNetProfit = document.querySelector("#botNetProfit");
const botLevel = document.querySelector("#botLevel");
const botNextStake = document.querySelector("#botNextStake");
const botRunButton = document.querySelector("#botRunButton");
const botStopButton = document.querySelector("#botStopButton");
const botBottomStatus = document.querySelector("#botBottomStatus");
const botHistoryList = document.querySelector("#botHistoryList");
const freeBotCards = document.querySelectorAll(".free-bot-card");
const loadBotButtons = document.querySelectorAll(".load-bot-button");
const selectedBotName = document.querySelector("#selectedBotName");
const selectedBotDescription = document.querySelector("#selectedBotDescription");
const botBuilder = document.querySelector(".bot-builder");
const botWorkspace = document.querySelector("#botWorkspace");
const botWorkspaceTitle = document.querySelector("#botWorkspaceTitle");
const botWorkspaceDescription = document.querySelector("#botWorkspaceDescription");
const botWorkspaceStatus = document.querySelector("#botWorkspaceStatus");
const botCanvas = document.querySelector("#botCanvas");
const botCanvasInner = document.querySelector("#botCanvasInner");
const botCanvasStatus = document.querySelector("#botCanvasStatus");
const backToBotsButton = document.querySelector("#backToBotsButton");
const botHistoryBlock = document.querySelector("#botHistoryBlock");
const botControlBar = document.querySelector("#botControlBar");
const botZoomOut = document.querySelector("#botZoomOut");
const botZoomIn = document.querySelector("#botZoomIn");
const botZoomReset = document.querySelector("#botZoomReset");
const botZoomLabel = document.querySelector("#botZoomLabel");
const botLiveTradeType = document.querySelector("#botLiveTradeType");
const botLiveMarket = document.querySelector("#botLiveMarket");
const botLiveStake = document.querySelector("#botLiveStake");
const botLiveTransaction = document.querySelector("#botLiveTransaction");
const aiFloatButton = document.querySelector("#aiFloatButton");
const aiSheet = document.querySelector("#aiSheet");
const closeAiPanel = document.querySelector("#closeAiPanel");
const aiMarket = document.querySelector("#aiMarket");
const aiTrade = document.querySelector("#aiTrade");
const aiBarrier = document.querySelector("#aiBarrier");
const aiConfidence = document.querySelector("#aiConfidence");
const aiReason = document.querySelector("#aiReason");
const aiScanStatus = document.querySelector("#aiScanStatus");
const aiScanDetail = document.querySelector("#aiScanDetail");
const aiApplyButton = document.querySelector("#aiApplyButton");
const aiStartButton = document.querySelector("#aiStartButton");
const depositButton = document.querySelector("#depositButton");
const withdrawButton = document.querySelector("#withdrawButton");
const walletActions = document.querySelector(".wallet-actions");
const depositSheet = document.querySelector("#depositSheet");
const closeDeposit = document.querySelector("#closeDeposit");
const depositForm = document.querySelector("#depositForm");
const depositAmount = document.querySelector("#depositAmount");
const mpesaAmount = document.querySelector("#mpesaAmount");
const depositPhone = document.querySelector("#depositPhone");
const depositEmail = document.querySelector("#depositEmail");
const depositSubmit = document.querySelector("#depositSubmit");
const checkDeposit = document.querySelector("#checkDeposit");
const depositStatus = document.querySelector("#depositStatus");
const withdrawSheet = document.querySelector("#withdrawSheet");
const withdrawForm = document.querySelector("#withdrawForm");
const closeWithdraw = document.querySelector("#closeWithdraw");
const withdrawAmount = document.querySelector("#withdrawAmount");
const withdrawPhone = document.querySelector("#withdrawPhone");
const withdrawStatus = document.querySelector("#withdrawStatus");
const settingsSheet = document.querySelector("#settingsSheet");
const settingsForm = document.querySelector("#settingsForm");
const closeSettings = document.querySelector("#closeSettings");
const settingsStatus = document.querySelector("#settingsStatus");
const settingsLogout = document.querySelector("#settingsLogout");
const transactionsSheet = document.querySelector("#transactionsSheet");
const closeTransactions = document.querySelector("#closeTransactions");
const transactionList = document.querySelector("#transactionList");
const partnerSheet = document.querySelector("#partnerSheet");
const closePartner = document.querySelector("#closePartner");
const applyPartnerButton = document.querySelector("#applyPartnerButton");
const partnerDashboard = document.querySelector("#partnerDashboard");
const partnerReferralLink = document.querySelector("#partnerReferralLink");
const copyReferralButton = document.querySelector("#copyReferralButton");
const partnerStats = document.querySelector("#partnerStats");
const partnerWithdrawButton = document.querySelector("#partnerWithdrawButton");
const partnerStatus = document.querySelector("#partnerStatus");
const getStartedButton = document.querySelector("#getStartedButton");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const authActions = document.querySelector(".auth-actions");
const authSheet = document.querySelector("#authSheet");
const closeAuth = document.querySelector("#closeAuth");
const registerTab = document.querySelector("#registerTab");
const loginTab = document.querySelector("#loginTab");
const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");
const authTitle = document.querySelector("#authTitle");
const authStatus = document.querySelector("#authStatus");
const forgotPasswordButton = document.querySelector("#forgotPasswordButton");
const verifyEmailButton = document.querySelector("#verifyEmailButton");
const resetPasswordButton = document.querySelector("#resetPasswordButton");
const accountMenuButton = document.querySelector("#accountMenuButton");
const settingsMenuButton = document.querySelector("#settingsMenuButton");
const transactionsMenuButton = document.querySelector("#transactionsMenuButton");
const partnerMenuButton = document.querySelector("#partnerMenuButton");
const accountSummary = document.querySelector("#accountSummary");
const settingsList = document.querySelector("#settingsList");
const summaryAccountId = document.querySelector("#summaryAccountId");
const menuAccountId = document.querySelector("#menuAccountId");
const summaryStatus = document.querySelector("#summaryStatus");
const summaryEmail = document.querySelector("#summaryEmail");
const payoutQuote = document.querySelector("#payoutQuote");

let activeMarket = "Meta Volatility 100";
let digits = [...marketSeeds[activeMarket]];
let index = 0;
let wallet = 10000;
let realWallet = 0;
let accountMode = "demo";
let activeTrade = "Even/Odd";
let activeChoice = "Even";
let choiceTouched = false;
let activeBarrier = 4;
let activeTargetDigit = 2;
let activeContract = null;
let tradeHistory = [];
let botRunning = false;
let digitStats = [10.2, 9.9, 8.2, 9.6, 10.8, 9.7, 10.9, 10.2, 10, 10.5];
let lastDigit = 0;
let botTicks = 0;
let botStatusText = "Bot is not running";
let botOpenTrade = null;
let botHistory = [];
let botSession = {
  netProfit: 0,
  currentStake: 0.3,
  baseStake: 0.3,
  martingaleLevel: 0,
  scanTicks: 0,
};
let tickTape = [];
let aiSuggestion = null;
let aiScanTimer = null;
let resultFlash = null;
let currentUser = null;
let dominantDigit = 6;
let dominantUntil = Date.now() + 90000;
let statTickCounter = 0;
const kesPerUsd = 130;
let pendingDeposit = null;
let depositCheckTimer = null;
let depositCheckAttempts = 0;
let aiDragState = null;
let aiDidDrag = false;
let aiPointerMoved = false;
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
let transactionHistory = [];
let partnerData = null;
let botZoom = 0.5;
const botCanvasPointers = new Map();
let botCanvasDrag = null;
let botPinchStart = null;
let botTouchPinchStart = null;

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
    multiplier: 1.6,
    maxSteps: 3,
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
    multiplier: 1.5,
    maxSteps: 4,
    runOnce: "No",
  },
};

function formatQuote(value) {
  return value.toFixed(2);
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function formatKes(value) {
  return `KSh ${Math.round(value).toLocaleString("en-US")}`;
}

function currentWallet() {
  return accountMode === "real" ? realWallet : wallet;
}

function setCurrentWallet(value) {
  if (accountMode === "real") realWallet = value;
  else wallet = value;
}

function applyServerUser(user) {
  if (!user) return;
  currentUser = { ...(currentUser || {}), ...user };
  if (Number.isFinite(Number(user.demoBalance))) wallet = Number(user.demoBalance);
  if (Number.isFinite(Number(user.realBalance))) realWallet = Number(user.realBalance);
  if (user.settings) userSettings = { ...userSettings, ...user.settings };
  userSettings.email = user.email || userSettings.email;
  userSettings.profileName = user.fullName || userSettings.profileName;
  userSettings.phone = user.phone || userSettings.phone;
  renderSettingsForm();
}

function applyTheme() {
  document.body.classList.toggle("dark-theme", userSettings.theme === "dark");
}

function renderSettingsForm() {
  const map = {
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
  Object.entries(map).forEach(([id, value]) => {
    const input = document.querySelector(`#${id}`);
    if (input) input.value = value;
  });
  applyTheme();
}

function renderAccount() {
  const loggedIn = Boolean(currentUser);
  accountModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.accountMode === accountMode);
  });
  accountSwitch.hidden = !loggedIn;
  accountState.hidden = !loggedIn;
  balanceCard.hidden = !loggedIn;
  authActions.hidden = loggedIn;
  getStartedButton.hidden = loggedIn;
  loginButton.hidden = loggedIn;
  logoutButton.hidden = !loggedIn;
  walletActions.hidden = !loggedIn;
  accountMenuButton.hidden = !loggedIn;
  transactionsMenuButton.hidden = !loggedIn;
  partnerMenuButton.hidden = !loggedIn;
  settingsMenuButton.hidden = !loggedIn;
  accountSummary.hidden = !loggedIn;
  settingsList.hidden = !loggedIn;
  accountState.classList.toggle("real", accountMode === "real");
  const accountText = accountMode === "real" ? "Real USD" : "Demo";
  accountLabel.textContent = currentUser ? accountText : "";
  balance.textContent = formatMoney(currentWallet());
  if (botAccountLabel) botAccountLabel.textContent = `${accountText} ${formatMoney(currentWallet())}`;
  if (menuAccountId) {
    menuAccountId.hidden = !currentUser?.accountId;
    menuAccountId.textContent = currentUser?.accountId ? `ID ${currentUser.accountId}` : "";
    menuAccountId.title = currentUser?.accountId ? `Account ID ${currentUser.accountId}` : "";
  }
  renderAccountSummary();
}

function renderAccountSummary() {
  if (!summaryAccountId) return;
  if (!currentUser) {
    summaryAccountId.textContent = "Not logged in";
    summaryStatus.textContent = "Login required";
    summaryEmail.textContent = "Login or Get Started";
    return;
  }
  summaryAccountId.textContent = currentUser.accountId;
  summaryStatus.textContent = currentUser.emailVerified ? "Verified" : "Email pending";
  summaryEmail.textContent = currentUser.email;
}

function currentTick() {
  return digits[(index + digits.length - 1) % digits.length];
}

function renderTick() {
  const current = digits[index % digits.length];
  const previous = digits[(index + digits.length - 1) % digits.length];
  const older = digits[(index + digits.length - 2) % digits.length];
  const digitMoveAmount = current.digit - previous.digit;
  const delta = digitMoveAmount === 0 ? current.quote - previous.quote : digitMoveAmount / 100;
  const displayQuote = previous.quote + delta;

  lastDigit = current.digit;
  tickTape.push({ ...current, previousQuote: previous.quote, time: Date.now(), market: activeMarket });
  tickTape = tickTape.slice(-40);
  digitQuote.textContent = formatQuote(displayQuote);
  digitMove.textContent = `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}`;
  updateDigitStats(current.digit);
  renderDigitFrequency();

  index += 1;
  advanceContract(current, previous);
  runBotTick();
}

function renderDigitFrequency() {
  const max = Math.max(...digitStats);
  const min = Math.min(...digitStats);
  digitFrequency.innerHTML = digitStats
    .map((percentage, digit) => {
      const isLowest = percentage === min;
      const isHighest = percentage === max;
      const color = isLowest ? "#d95757" : isHighest ? "#31c48d" : "#d7dde3";
      const ringAngle = isHighest ? 235 : isLowest ? 42 : 64;
      const waiting = activeContract
        ? getContractWinningDigits(activeContract).filter((item) => Number.isInteger(item)).includes(digit)
        : false;
      const flashClass = resultFlash?.digit === digit ? (resultFlash.won ? " win-flash" : " loss-flash") : "";
      const isSelected =
        (activeTrade === "Over/Under" && digit === activeBarrier) ||
        ((activeTrade === "Matches/Differs" || activeTrade === "Touch/No Touch") && digit === activeTargetDigit);
      const className = `digit-ring${digit === lastDigit ? " current" : ""}${waiting ? " waiting" : ""}${
        isSelected ? " selected-digit" : ""
      }${flashClass}`;
      return `
        <button class="${className}" type="button" data-digit="${digit}" style="--ring-color: ${color}; --ring-angle: ${ringAngle}deg">
          <div class="ring-content">
            <strong>${digit}</strong>
            <span>${formatPercent(percentage)}</span>
          </div>
        </button>
      `;
    })
    .join("");
}

function updateDigitStats(digit) {
  statTickCounter += 1;
  if (Date.now() > dominantUntil) {
    dominantDigit = digit;
    dominantUntil = Date.now() + 60000 + Math.floor(Math.random() * 60000);
  }

  digitStats = digitStats.map((value, statDigit) => {
    const anchor = statDigit === dominantDigit ? 12.15 : 9.55 + ((statDigit * 7) % 5) * 0.08;
    const tickLift = statDigit === digit ? 0.035 : 0;
    const next = value + (anchor - value) * 0.035 + tickLift;
    return Math.max(8.3, Math.min(12.4, next));
  });

  const total = digitStats.reduce((sum, value) => sum + value, 0);
  digitStats = digitStats.map((value, statDigit) => {
    const normalized = (value / total) * 100;
    return normalized + statDigit * 0.013;
  });
  digitStats = makePercentagesDistinct(digitStats);
}

function formatPercent(value) {
  const rounded = Number(value.toFixed(1));
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded}%`;
}

function makePercentagesDistinct(values) {
  const seen = new Map();
  return values.map((value, digit) => {
    const key = value.toFixed(1);
    const count = seen.get(key) || 0;
    seen.set(key, count + 1);
    return count === 0 ? value : value + (digit + 1) * 0.03;
  });
}

function renderChoices() {
  if (!tradeChoices[activeTrade]) activeTrade = "Even/Odd";
  const choices = tradeChoices[activeTrade];
  if (!choices.includes(activeChoice)) activeChoice = choices[0];
  choiceRow.innerHTML = tradeChoices[activeTrade]
    .map((choice, choiceIndex) => {
      const selectedClass = choiceTouched && choice === activeChoice ? " selected" : "";
      const rate = getPayoutRate(activeTrade, choice, activeBarrier, activeTargetDigit);
      const stake = Number(stakeInput.value) || 0;
      const payout = rate ? stake * rate : 0;
      const profitPercent = rate ? Math.max(0, (rate - 1) * 100) : 0;
      const detail =
        activeTrade === "Over/Under"
          ? `${choice} ${activeBarrier}`
          : activeTrade === "Matches/Differs" || activeTrade === "Touch/No Touch"
            ? `${choice} ${activeTargetDigit}`
            : choice;
      const toneClass = choiceIndex === 0 ? " positive-choice" : " negative-choice";
      const iconClass = choiceIndex === 0 ? "choice-icon-grid" : "choice-icon-triangle";
      return `
        <button class="choice${toneClass}${selectedClass}" type="button" data-choice="${choice}" ${activeContract ? "disabled" : ""}>
          <span class="choice-payout">
            <span>Payout <strong>${rate ? `${payout.toFixed(2)} USD` : "Unavailable"}</strong></span>
            <span class="choice-info" aria-hidden="true">i</span>
          </span>
          <span class="choice-bar">
            <span class="choice-label">
              <span class="choice-icon ${iconClass}" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
              <span class="choice-main">${detail}</span>
            </span>
            <span class="choice-percent">${rate ? `${profitPercent.toFixed(2)}%` : "--"}</span>
          </span>
        </button>
      `;
    })
    .join("");
  selectedTrade.textContent = activeTrade;
  tradeHint.textContent = hints[activeTrade] || "Choose a contract";
  renderDigitFrequency();
}
function getPayoutRate(trade = activeTrade, choice = activeChoice, barrier = activeBarrier, targetDigit = activeTargetDigit) {
  const winningCount = getWinningDigitCount(trade, choice, barrier, targetDigit);
  if (winningCount <= 0) return null;
  const probability = winningCount / 10;
  const houseFactor = (trade === "Matches/Differs" && choice === "Matches") || (trade === "Touch/No Touch" && choice === "Touch") ? 0.9 : 0.94;
  return Math.max(1.03, Math.min(9.2, houseFactor / probability));
}

function getWinningDigitCount(trade = activeTrade, choice = activeChoice, barrier = activeBarrier, targetDigit = activeTargetDigit) {
  if (trade === "Rise/Fall") return 5;
  if (trade === "Even/Odd") return 5;
  if (trade === "Matches/Differs") return choice === "Matches" ? 1 : 9;
  if (trade === "Touch/No Touch") return choice === "Touch" ? 1 : 9;
  if (trade === "Over/Under") return choice === "Over" ? Math.max(0, 9 - barrier) : Math.max(0, barrier);
  return 0;
}

function currentPayout() {
  const stake = Number(stakeInput.value) || 0;
  const rate = getPayoutRate();
  return rate ? stake * rate : 0;
}

function updatePayoutPreview() {
  if (!payoutQuote) return;
  const rate = getPayoutRate();
  payoutQuote.textContent = rate ? `${formatMoney(currentPayout())} x${rate.toFixed(2)}` : "Unavailable";
}

function setTradeType(button) {
  document.querySelectorAll(".trade-type").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
  activeTrade = button.dataset.tradeType;
  activeChoice = tradeChoices[activeTrade][0];
  choiceTouched = false;
  if (activeTrade === "Over/Under") activeBarrier = activeChoice === "Over" ? 1 : 9;
  if (activeTrade === "Matches/Differs" || activeTrade === "Touch/No Touch") activeTargetDigit = lastDigit;
  renderChoices();
  tradeStatus.textContent = `${activeTrade} selected on ${marketLabels[activeMarket]}.`;
  saveState();
}

function getWinningDigits() {
  if (activeTrade === "Rise/Fall") {
    return [];
  }
  if (activeTrade === "Even/Odd") {
    return activeChoice === "Even" ? [0, 2, 4, 6, 8] : [1, 3, 5, 7, 9];
  }
  if (activeTrade === "Matches/Differs") {
    return activeChoice === "Matches"
      ? [activeTargetDigit]
      : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((digit) => digit !== activeTargetDigit);
  }
  if (activeTrade === "Touch/No Touch") {
    return activeChoice === "Touch"
      ? [activeTargetDigit]
      : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((digit) => digit !== activeTargetDigit);
  }
  if (activeTrade === "Over/Under") {
    return activeChoice === "Over"
      ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((digit) => digit > activeBarrier)
      : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((digit) => digit < activeBarrier);
  }
  return [];
}

function getContractWinningDigits(contract) {
  const savedTrade = activeTrade;
  const savedChoice = activeChoice;
  const savedBarrier = activeBarrier;
  const savedTargetDigit = activeTargetDigit;
  activeTrade = contract.trade;
  activeChoice = contract.choice;
  activeBarrier = contract.barrier;
  activeTargetDigit = contract.targetDigit;
  const winners = getWinningDigits();
  activeTrade = savedTrade;
  activeChoice = savedChoice;
  activeBarrier = savedBarrier;
  activeTargetDigit = savedTargetDigit;
  return winners;
}

function openMarketSheet() {
  marketSheet.classList.add("open");
  marketSheet.setAttribute("aria-hidden", "false");
}

function closeMarketSheet() {
  marketSheet.classList.remove("open");
  marketSheet.setAttribute("aria-hidden", "true");
}

function setMarket(option) {
  setMarketByName(option.dataset.market);
  tradeStatus.textContent = `Ready to trade on ${marketLabels[activeMarket]}.`;
  renderTick();
  closeMarketSheet();
  saveState();
}

function setMarketByName(name) {
  activeMarket = name;
  marketName.textContent = marketLabels[activeMarket];
  marketDescription.textContent = marketDescriptions[activeMarket];
  digits = [...marketSeeds[activeMarket]];
  index = 0;
  digitStats = [10.2, 9.9, 8.2, 9.6, 10.8, 9.7, 10.9, 10.2, 10, 10.5];
  document.querySelectorAll(".market-option").forEach((item) => item.classList.remove("selected"));
  const option = document.querySelector(`.market-option[data-market="${activeMarket}"]`);
  if (option) option.classList.add("selected");
}

function tradeWins(tick, previous) {
  if (activeTrade === "Even/Odd") {
    return activeChoice === "Even" ? tick.digit % 2 === 0 : tick.digit % 2 === 1;
  }
  if (activeTrade === "Rise/Fall") {
    return activeChoice === "Rise" ? tick.quote >= previous.quote : tick.quote < previous.quote;
  }
  if (activeTrade === "Matches/Differs") {
    return activeChoice === "Matches" ? tick.digit === activeTargetDigit : tick.digit !== activeTargetDigit;
  }
  if (activeTrade === "Touch/No Touch") {
    return activeChoice === "Touch" ? tick.digit === activeTargetDigit : tick.digit !== activeTargetDigit;
  }
  if (activeTrade === "Over/Under") {
    return activeChoice === "Over" ? tick.digit > activeBarrier : tick.digit < activeBarrier;
  }
  return false;
}

function buyContract() {
  const stake = Number(stakeInput.value);
  const ticks = Number(ticksInput.value);
  const payoutRate = getPayoutRate();
  if (!payoutRate) {
    tradeStatus.textContent = `${activeChoice} ${activeBarrier} has no winning digits. Choose another number.`;
    return;
  }
  const payout = stake * payoutRate;
  const profit = Math.max(0, payout - stake);
  if (!currentUser) {
    tradeStatus.textContent = "Login or create an account before trading.";
    openAuth("login");
    return;
  }
  if (activeContract) {
    tradeStatus.textContent = `Contract running. ${activeContract.remaining} ticks left.`;
    return;
  }
  if (accountMode === "real" && !userSettings.realTradingEnabled) {
    tradeStatus.textContent = "Real trading is disabled in Settings.";
    return;
  }
  if (stake > Number(userSettings.maximumStakeLimit || 100)) {
    tradeStatus.textContent = `Stake is above your maximum limit of ${formatMoney(Number(userSettings.maximumStakeLimit || 100))}.`;
    return;
  }
  if (!Number.isFinite(stake) || stake < 0.3 || stake > currentWallet()) {
    tradeStatus.textContent = "Enter a stake from 0.30 USD that is available in your balance.";
    return;
  }

  setCurrentWallet(currentWallet() - stake);
  renderAccount();
  saveState();
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
  };
  tradeStatus.textContent = `${activeChoice} contract started. Payout ${formatMoney(payout)} x${payoutRate.toFixed(2)}. ${ticks} ticks left.`;
  renderChoices();
  renderDigitFrequency();
}

function startDemoContract(choiceOverride) {
  if (choiceOverride) activeChoice = choiceOverride;
  buyContract();
}

function advanceContract(tick, previous) {
  if (!activeContract) return;
  activeContract.remaining -= 1;

  if (activeContract.remaining > 0) {
    tradeStatus.textContent = `${activeContract.choice} running. ${activeContract.remaining} ticks left.`;
    return;
  }

  const savedTrade = activeTrade;
  const savedChoice = activeChoice;
  const savedBarrier = activeBarrier;
  const savedTargetDigit = activeTargetDigit;
  activeTrade = activeContract.trade;
  activeChoice = activeContract.choice;
  activeBarrier = activeContract.barrier;
  activeTargetDigit = activeContract.targetDigit;
  const won = tradeWins(tick, previous);
  activeTrade = savedTrade;
  activeChoice = savedChoice;
  activeBarrier = savedBarrier;
  activeTargetDigit = savedTargetDigit;

  const profit = activeContract.profit;
  if (won) setCurrentWallet(currentWallet() + activeContract.payout);
  renderAccount();
  tradeStatus.textContent = won
    ? `${activeContract.choice} won on digit ${tick.digit}. Profit ${formatMoney(profit)}.`
    : `${activeContract.choice} lost on digit ${tick.digit}.`;
  resultFlash = { digit: tick.digit, won };
  renderDigitFrequency();
  setTimeout(() => {
    resultFlash = null;
    renderDigitFrequency();
  }, 1400);
  addHistoryItem({
    won,
    digit: tick.digit,
    market: activeMarket,
    trade: activeContract.trade,
    choice: activeContract.choice,
    stake: activeContract.stake,
    payout: won ? activeContract.payout : 0,
  });
  recordTradeEvent({
    tradeType: `${activeContract.trade} ${activeContract.choice}`,
    stake: activeContract.stake,
    profit: won ? profit : -activeContract.stake,
  });
  activeContract = null;
  renderChoices();
  saveState();
}

async function resetWallet() {
  activeContract = null;
  if (accountMode === "demo") wallet = 10000;
  if (accountMode === "real" && currentUser?.email && !currentUser.localOnly) {
    try {
      await refreshCurrentUser();
    } catch {}
  }
  tradeHistory = [];
  resetBotSession("Bot restarted. Ready to run again.");
  renderAccount();
  renderChoices();
  renderHistory();
  tradeStatus.textContent =
    accountMode === "real"
      ? `Trades reset. Real balance kept at ${formatMoney(realWallet)}.`
      : `Balance reset. Ready to trade on ${marketLabels[activeMarket]}.`;
  saveState();
}

function depositDemoFunds() {
  if (!currentUser) {
    openAuth("login");
    authStatus.textContent = "Login or create an account before depositing.";
    return;
  }
  depositSheet.classList.add("open");
  depositSheet.setAttribute("aria-hidden", "false");
  updateMpesaPreview();
  checkDeposit.hidden = !pendingDeposit;
  depositStatus.textContent =
    pendingDeposit
      ? `${formatMoney(pendingDeposit.usdAmount)} deposit is waiting for M-Pesa confirmation.`
      :
    window.location.protocol === "file:"
      ? "Deposit works on the published website, not the local file preview."
      : `${formatMoney(Number(depositAmount.value) || 1)} equals ${formatKes(getKesDepositAmount())}. Balance appears after payment is received.`;
}

function withdrawDemoFunds() {
  if (!requireLoginForPanel(withdrawStatus)) return;
  withdrawPhone.value = userSettings.withdrawalPhone || currentUser.phone || "";
  withdrawSheet.classList.add("open");
  withdrawSheet.setAttribute("aria-hidden", "false");
  withdrawStatus.textContent = accountMode === "real" ? "Withdrawals use Real account balance." : "Switch to Real account before withdrawal.";
}

function addHistoryItem(result) {
  tradeHistory.unshift(result);
  tradeHistory = tradeHistory.slice(0, 5);
  renderHistory();
}

function recordTradeEvent({ tradeType, stake, profit }) {
  const record = {
    type: "trade",
    amount: stake,
    profit,
    status: profit >= 0 ? "win" : "loss",
    accountType: accountMode === "real" ? "Real" : "Demo",
    balanceAfter: currentWallet(),
    reference: `local-trade-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  addLocalTransaction(record);
  if (!currentUser?.email || window.location.protocol === "file:") return;
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
  historyCount.textContent = tradeHistory.length;
  if (tradeHistory.length === 0) {
    historyList.innerHTML = "<p>No trades yet.</p>";
    return;
  }

  historyList.innerHTML = tradeHistory
    .map((item) => {
      const resultClass = item.won ? "win" : "loss";
      const resultText = item.won ? `+${formatMoney(item.payout - item.stake)}` : `-${formatMoney(item.stake)}`;
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

function saveState() {
  const state = {
    activeMarket,
    wallet,
    realWallet,
    accountMode,
    activeTrade,
    activeChoice,
    choiceTouched,
    activeBarrier,
    activeTargetDigit,
    tradeHistory,
    botHistory,
    botSession,
    botStatusText,
    userSettings,
    transactionHistory,
    partnerData,
    pendingDeposit,
    currentUser,
    currentUserEmail: currentUser?.email || "",
    stake: stakeInput.value,
    ticks: ticksInput.value,
  };
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function loadState() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return;

  try {
    const state = JSON.parse(stored);
    if (marketSeeds[state.activeMarket]) setMarketByName(state.activeMarket);
    if (Number.isFinite(state.wallet)) wallet = state.wallet;
    if (Number.isFinite(state.realWallet)) realWallet = state.realWallet;
    if (state.accountMode === "demo" || state.accountMode === "real") accountMode = state.accountMode;
    if (tradeChoices[state.activeTrade]) activeTrade = state.activeTrade;
    else activeTrade = "Even/Odd";
    if (tradeChoices[activeTrade]?.includes(state.activeChoice)) activeChoice = state.activeChoice;
    choiceTouched = Boolean(state.choiceTouched);
    if (Number.isInteger(state.activeBarrier)) activeBarrier = state.activeBarrier;
    if (Number.isInteger(state.activeTargetDigit)) activeTargetDigit = state.activeTargetDigit;
    if (Array.isArray(state.tradeHistory)) tradeHistory = state.tradeHistory.slice(0, 5);
    if (Array.isArray(state.botHistory)) botHistory = state.botHistory.slice(0, 20);
    if (state.botSession && typeof state.botSession === "object") botSession = { ...botSession, ...state.botSession };
    if (typeof state.botStatusText === "string") botStatusText = state.botStatusText;
    if (state.userSettings && typeof state.userSettings === "object") userSettings = { ...userSettings, ...state.userSettings };
    if (Array.isArray(state.transactionHistory)) transactionHistory = state.transactionHistory.slice(0, 100);
    if (state.partnerData && typeof state.partnerData === "object" && state.currentUser?.partnerId) partnerData = state.partnerData;
    if (state.pendingDeposit && typeof state.pendingDeposit === "object") pendingDeposit = state.pendingDeposit;
    if (state.currentUser && typeof state.currentUser === "object") currentUser = state.currentUser;
    if (state.stake) stakeInput.value = state.stake;
    if (state.ticks) ticksInput.value = state.ticks;
    renderAccount();
    renderBotHistory();
    renderBotStats();
    setBotStatus(botStatusText);
    renderSettingsForm();
    renderTransactions();
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function openAuth(mode = "register") {
  authSheet.classList.add("open");
  authSheet.setAttribute("aria-hidden", "false");
  document.body.classList.add("auth-open");
  aiFloatButton.hidden = true;
  setAuthMode(mode);
}

function closeAuthSheet() {
  authSheet.classList.remove("open");
  authSheet.setAttribute("aria-hidden", "true");
  document.body.classList.remove("auth-open");
  aiFloatButton.hidden = false;
}

function setAuthMode(mode) {
  const isRegister = mode === "register";
  registerTab.classList.toggle("active", isRegister);
  loginTab.classList.toggle("active", !isRegister);
  registerForm.classList.toggle("active-auth-form", isRegister);
  loginForm.classList.toggle("active-auth-form", !isRegister);
  authTitle.textContent = isRegister ? "Create Account" : "Login";
  authStatus.textContent = isRegister
    ? "Email verification will be required after account creation."
    : "Enter your email and password to access your account.";
}

function readLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(localUsersKey) || "[]");
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(localUsersKey, JSON.stringify(users));
}

function applyAccountResetVersion() {
  if (localStorage.getItem(accountResetKey) === accountResetVersion) return;
  localStorage.removeItem(storageKey);
  localStorage.removeItem(localUsersKey);
  localStorage.setItem(accountResetKey, accountResetVersion);
}

function createLocalAccountId() {
  return `MB${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
}

function isAccountServiceError(message) {
  return /Account service|MONGODB_URI|not configured|database|being connected|Request failed|Failed to fetch|NetworkError|Load failed/i.test(
    message
  );
}

function createOfflineAccount({ fullName, email, phone, country, documentType, password }) {
  const localUsers = readLocalUsers();
  if (localUsers.some((user) => user.email === email || user.phone === phone)) {
    authStatus.textContent = "This account already exists on this phone. Login instead.";
    setAuthMode("login");
    return false;
  }
  currentUser = {
    accountId: createLocalAccountId(),
    fullName,
    email,
    phone,
    country,
    documentType,
    password,
    referredBy: referralCodeFromUrl,
    emailVerified: false,
    demoBalance: 10000,
    realBalance: 0,
    partnerBalance: 0,
    settings: {
      ...userSettings,
      profileName: fullName,
      email,
      phone,
      depositPhone: phone,
      withdrawalPhone: phone,
    },
    createdAt: new Date().toISOString(),
    localOnly: true,
  };
  localUsers.push(currentUser);
  saveLocalUsers(localUsers);
  return true;
}

function loginOfflineAccount(email, password) {
  const localUser = readLocalUsers().find((user) => user.email === email && user.password === password);
  if (!localUser) return false;
  currentUser = localUser;
  return true;
}

function createRecoveredLocalLogin(email, password) {
  const localUsers = readLocalUsers();
  const existing = localUsers.find((user) => user.email === email);
  if (existing) {
    currentUser = existing;
    currentUser.password = password;
  } else {
    const name = email.split("@")[0].replace(/[._-]+/g, " ").trim() || "MetaBinary User";
    currentUser = {
      accountId: createLocalAccountId(),
      fullName: name,
      email,
      phone: "",
      country: "",
      documentType: "",
      password,
      referredBy: referralCodeFromUrl,
      emailVerified: false,
      demoBalance: 10000,
      realBalance: 0,
      partnerBalance: 0,
      settings: {
        ...userSettings,
        profileName: name,
        email,
      },
      createdAt: new Date().toISOString(),
      localOnly: true,
      recoveredLogin: true,
    };
    localUsers.push(currentUser);
  }
  saveLocalUsers(localUsers);
  return currentUser;
}

async function postJson(url, body) {
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Account service is being connected. Please try again shortly.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.error || data.message || `Request failed (${res.status}).`;
    const cleanMessage = isAccountServiceError(message)
      ? "Account service is being connected. Please try again shortly."
      : message;
    throw new Error(cleanMessage);
  }
  return data;
}

async function getJson(url) {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed.");
  return data;
}

async function refreshCurrentUser() {
  if (!currentUser?.email || window.location.protocol === "file:") return false;
  const data = await getJson(`/api/user/${encodeURIComponent(currentUser.email)}`);
  applyServerUser(data.user);
  renderAccount();
  saveState();
  return true;
}

async function putJson(url, body) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed.");
  return data;
}

function requireLoginForPanel(statusTarget) {
  if (currentUser) return true;
  openAuth("login");
  if (statusTarget) statusTarget.textContent = "Login first.";
  return false;
}

function addLocalTransaction(record) {
  transactionHistory.unshift({
    reference: record.reference || `local-${Date.now()}`,
    createdAt: record.createdAt || new Date().toISOString(),
    ...record,
  });
  transactionHistory = transactionHistory.slice(0, 100);
  saveState();
}

function renderTransactions() {
  if (!transactionHistory.length) {
    transactionList.innerHTML = "<p>No transactions yet.</p>";
    return;
  }
  transactionList.innerHTML = transactionHistory
    .map((item) => `
      <div class="transaction-item">
        <div>
          <strong>${item.type || "transaction"} · ${item.status || "pending"}</strong>
          <span>${new Date(item.createdAt || Date.now()).toLocaleString()} · ${item.reference || ""}</span>
        </div>
        <div>
          <strong>${formatMoney(Number(item.amount || item.profit || 0))}</strong>
          <span>${item.accountType || "Account"} · Bal ${formatMoney(Number(item.balanceAfter || 0))}</span>
        </div>
      </div>
    `)
    .join("");
}

async function refreshUserFromBackend() {
  if (!currentUser?.email || window.location.protocol === "file:") return;
  const data = await getJson(`/api/user/${encodeURIComponent(currentUser.email)}`);
  applyServerUser(data.user);
  renderAccount();
  saveState();
}

async function handleRegister(event) {
  event.preventDefault();
  if (window.location.protocol === "file:") {
    authStatus.textContent = "Open the published website to create a shared account.";
    return;
  }
  const fullName = document.querySelector("#registerName").value.trim();
  const email = document.querySelector("#registerEmail").value.trim().toLowerCase();
  const phone = document.querySelector("#registerPhone").value.trim();
  const country = document.querySelector("#registerCountry").value;
  const documentType = document.querySelector("#registerDocument").value;
  const password = document.querySelector("#registerPassword").value;
  const passwordConfirm = document.querySelector("#registerPasswordConfirm").value;
  const agreed = document.querySelector("#registerAgreement").checked;

  if (password !== passwordConfirm) {
    authStatus.textContent = "Passwords do not match.";
    return;
  }
  if (!agreed) {
    authStatus.textContent = "Confirm you are 18+ and agree before creating the account.";
    return;
  }

  const submit = registerForm.querySelector(".auth-submit");
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
    if (isAccountServiceError(error.message)) {
      if (createOfflineAccount({ fullName, email, phone, country, documentType, password })) {
        registerForm.reset();
        renderAccount();
        saveState();
        authStatus.textContent = "Account created on this phone. Add MongoDB in Vercel for login on other phones.";
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
  if (window.location.protocol === "file:") {
    authStatus.textContent = "Open the published website to login from any device.";
    return;
  }
  const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
  const password = document.querySelector("#loginPassword").value;
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
    if (isAccountServiceError(error.message)) {
      if (loginOfflineAccount(email, password)) {
        loginForm.reset();
        renderAccount();
        saveState();
        authStatus.textContent = `Logged in as ${currentUser.accountId} on this phone.`;
        setTimeout(closeAuthSheet, 800);
      } else {
        authStatus.textContent = "No registered account found for that email and password. Please register first.";
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
  partnerData = null;
  activeContract = null;
  accountMode = "demo";
  renderChoices();
  tradeStatus.textContent = "Logged out. Login or Get Started to trade.";
  renderAccount();
  saveState();
}

async function resetPassword() {
  const email = currentUser?.email || document.querySelector("#loginEmail")?.value.trim().toLowerCase();
  if (!email) {
    authStatus.textContent = "Enter your email first, then request password reset.";
    return;
  }
  if (window.location.protocol === "file:") {
    authStatus.textContent = "Open the published website to request password reset.";
    return;
  }

  try {
    const data = await postJson("/api/reset-password", { email });
    authStatus.textContent = data.message;
  } catch (error) {
    authStatus.textContent = error.message;
  }
}

async function verifyCurrentEmail() {
  if (!currentUser) {
    openAuth("login");
    authStatus.textContent = "Login before verifying email.";
    return;
  }
  if (window.location.protocol === "file:") {
    tradeStatus.textContent = "Open the published website to verify email.";
    return;
  }

  try {
    const data = await postJson("/api/verify-email", { email: currentUser.email });
    currentUser = data.user;
    renderAccount();
    saveState();
    tradeStatus.textContent = data.message || "Email verified for this account.";
  } catch (error) {
    tradeStatus.textContent = error.message;
  }
}

document.querySelectorAll(".trade-type").forEach((button) => {
  button.addEventListener("click", () => setTradeType(button));
});

choiceRow.addEventListener("click", (event) => {
  const button = event.target.closest(".choice");
  if (!button) return;
  choiceRow.querySelectorAll(".choice").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
  activeChoice = button.dataset.choice;
  choiceTouched = true;
  renderDigitFrequency();
  updatePayoutPreview();
  saveState();
});

digitFrequency.addEventListener("click", (event) => {
  const button = event.target.closest(".digit-ring");
  if (!button) return;
  const value = Number(button.dataset.digit);
  if (activeTrade !== "Over/Under" && activeTrade !== "Matches/Differs" && activeTrade !== "Touch/No Touch") return;
  if (activeTrade === "Over/Under") activeBarrier = value;
  if (activeTrade === "Matches/Differs" || activeTrade === "Touch/No Touch") activeTargetDigit = value;
  renderDigitFrequency();
  updatePayoutPreview();
  tradeStatus.textContent =
    activeTrade === "Over/Under"
      ? `${activeChoice} ${activeBarrier} selected.`
      : `${activeChoice} digit ${activeTargetDigit} selected.`;
  saveState();
});

if (changeMarket) changeMarket.addEventListener("click", openMarketSheet);
const marketTrigger = marketSelector || marketName;
marketTrigger.addEventListener("click", openMarketSheet);
marketTrigger.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openMarketSheet();
  }
});
closeMarket.addEventListener("click", closeMarketSheet);
marketSheet.addEventListener("click", (event) => {
  if (event.target === marketSheet) closeMarketSheet();
  const option = event.target.closest(".market-option");
  if (option) setMarket(option);
});

sellButton.addEventListener("click", buyContract);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    Object.values(tabPanels).forEach((panel) => panel.classList.remove("active-panel"));
    tabPanels[button.dataset.tab].classList.add("active-panel");
  });
});

botRunButton.addEventListener("click", startBot);
botStopButton.addEventListener("click", () => stopBot("Bot stopped"));
backToBotsButton?.addEventListener("click", closeBotWorkspace);
botZoomOut?.addEventListener("click", () => setBotZoom(botZoom - 0.1));
botZoomIn?.addEventListener("click", () => setBotZoom(botZoom + 0.1));
botZoomReset?.addEventListener("click", () => setBotZoom(0.5));
loadBotButtons.forEach((button) => {
  button.addEventListener("click", () => loadFreeBotTemplate(button.dataset.botTemplate));
});

function setBotZoom(value) {
  updateBotZoom(value);
}

function updateBotZoom(value, originEvent) {
  const nextZoom = Math.max(0.5, Math.min(1.8, Number(value) || 0.5));
  const previousZoom = botZoom || 1;
  if (botCanvas && originEvent) {
    const rect = botCanvas.getBoundingClientRect();
    const offsetX = originEvent.clientX - rect.left;
    const offsetY = originEvent.clientY - rect.top;
    const contentX = (botCanvas.scrollLeft + offsetX) / previousZoom;
    const contentY = (botCanvas.scrollTop + offsetY) / previousZoom;
    botZoom = nextZoom;
    if (botWorkspace) botWorkspace.style.setProperty("--bot-zoom", botZoom.toFixed(2));
    if (botCanvasInner) botCanvasInner.style.setProperty("--bot-zoom", botZoom.toFixed(2));
    botCanvas.scrollLeft = contentX * botZoom - offsetX;
    botCanvas.scrollTop = contentY * botZoom - offsetY;
  } else {
    botZoom = nextZoom;
    if (botWorkspace) botWorkspace.style.setProperty("--bot-zoom", botZoom.toFixed(2));
    if (botCanvasInner) botCanvasInner.style.setProperty("--bot-zoom", botZoom.toFixed(2));
  }
  if (botZoomLabel) botZoomLabel.textContent = `${Math.round(botZoom * 100)}%`;
}

function canDragBotCanvas(target) {
  return !target.closest("input, select, button, textarea, label");
}

function getPointerDistance(points) {
  const [a, b] = points;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function getPointerCenter(points) {
  const [a, b] = points;
  return {
    clientX: (a.clientX + b.clientX) / 2,
    clientY: (a.clientY + b.clientY) / 2,
  };
}

botCanvas?.addEventListener("wheel", (event) => {
  if (!event.ctrlKey && !event.metaKey) return;
  event.preventDefault();
  const direction = event.deltaY > 0 ? -0.08 : 0.08;
  updateBotZoom(botZoom + direction, event);
}, { passive: false });

botCanvas?.addEventListener("pointerdown", (event) => {
  botCanvasPointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });
  if (botCanvasPointers.size === 1 && !canDragBotCanvas(event.target)) return;
  botCanvas.setPointerCapture(event.pointerId);
  botCanvas.classList.add("dragging");
  if (botCanvasPointers.size === 2) {
    const points = Array.from(botCanvasPointers.values());
    botPinchStart = { distance: getPointerDistance(points), zoom: botZoom };
    botCanvasDrag = null;
  } else {
    botCanvasDrag = {
      x: event.clientX,
      y: event.clientY,
      left: botCanvas.scrollLeft,
      top: botCanvas.scrollTop,
    };
  }
});

botCanvas?.addEventListener("pointermove", (event) => {
  if (!botCanvasPointers.has(event.pointerId)) return;
  botCanvasPointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });
  if (botCanvasPointers.size === 2 && botPinchStart) {
    event.preventDefault();
    const points = Array.from(botCanvasPointers.values());
    const center = getPointerCenter(points);
    const nextZoom = botPinchStart.zoom * (getPointerDistance(points) / Math.max(1, botPinchStart.distance));
    updateBotZoom(nextZoom, center);
    return;
  }
  if (!botCanvasDrag) return;
  event.preventDefault();
  botCanvas.scrollLeft = botCanvasDrag.left - (event.clientX - botCanvasDrag.x);
  botCanvas.scrollTop = botCanvasDrag.top - (event.clientY - botCanvasDrag.y);
});

function endBotCanvasPointer(event) {
  botCanvasPointers.delete(event.pointerId);
  if (botCanvasPointers.size < 2) botPinchStart = null;
  if (botCanvasPointers.size === 0) {
    botCanvasDrag = null;
    botCanvas?.classList.remove("dragging");
  }
}

botCanvas?.addEventListener("pointerup", endBotCanvasPointer);
botCanvas?.addEventListener("pointercancel", endBotCanvasPointer);

botCanvas?.addEventListener("touchstart", (event) => {
  if (event.touches.length !== 2) return;
  const points = [event.touches[0], event.touches[1]];
  botTouchPinchStart = {
    distance: getPointerDistance(points),
    zoom: botZoom,
  };
}, { passive: true });

botCanvas?.addEventListener("touchmove", (event) => {
  if (event.touches.length !== 2 || !botTouchPinchStart) return;
  event.preventDefault();
  const points = [event.touches[0], event.touches[1]];
  const center = getPointerCenter(points);
  const nextZoom = botTouchPinchStart.zoom * (getPointerDistance(points) / Math.max(1, botTouchPinchStart.distance));
  updateBotZoom(nextZoom, center);
}, { passive: false });

botCanvas?.addEventListener("touchend", (event) => {
  if (event.touches.length < 2) botTouchPinchStart = null;
});

function loadFreeBotTemplate(templateKey) {
  const template = freeBotTemplates[templateKey] || freeBotTemplates.pulse;
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
  botSession.currentStake = Number(template.stake);
  botSession.baseStake = Number(template.stake);
  if (selectedBotName) selectedBotName.textContent = template.name;
  if (selectedBotDescription) selectedBotDescription.textContent = template.description;
  if (botWorkspaceTitle) botWorkspaceTitle.textContent = template.name.replace(" loaded", "");
  if (botWorkspaceDescription) botWorkspaceDescription.textContent = template.description;
  openBotWorkspace();
  freeBotCards.forEach((card) => {
    card.classList.toggle("selected-bot-card", card.dataset.botTemplate === templateKey);
  });
  setBotStatus(`${template.name.replace(" loaded", "")} is ready`);
  renderBotStats();
  saveState();
}

function openBotWorkspace() {
  if (!botWorkspace) return;
  setBotZoom(botZoom);
  botWorkspace.hidden = false;
  if (botHistoryBlock) botHistoryBlock.hidden = false;
  if (botControlBar) botControlBar.hidden = false;
  botBuilder?.classList.add("bot-workspace-mode");
  requestAnimationFrame(() => {
    botWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function closeBotWorkspace() {
  botBuilder?.classList.remove("bot-workspace-mode");
  if (botWorkspace) botWorkspace.hidden = true;
  if (botHistoryBlock) botHistoryBlock.hidden = true;
  if (botControlBar) botControlBar.hidden = true;
}

function readBotConfig() {
  const stake = Math.max(0.3, Number(botStake.value) || 0.3);
  botStake.value = stake.toFixed(1).replace(".0", "");
  return {
    market: botMarket.value,
    tradeType: botTradeType.value,
    duration: Math.max(1, Math.min(10, Number(botDuration.value) || 1)),
    stake,
    takeProfit: Math.max(0, Number(botTakeProfit.value) || 0),
    stopLoss: Math.max(0, Number(botStopLoss.value) || 0),
    recovery: botRecovery.value,
    multiplier: Math.max(1, Number(botMultiplier.value) || 2),
    maxSteps: Math.max(1, Number(botMaxSteps.value) || 6),
    direction: botDirection.value,
    barrier: Math.max(0, Math.min(9, Math.round(Number(botBarrier.value) || 5))),
    runOnce: botRunOnce.value === "Yes",
  };
}

function setBotStatus(text) {
  botStatusText = text;
  botStatus.textContent = text;
  botBottomStatus.textContent = text;
  if (botWorkspaceStatus) {
    botWorkspaceStatus.textContent = botRunning ? "Running" : /ready/i.test(text) ? "Ready" : "Stopped";
  }
  if (botCanvasStatus) {
    botCanvasStatus.textContent = text;
  }
  updateBotLivePanel();
}

function updateBotLivePanel(latestResult) {
  if (!botLiveTradeType) return;
  const config = botMarket ? readBotConfig() : null;
  const tradeLabel = botOpenTrade
    ? `${botOpenTrade.tradeType} ${botOpenTrade.choice}`
    : config
      ? `${config.tradeType}${config.direction !== "Auto" ? ` ${config.direction}` : ""}`
      : "Not loaded";
  botLiveTradeType.textContent = tradeLabel;
  botLiveMarket.textContent = botOpenTrade
    ? marketLabels[botOpenTrade.market] || botOpenTrade.market
    : config
      ? marketLabels[config.market] || config.market
      : "-";
  botLiveStake.textContent = formatMoney(botOpenTrade?.stake || botSession.currentStake || Number(botStake?.value || 0));
  botLiveTransaction.textContent =
    latestResult ||
    (botOpenTrade
      ? `Open - ${botOpenTrade.remaining} ticks left`
      : botRunning
        ? "Scanning for entry"
        : botStatusText || "Waiting for bot");
}

function startBot() {
  const config = readBotConfig();
  if (!currentUser) {
    openAuth("login");
    authStatus.textContent = "Login before running the bot.";
    return;
  }
  if (accountMode === "real" && !userSettings.realTradingEnabled) {
    setBotStatus("Bot stopped: Real trading is disabled in Settings");
    return;
  }
  if (config.stake > Number(userSettings.maximumStakeLimit || 100)) {
    setBotStatus(`Bot stopped: stake is above ${formatMoney(Number(userSettings.maximumStakeLimit || 100))}`);
    return;
  }
  if (currentWallet() < config.stake) {
    setBotStatus("Bot stopped: balance is too low");
    return;
  }
  botRunning = true;
  botOpenTrade = null;
  botTicks = 0;
  botSession = {
    netProfit: 0,
    currentStake: config.stake,
    baseStake: config.stake,
    martingaleLevel: 0,
    scanTicks: config.runOnce ? 2 : 0,
  };
  setBotStatus("Bot scanning market");
  botWorkspace?.scrollIntoView({ behavior: "smooth", block: "start" });
  renderBotStats();
}

function stopBot(reason = "Bot stopped") {
  botRunning = false;
  botOpenTrade = null;
  setBotStatus(reason);
  renderBotStats();
  saveState();
}

function resetBotSession(reason = "Bot restarted. Ready to run again.") {
  botRunning = false;
  botOpenTrade = null;
  botTicks = 0;
  const config = botMarket ? readBotConfig() : null;
  const baseStake = config?.stake || Math.max(0.3, Number(botStake?.value || 0.3));
  botSession = {
    netProfit: 0,
    currentStake: baseStake,
    baseStake,
    martingaleLevel: 0,
    scanTicks: 0,
  };
  botHistory = [];
  setBotStatus(reason);
  renderBotStats();
  renderBotHistory();
  updateBotLivePanel("Waiting for bot");
}

function runBotTick() {
  if (!botRunning) return;
  const config = readBotConfig();
  const tick = currentTick();
  const previous = digits[(index + digits.length - 2) % digits.length];

  if (botOpenTrade) {
    settleBotTrade(tick, previous, config);
    return;
  }

  botSession.scanTicks += 1;
  setBotStatus(botSession.scanTicks < 2 ? "Bot scanning market" : "Bot running");
  if (botSession.scanTicks < 2) return;

  const setup = resolveBotSetup(config);
  const stake = Number(botSession.currentStake.toFixed(2));
  const payoutRate = getPayoutRate(setup.tradeType, setup.choice, setup.barrier, setup.targetDigit);
  if (!payoutRate) {
    stopBot("Bot stopped: selected barrier is unavailable");
    return;
  }
  if (currentWallet() < stake) {
    stopBot("Bot stopped: balance is too low");
    return;
  }

  setCurrentWallet(currentWallet() - stake);
  botOpenTrade = {
    ...setup,
    stake,
    payoutRate,
    remaining: config.duration,
    entryQuote: tick.quote,
    startedAt: new Date().toLocaleTimeString(),
  };
  botOpenTrade.payout = botOpenTrade.stake * botOpenTrade.payoutRate;
  setBotStatus("Bot running");
  updateBotLivePanel(`Opened ${botOpenTrade.tradeType} ${botOpenTrade.choice}`);
  renderAccount();
  renderBotStats();
  saveState();
}

function resolveBotSetup(config) {
  const suggestion = scanAiMarket();
  let tradeType = config.tradeType;
  let choice = tradeChoices[tradeType]?.[0] || "Even";
  let barrier = config.barrier;
  let targetDigit = lastDigit;

  if (config.direction !== "Auto") {
    choice = config.direction;
    if ((choice === "Over" || choice === "Under") && tradeType !== "Over/Under") tradeType = "Over/Under";
    if ((choice === "Rise" || choice === "Fall") && tradeType !== "Rise/Fall") tradeType = "Rise/Fall";
  } else if (suggestion) {
    tradeType = suggestion.tradeType;
    choice = suggestion.choice;
    barrier = suggestion.barrier;
    targetDigit = suggestion.targetDigit;
  }

  if (tradeType === "Over/Under") choice = choice === "Under" ? "Under" : "Over";
  if (tradeType === "Matches/Differs") choice = choice === "Matches" ? "Matches" : "Differs";
  if (tradeType === "Even/Odd") choice = choice === "Odd" ? "Odd" : "Even";
  if (tradeType === "Rise/Fall") choice = choice === "Fall" ? "Fall" : "Rise";

  return { market: config.market, tradeType, choice, barrier, targetDigit };
}

function settleBotTrade(tick, previous, config) {
  botOpenTrade.remaining -= 1;
  if (botOpenTrade.remaining > 0) {
    setBotStatus(`Bot running: ${botOpenTrade.remaining} ticks left`);
    return;
  }

  const won = botTradeWins(botOpenTrade, tick, previous);
  const profit = won ? botOpenTrade.payout - botOpenTrade.stake : -botOpenTrade.stake;
  if (won) setCurrentWallet(currentWallet() + botOpenTrade.payout);
  botSession.netProfit += profit;

  botHistory.unshift({
    market: botOpenTrade.market,
    tradeType: `${botOpenTrade.tradeType} ${botOpenTrade.choice}`,
    stake: botOpenTrade.stake,
    result: won ? "Win" : "Loss",
    profit,
    martingaleLevel: botSession.martingaleLevel,
    accountType: accountMode === "real" ? "Real" : "Demo",
    balanceAfter: currentWallet(),
    time: new Date().toLocaleTimeString(),
  });
  updateBotLivePanel(`${won ? "Won" : "Lost"} ${formatMoney(profit)}`);
  botHistory = botHistory.slice(0, 20);
  recordTradeEvent({
    tradeType: `${botOpenTrade.tradeType} ${botOpenTrade.choice}`,
    stake: botOpenTrade.stake,
    profit,
  });

  if (won) {
    botSession.currentStake = botSession.baseStake;
    botSession.martingaleLevel = 0;
  } else if (config.recovery === "Martingale") {
    botSession.martingaleLevel += 1;
    if (botSession.martingaleLevel > config.maxSteps) {
      botOpenTrade = null;
      renderBotHistory();
      renderAccount();
      stopBot("Bot stopped: max martingale level reached");
      return;
    }
    botSession.currentStake *= config.multiplier;
  }

  botOpenTrade = null;
  botSession.scanTicks = 0;
  renderBotHistory();
  renderAccount();
  renderBotStats();
  saveState();

  if (config.takeProfit > 0 && botSession.netProfit >= config.takeProfit) {
    stopBot("Take profit hit");
  } else if (config.stopLoss > 0 && botSession.netProfit <= -config.stopLoss) {
    stopBot("Stop loss hit");
  } else if (currentWallet() < botSession.currentStake) {
    stopBot("Bot stopped: balance is too low");
  } else {
    setBotStatus("Bot scanning market");
  }
}

function botTradeWins(contract, tick) {
  if (contract.tradeType === "Rise/Fall") return contract.choice === "Rise" ? tick.quote >= contract.entryQuote : tick.quote < contract.entryQuote;
  if (contract.tradeType === "Even/Odd") return contract.choice === "Even" ? tick.digit % 2 === 0 : tick.digit % 2 === 1;
  if (contract.tradeType === "Over/Under") return contract.choice === "Over" ? tick.digit > contract.barrier : tick.digit < contract.barrier;
  if (contract.tradeType === "Matches/Differs") return contract.choice === "Matches" ? tick.digit === contract.targetDigit : tick.digit !== contract.targetDigit;
  return false;
}

function scanAiMarket() {
  const sample = tickTape.length >= 8 ? tickTape.slice(-20) : digits.map((item) => ({ ...item, previousQuote: item.quote - 0.01 }));
  const counts = Array(10).fill(0);
  let even = 0;
  let odd = 0;
  let rises = 0;
  let falls = 0;
  let speed = 0;
  let repeats = 0;

  sample.forEach((tick, idx) => {
    counts[tick.digit] += 1;
    if (tick.digit % 2 === 0) even += 1;
    else odd += 1;
    if (tick.quote >= tick.previousQuote) rises += 1;
    else falls += 1;
    speed += Math.abs(tick.quote - tick.previousQuote);
    if (idx > 0 && tick.digit === sample[idx - 1].digit) repeats += 1;
  });

  const highestDigit = counts.indexOf(Math.max(...counts));
  const lowestDigit = counts.indexOf(Math.min(...counts));
  const evenGap = Math.abs(even - odd);
  const momentumGap = Math.abs(rises - falls);
  const calmSpeed = speed / Math.max(1, sample.length) < 0.045;
  let tradeType = "Even/Odd";
  let choice = even <= odd ? "Even" : "Odd";
  let barrier = Math.max(1, Math.min(8, lowestDigit || 5));
  let targetDigit = highestDigit;
  let reason = "AI found a possible entry from last digit frequency and even/odd distribution.";

  if (momentumGap >= evenGap && momentumGap >= 2) {
    tradeType = "Rise/Fall";
    choice = rises >= falls ? "Rise" : "Fall";
    reason = rises >= falls ? "Market shows mild rise momentum." : "Market shows mild fall momentum.";
  } else if (counts[highestDigit] >= 3 || repeats >= 1) {
    tradeType = "Matches/Differs";
    choice = "Differs";
    targetDigit = highestDigit;
    reason = "AI found repeated digit pressure, so a differs setup looks possible.";
  } else if (calmSpeed) {
    tradeType = "Over/Under";
    choice = lowestDigit <= 4 ? "Over" : "Under";
    barrier = lowestDigit <= 4 ? Math.max(1, lowestDigit) : Math.min(8, lowestDigit);
    reason = "Market looks calmer and digit spread is balanced around the barrier.";
  }

  const confidence = Math.max(54, Math.min(76, 58 + evenGap * 2 + momentumGap * 2 + repeats * 3));
  const marketOptions = Object.keys(marketLabels);
  const selectedMarket =
    marketOptions[(highestDigit + lowestDigit + rises + repeats + Math.floor(Date.now() / 60000)) % marketOptions.length] ||
    botMarket.value ||
    activeMarket;

  aiSuggestion = {
    market: selectedMarket,
    tradeType,
    choice,
    barrier,
    targetDigit,
    confidence,
    reason,
  };
  renderAiSuggestion();
  return aiSuggestion;
}

function renderAiSuggestion() {
  const suggestion = aiSuggestion || scanAiMarket();
  aiSheet.classList.remove("scanning");
  aiScanStatus.textContent = "Possible entry found";
  aiScanDetail.textContent = "AI selected a setup from recent ticks. This is not guaranteed and can still lose.";
  aiMarket.textContent = marketLabels[suggestion.market]?.replace(" Index", "") || suggestion.market;
  aiTrade.textContent = `${suggestion.tradeType} ${suggestion.choice}`;
  aiBarrier.textContent = suggestion.tradeType === "Over/Under" ? suggestion.barrier : suggestion.tradeType === "Matches/Differs" ? suggestion.targetDigit : "-";
  aiConfidence.textContent = `${suggestion.confidence}%`;
  aiReason.textContent = `${suggestion.reason} Signal confidence: ${suggestion.confidence}%.`;
}

function applyAiSuggestion() {
  const suggestion = aiSuggestion || scanAiMarket();
  botMarket.value = suggestion.market;
  botTradeType.value = suggestion.tradeType;
  botBarrier.value = suggestion.tradeType === "Matches/Differs" ? suggestion.targetDigit : suggestion.barrier;
  botDirection.value = ["Rise", "Fall", "Over", "Under"].includes(suggestion.choice) ? suggestion.choice : "Auto";
  setBotStatus("Bot paused");
  renderBotStats();
}

function renderBotStats() {
  botNetProfit.textContent = formatMoney(botSession.netProfit);
  botLevel.textContent = String(botSession.martingaleLevel);
  botNextStake.textContent = formatMoney(botSession.currentStake || Math.max(0.3, Number(botStake.value) || 0.3));
  botBottomStatus.textContent = botStatusText;
  if (botAccountLabel) botAccountLabel.textContent = `${accountMode === "real" ? "Real" : "Demo"} ${formatMoney(currentWallet())}`;
  updateBotLivePanel();
}

function renderBotHistory() {
  if (!botHistoryList) return;
  if (!botHistory.length) {
    botHistoryList.innerHTML = "<p>No bot trades yet.</p>";
    return;
  }
  botHistoryList.innerHTML = botHistory
    .slice(0, 8)
    .map((item) => {
      const resultClass = item.result === "Win" ? "win" : "loss";
      return `
        <div class="bot-history-item ${resultClass}">
          <div>
            <strong>${item.tradeType}</strong>
            <span>${marketLabels[item.market] || item.market} · ${item.accountType} · L${item.martingaleLevel}</span>
          </div>
          <div>
            <strong>${item.result}</strong>
            <span>${item.profit >= 0 ? "+" : ""}${formatMoney(item.profit)} · Bal ${formatMoney(item.balanceAfter)}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function openAiPanel() {
  aiSheet.classList.add("open");
  aiSheet.classList.add("scanning");
  aiSheet.setAttribute("aria-hidden", "false");
  aiScanStatus.textContent = "Scanning market...";
  aiScanDetail.textContent = "Checking digit frequency, rise/fall momentum, speed, and repeated patterns.";
  aiMarket.textContent = "Scanning...";
  aiTrade.textContent = "Scanning...";
  aiBarrier.textContent = "-";
  aiConfidence.textContent = "...";
  aiReason.textContent = "AI is scanning generated tick data. No signal is guaranteed.";
  aiApplyButton.disabled = true;
  aiStartButton.disabled = true;
  clearTimeout(aiScanTimer);
  aiScanTimer = setTimeout(() => {
    scanAiMarket();
    aiApplyButton.disabled = false;
    aiStartButton.disabled = false;
  }, 1300);
}

function closeAiSheet() {
  aiSheet.classList.remove("open");
  aiSheet.classList.remove("scanning");
  aiSheet.setAttribute("aria-hidden", "true");
  clearTimeout(aiScanTimer);
}

function loadAiButtonPosition() {
  const stored = localStorage.getItem("meta-ai-button-position");
  if (!stored) return;
  try {
    const position = JSON.parse(stored);
    if (Number.isFinite(position.left) && Number.isFinite(position.top)) {
      aiFloatButton.style.left = `${position.left}px`;
      aiFloatButton.style.top = `${position.top}px`;
      aiFloatButton.style.right = "auto";
    }
  } catch {
    localStorage.removeItem("meta-ai-button-position");
  }
}

function clampAiButton(left, top) {
  const size = aiFloatButton.offsetWidth || 58;
  const margin = 8;
  return {
    left: Math.max(margin, Math.min(window.innerWidth - size - margin, left)),
    top: Math.max(margin, Math.min(window.innerHeight - size - margin, top)),
  };
}

aiFloatButton.addEventListener("pointerdown", (event) => {
  aiDidDrag = false;
  aiPointerMoved = false;
  const rect = aiFloatButton.getBoundingClientRect();
  aiDragState = {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    startX: event.clientX,
    startY: event.clientY,
  };
  aiFloatButton.classList.add("dragging");
  aiFloatButton.setPointerCapture(event.pointerId);
});

aiFloatButton.addEventListener("pointermove", (event) => {
  if (!aiDragState) return;
  const moved = Math.hypot(event.clientX - aiDragState.startX, event.clientY - aiDragState.startY);
  if (moved < 8 && !aiPointerMoved) return;
  aiPointerMoved = true;
  const next = clampAiButton(event.clientX - aiDragState.offsetX, event.clientY - aiDragState.offsetY);
  aiFloatButton.style.left = `${next.left}px`;
  aiFloatButton.style.top = `${next.top}px`;
  aiFloatButton.style.right = "auto";
  aiDidDrag = true;
});

aiFloatButton.addEventListener("pointerup", (event) => {
  if (aiDragState) {
    const rect = aiFloatButton.getBoundingClientRect();
    localStorage.setItem("meta-ai-button-position", JSON.stringify({ left: rect.left, top: rect.top }));
  }
  const shouldOpen = !aiDidDrag && !aiPointerMoved;
  aiDragState = null;
  aiPointerMoved = false;
  aiFloatButton.classList.remove("dragging");
  try {
    aiFloatButton.releasePointerCapture(event.pointerId);
  } catch {}
  if (shouldOpen) openAiPanel();
});

window.addEventListener("resize", () => {
  const rect = aiFloatButton.getBoundingClientRect();
  const next = clampAiButton(rect.left, rect.top);
  aiFloatButton.style.left = `${next.left}px`;
  aiFloatButton.style.top = `${next.top}px`;
  aiFloatButton.style.right = "auto";
  localStorage.setItem("meta-ai-button-position", JSON.stringify(next));
});

aiFloatButton.addEventListener("click", () => {
  if (aiDidDrag) {
    aiDidDrag = false;
    return;
  }
});
closeAiPanel.addEventListener("click", closeAiSheet);
aiSheet.addEventListener("click", (event) => {
  if (event.target === aiSheet) closeAiSheet();
});
aiApplyButton.addEventListener("click", () => {
  applyAiSuggestion();
  closeAiSheet();
});
aiStartButton.addEventListener("click", () => {
  applyAiSuggestion();
  closeAiSheet();
  startBot();
});

stakeInput.addEventListener("change", () => {
  renderChoices();
  updatePayoutPreview();
  saveState();
});
ticksInput.addEventListener("change", () => {
  saveState();
});
stakeInput.addEventListener("input", () => {
  renderChoices();
  updatePayoutPreview();
});
[botStake, botRecovery, botMultiplier, botMaxSteps, botTakeProfit, botStopLoss, botMarket, botTradeType, botDirection, botBarrier].forEach((input) => {
  input.addEventListener("input", () => {
    if (!botRunning) {
      const config = readBotConfig();
      botSession.currentStake = config.stake;
      botSession.baseStake = config.stake;
    }
    renderBotStats();
    saveState();
  });
  input.addEventListener("change", () => {
    renderBotStats();
    saveState();
  });
});
depositButton.addEventListener("click", depositDemoFunds);
withdrawButton.addEventListener("click", withdrawDemoFunds);
closeWithdraw.addEventListener("click", () => {
  withdrawSheet.classList.remove("open");
  withdrawSheet.setAttribute("aria-hidden", "true");
});
withdrawSheet.addEventListener("click", (event) => {
  if (event.target === withdrawSheet) closeWithdraw.click();
});
withdrawForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireLoginForPanel(withdrawStatus)) return;
  const amount = Number(withdrawAmount.value);
  const phone = withdrawPhone.value.trim();
  if (accountMode !== "real") {
    withdrawStatus.textContent = "Demo account cannot withdraw. Switch to Real account.";
    return;
  }
  if (amount < 5 || amount > 150000) {
    withdrawStatus.textContent = "Withdrawal must be between 5 and 150000 USD.";
    return;
  }
  if (realWallet < amount) {
    withdrawStatus.textContent = "Real balance is not enough for this withdrawal.";
    return;
  }
  withdrawStatus.textContent = "Creating withdrawal request...";
  try {
    const data = await postJson("/api/withdraw", { email: currentUser.email, amount, phone });
    applyServerUser(data.user);
    addLocalTransaction(data.transaction);
    renderAccount();
    renderTransactions();
    withdrawStatus.textContent = data.message || "Withdrawal pending. Estimated processing time: 1–3 business days.";
  } catch (error) {
    withdrawStatus.textContent = error.message || "Withdrawal request failed. Balance was not changed.";
    try {
      await refreshCurrentUser();
    } catch {}
    renderAccount();
    renderTransactions();
  }
});
getStartedButton.addEventListener("click", () => openAuth("register"));
loginButton.addEventListener("click", () => openAuth("login"));
logoutButton.addEventListener("click", logout);
closeAuth.addEventListener("click", closeAuthSheet);
authSheet.addEventListener("click", (event) => {
  if (event.target === authSheet) closeAuthSheet();
});
registerTab.addEventListener("click", () => setAuthMode("register"));
loginTab.addEventListener("click", () => setAuthMode("login"));
registerForm.addEventListener("submit", handleRegister);
loginForm.addEventListener("submit", handleLogin);
forgotPasswordButton.addEventListener("click", resetPassword);
document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.querySelector(`#${button.dataset.passwordTarget}`);
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    button.textContent = isHidden ? "Hide" : "Show";
  });
});
resetPasswordButton.addEventListener("click", () => {
  openAuth("login");
  resetPassword();
});
verifyEmailButton.addEventListener("click", verifyCurrentEmail);
accountMenuButton.addEventListener("click", () => {
  renderAccountSummary();
  tradeStatus.textContent = currentUser
    ? `Account ${currentUser.accountId} is ${currentUser.emailVerified ? "verified" : "waiting for email verification"}.`
    : "Create an account from Get Started.";
});
settingsMenuButton.addEventListener("click", () => {
  if (!requireLoginForPanel(settingsStatus)) return;
  renderSettingsForm();
  settingsSheet.classList.add("open");
  settingsSheet.setAttribute("aria-hidden", "false");
});
closeSettings.addEventListener("click", () => {
  settingsSheet.classList.remove("open");
  settingsSheet.setAttribute("aria-hidden", "true");
});
settingsSheet.addEventListener("click", (event) => {
  if (event.target === settingsSheet) closeSettings.click();
});
settingsLogout.addEventListener("click", () => {
  closeSettings.click();
  logout();
});
settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireLoginForPanel(settingsStatus)) return;
  const body = {
    profileName: document.querySelector("#settingsName").value.trim(),
    phone: document.querySelector("#settingsPhone").value.trim(),
    depositPhone: document.querySelector("#settingsDepositPhone").value.trim(),
    withdrawalPhone: document.querySelector("#settingsWithdrawalPhone").value.trim(),
    newPassword: document.querySelector("#settingsPassword").value,
    theme: document.querySelector("#settingsTheme").value,
    sound: document.querySelector("#settingsSound").value === "true",
    chartSpeed: document.querySelector("#settingsChartSpeed").value,
    realTradingEnabled: document.querySelector("#settingsRealTrading").value === "true",
    dailyTradeLimit: Number(document.querySelector("#settingsDailyLimit").value),
    maximumStakeLimit: Number(document.querySelector("#settingsMaxStake").value),
  };
  userSettings = { ...userSettings, ...body, email: currentUser.email };
  currentUser.fullName = body.profileName;
  currentUser.phone = body.phone;
  settingsStatus.textContent = "Saving settings...";
  try {
    const data = await putJson(`/api/settings/${encodeURIComponent(currentUser.email)}`, body);
    applyServerUser(data.user);
    settingsStatus.textContent = data.message || "Settings saved.";
  } catch (error) {
    settingsStatus.textContent = isAccountServiceError(error.message)
      ? "Settings saved on this phone. Add MongoDB for cross-browser settings."
      : error.message;
  }
  document.querySelector("#settingsPassword").value = "";
  renderAccount();
  renderSettingsForm();
  saveState();
});
transactionsMenuButton.addEventListener("click", async () => {
  if (!requireLoginForPanel()) return;
  transactionsSheet.classList.add("open");
  transactionsSheet.setAttribute("aria-hidden", "false");
  renderTransactions();
  try {
    const data = await getJson(`/api/transactions/${encodeURIComponent(currentUser.email)}`);
    transactionHistory = data.transactions || transactionHistory;
    renderTransactions();
    saveState();
  } catch {}
});
closeTransactions.addEventListener("click", () => {
  transactionsSheet.classList.remove("open");
  transactionsSheet.setAttribute("aria-hidden", "true");
});
transactionsSheet.addEventListener("click", (event) => {
  if (event.target === transactionsSheet) closeTransactions.click();
});
partnerMenuButton.addEventListener("click", async () => {
  if (!requireLoginForPanel(partnerStatus)) return;
  partnerSheet.classList.add("open");
  partnerSheet.setAttribute("aria-hidden", "false");
  partnerDashboard.hidden = true;
  partnerStatus.textContent = "Apply to partner first, or open your existing partner dashboard.";
  await loadPartnerDashboard();
});
closePartner.addEventListener("click", () => {
  partnerSheet.classList.remove("open");
  partnerSheet.setAttribute("aria-hidden", "true");
});
partnerSheet.addEventListener("click", (event) => {
  if (event.target === partnerSheet) closePartner.click();
});
applyPartnerButton.addEventListener("click", async () => {
  if (!requireLoginForPanel(partnerStatus)) return;
  if (currentUser?.localOnly) {
    partnerDashboard.hidden = true;
    partnerStatus.textContent = "Login with an online account before applying for the partner dashboard.";
    return;
  }
  partnerStatus.textContent = "Opening partner account...";
  try {
    const data = await postJson("/api/partner/apply", { email: currentUser.email });
    applyServerUser(data.user);
    partnerData = { partner: data.partner, stats: partnerData?.stats || {} };
    renderPartnerDashboard();
    partnerStatus.textContent = data.message || "Partner account is active.";
    saveState();
  } catch (error) {
    partnerData = null;
    partnerDashboard.hidden = true;
    partnerStatus.textContent = isAccountServiceError(error.message)
      ? "Partner account could not open yet. Please try again when the account service is ready."
      : error.message;
    saveState();
  }
});
copyReferralButton.addEventListener("click", async () => {
  if (!partnerData?.partner) {
    partnerStatus.textContent = "Apply or open your partner dashboard before copying a referral link.";
    return;
  }
  const link = partnerReferralLink.value;
  try {
    await navigator.clipboard.writeText(link);
    partnerStatus.textContent = "Referral link copied.";
  } catch {
    partnerReferralLink.select();
    partnerStatus.textContent = "Referral link selected. Copy it from the field.";
  }
});
partnerWithdrawButton.addEventListener("click", async () => {
  if (!partnerData?.partner) {
    partnerStatus.textContent = "Apply or open your partner dashboard before withdrawing commission.";
    return;
  }
  const amount = Number(prompt("Enter commission withdrawal amount in USD", "5"));
  if (!Number.isFinite(amount)) return;
  const phone = userSettings.withdrawalPhone || currentUser.phone || "";
  try {
    const data = await postJson("/api/partner/withdraw", { email: currentUser.email, amount, phone });
    addLocalTransaction(data.transaction);
    partnerStatus.textContent = data.message || "Partner withdrawal request is pending.";
  } catch (error) {
    partnerStatus.textContent = error.message;
  }
});

async function loadPartnerDashboard() {
  partnerData = null;
  partnerDashboard.hidden = true;
  if (!currentUser?.email || window.location.protocol === "file:") return;
  try {
    const data = await getJson(`/api/partner/${encodeURIComponent(currentUser.email)}`);
    partnerData = data;
    renderPartnerDashboard();
    partnerStatus.textContent = "Partner dashboard opened.";
    saveState();
  } catch (error) {
    partnerDashboard.hidden = true;
    partnerStatus.textContent =
      error.message === "Partner account not found."
        ? "No partner account yet. Tap Apply / Open Partner Dashboard to create one."
        : error.message;
  }
}

function renderPartnerDashboard() {
  const partner = partnerData?.partner;
  const stats = partnerData?.stats || {};
  partnerDashboard.hidden = !partner;
  if (!partner) return;
  partnerReferralLink.value = partner.referralLink || `https://metabinary-cewf.vercel.app/register?ref=${partner.partnerId}`;
  partnerStats.innerHTML = [
    ["Total referred users", stats.totalReferredUsers || 0],
    ["Active real traders", stats.activeRealTraders || 0],
    ["Total real deposits", formatMoney(Number(stats.totalRealDeposits || 0))],
    ["Total real trade volume", formatMoney(Number(stats.totalRealTradeVolume || 0))],
    ["Commission earned", formatMoney(Number(stats.totalCommissionEarned || 0))],
    ["Pending commission", formatMoney(Number(stats.pendingCommission || 0))],
    ["Paid commission", formatMoney(Number(stats.paidCommission || 0))],
  ]
    .map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}
accountModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    accountMode = button.dataset.accountMode;
    renderAccount();
    renderBotStats();
    tradeStatus.textContent =
      accountMode === "real" && !currentUser
        ? "Real account preview selected. Login or Get Started to deposit and trade."
        : accountMode === "real"
          ? "Real account selected. Deposits send an M-Pesa STK push."
          : currentUser
            ? "Demo account selected."
            : "Demo account preview selected. You can test before login.";
    saveState();
  });
});
closeDeposit.addEventListener("click", () => {
  depositSheet.classList.remove("open");
  depositSheet.setAttribute("aria-hidden", "true");
});
depositSheet.addEventListener("click", (event) => {
  if (event.target === depositSheet) {
    depositSheet.classList.remove("open");
    depositSheet.setAttribute("aria-hidden", "true");
  }
});
function getKesDepositAmount() {
  return (Number(depositAmount.value) || 0) * kesPerUsd;
}

function updateMpesaPreview() {
  if (!mpesaAmount) return;
  mpesaAmount.textContent = formatKes(getKesDepositAmount());
}

function startDepositAutoCheck() {
  if (depositCheckTimer) clearInterval(depositCheckTimer);
  depositCheckAttempts = 0;
  depositCheckTimer = setInterval(() => {
    if (!pendingDeposit?.apiRef || checkDeposit.disabled) return;
    depositCheckAttempts += 1;
    checkPendingDeposit({ silent: true });
    if (depositCheckAttempts >= 80) {
      clearInterval(depositCheckTimer);
      depositCheckTimer = null;
    }
  }, 3000);
}

function stopDepositAutoCheck() {
  if (depositCheckTimer) clearInterval(depositCheckTimer);
  depositCheckTimer = null;
  depositCheckAttempts = 0;
}

depositAmount.addEventListener("input", () => {
  updateMpesaPreview();
  depositStatus.textContent = `${formatMoney(Number(depositAmount.value) || 0)} equals ${formatKes(getKesDepositAmount())}.`;
});

depositForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (window.location.protocol === "file:") {
    depositStatus.textContent = "Open the Vercel website to use M-Pesa deposits.";
    return;
  }
  if (currentUser?.localOnly) {
    depositStatus.textContent = "Login with an online account before depositing so your balance can be credited.";
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
        account_id: currentUser?.accountId || "",
        phone_number: depositPhone.value,
        email: depositEmail.value || currentUser?.email || "",
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Deposit failed.");
    pendingDeposit = {
      apiRef: data.api_ref,
      usdAmount: Number(data.usd_amount || depositAmount.value),
      kesAmount: Number(data.kes_amount || getKesDepositAmount()),
      accountId: currentUser?.accountId || "",
      credited: false,
    };
    checkDeposit.hidden = false;
    startDepositAutoCheck();
    saveState();
    depositStatus.textContent =
      data.message || `M-Pesa STK push sent for ${formatKes(getKesDepositAmount())}. Balance appears after payment is confirmed.`;
    depositSubmit.disabled = false;
  } catch (error) {
    depositStatus.textContent = error.message;
    depositSubmit.disabled = false;
  }
});

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
      renderAccount();
      saveState();
      depositStatus.textContent = `Payment confirmed. ${formatMoney(credit)} added to Real balance.`;
      checkDeposit.hidden = true;
    } else if (data.credited) {
      pendingDeposit = null;
      stopDepositAutoCheck();
      checkDeposit.hidden = true;
      if (data.user) applyServerUser(data.user);
      else {
        try {
          await refreshCurrentUser();
        } catch {}
      }
      accountMode = "real";
      renderAccount();
      saveState();
      depositStatus.textContent = "Payment confirmed. Real balance refreshed.";
    } else {
      if (!options.silent) depositStatus.textContent = data.message || "Still waiting for M-Pesa confirmation.";
    }
  } catch (error) {
    if (!options.silent) depositStatus.textContent = error.message;
  } finally {
    checkDeposit.disabled = false;
  }
}

checkDeposit.addEventListener("click", checkPendingDeposit);

applyAccountResetVersion();
loadState();
document.querySelectorAll(".trade-type").forEach((button) => {
  button.classList.toggle("selected", button.dataset.tradeType === activeTrade);
});
renderChoices();
renderHistory();
renderAccount();
renderBotHistory();
renderBotStats();
setBotStatus(botStatusText);
loadAiButtonPosition();
renderDigitFrequency();
updatePayoutPreview();
renderTick();
setInterval(renderTick, 3200);
