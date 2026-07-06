* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
  background: #07111d;
  color: #fff;
}

button,
input,
select {
  font-family: inherit;
}

button {
  border: none;
  cursor: pointer;
}

input,
select {
  outline: none;
}

/* AUTH */

.authPage {
  width: 100vw;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top, rgba(0, 194, 180, 0.2), transparent 35%),
    #07111d;
  padding: 20px;
}

.authCard {
  width: 390px;
  background: #0e1a2a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.45);
}

.authCard h1 {
  font-size: 42px;
  color: #12d6b3;
  margin-bottom: 8px;
}

.authCard p {
  color: #9fb0c7;
  margin-bottom: 24px;
}

.authCard input {
  width: 100%;
  height: 52px;
  margin-bottom: 14px;
  border-radius: 12px;
  border: 1px solid #22324a;
  background: #07111d;
  color: white;
  padding: 0 14px;
  font-size: 16px;
}

.authCard button {
  width: 100%;
  height: 54px;
  border-radius: 12px;
  background: #12d6b3;
  color: #061426;
  font-size: 18px;
  font-weight: 900;
  margin-top: 6px;
}

.authCard span {
  display: block;
  margin-top: 18px;
  text-align: center;
  color: #12d6b3;
  cursor: pointer;
  font-weight: 800;
}

/* APP */

.platform {
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background: #07111d;
  display: flex;
  flex-direction: column;
}

/* TOPBAR */

.topbar {
  height: 74px;
  background: #091321;
  display: grid;
  grid-template-columns: 250px 1fr 360px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.brand {
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 22px;
  font-size: 34px;
  font-weight: 900;
  color: #12d6b3;
}

.nav {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  padding: 0 12px;
}

.nav::-webkit-scrollbar {
  display: none;
}

.nav button {
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  background: transparent;
  color: #c6d1e2;
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
}

.nav button:hover,
.nav button:nth-child(2) {
  background: #12d6b3;
  color: #061426;
}

.accountBox {
  height: 100%;
  display: grid;
  grid-template-columns: 95px 1fr 94px;
  gap: 10px;
  align-items: center;
  padding-right: 18px;
}

.accountBox select,
.balance {
  height: 42px;
  border-radius: 11px;
  border: 1px solid #22324a;
  background: #0e1a2a;
  color: white;
  font-weight: 900;
}

.accountBox select {
  padding: 0 10px;
}

.balance {
  display: flex;
  align-items: center;
  padding: 0 14px;
  color: #12d6b3;
  font-size: 18px;
}

.balance::before {
  content: "🇺🇸";
  margin-right: 10px;
}

.depositBtn {
  height: 42px;
  border-radius: 11px;
  background: #12d6b3;
  color: #061426;
  font-weight: 900;
}

/* TABS */

.mobileTabs {
  display: none;
}

.desktopTabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.desktopTabs button,
.mobileTabs button {
  height: 40px;
  border-radius: 10px;
  background: #16243a;
  color: #aebbd0;
  font-weight: 900;
}

.desktopTabs button.active,
.mobileTabs button.active {
  background: #12d6b3;
  color: #061426;
}

/* MAIN LAYOUT */

.layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 285px minmax(0, 1fr) 360px;
  overflow: hidden;
}

/* LEFT PANEL */

.leftPanel {
  background: #0b1625;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tabs {
  height: 58px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.tabs span {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8796ad;
  font-weight: 900;
}

.tabs span.active {
  color: #12d6b3;
  border-bottom: 3px solid #12d6b3;
}

.positions {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
}

.avatar {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: #12d6b3;
  color: #061426;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 45px auto 18px;
  font-weight: 900;
  font-size: 22px;
}

.positions h2 {
  text-align: center;
  font-size: 22px;
  margin-bottom: 8px;
}

.positions p {
  text-align: center;
  color: #8796ad;
}

.tradeCard {
  background: #101e31;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 12px;
}

.tradeCard b {
  display: block;
  margin-bottom: 6px;
}

.tradeCard span,
.tradeCard small {
  display: block;
  color: #9fb0c7;
  margin-top: 3px;
}

.tradeCard.win {
  border-color: rgba(18, 214, 179, 0.5);
}

.tradeCard.loss {
  border-color: rgba(255, 76, 91, 0.5);
}

/* CHART */

.chartWrap {
  min-width: 0;
  overflow: hidden;
  background: #07111d;
  padding: 18px;
}

.chartCard {
  height: 100%;
  background: #0b1625;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 22px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chartHeader {
  height: 82px;
  background: #101e31;
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.chartHeader h1 {
  font-size: 24px;
  color: white;
}

.chartHeader p {
  margin-top: 6px;
  color: #12d6b3;
  font-weight: 800;
}

.chart {
  flex: 1;
  min-height: 260px;
  position: relative;
  border-radius: 18px;
  background:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    #07111d;
  background-size: 54px 54px;
  overflow: hidden;
}

.chart svg {
  width: 100%;
  height: 100%;
}

.chart polygon {
  fill: url(#areaFill);
}

.chart polyline {
  stroke: #12d6b3;
  filter: drop-shadow(0 0 7px rgba(18, 214, 179, 0.75));
}

.priceTag {
  position: absolute;
  right: 18px;
  top: 42%;
  background: #12d6b3;
  color: #061426;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 900;
}

/* DIGITS */

.digits {
  height: 105px;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  padding-top: 16px;
}

.digit {
  min-width: 0;
  border-radius: 16px;
  background: #101e31;
  border: 1px solid #22324a;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.digit b {
  font-size: 26px;
}

.digit span {
  color: #9fb0c7;
  font-size: 13px;
  margin-top: 4px;
}

.digit.selected {
  border-color: #12d6b3;
  box-shadow: 0 0 0 2px rgba(18, 214, 179, 0.25);
}

.digit.selected b {
  color: #12d6b3;
}

/* TRADE PANEL */

.tradePanel {
  background: #0b1625;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  padding: 16px;
  overflow-y: auto;
}

.learn {
  color: #9fb0c7;
  font-size: 14px;
  margin-bottom: 10px;
}

.tradeTitle {
  min-height: 58px;
  background: #101e31;
  border-radius: 14px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 25px;
  margin-bottom: 12px;
}

.contractTabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.contractTabs button {
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  background: #16243a;
  color: #aebbd0;
  font-weight: 800;
}

.contractTabs button.active {
  background: #12d6b3;
  color: #061426;
}

.tradeMode,
.tradeRow {
  height: 48px;
  background: #101e31;
  border-radius: 12px;
  padding: 0 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tradeMode span,
.tradeRow span {
  color: #9fb0c7;
}

.tradeMode b,
.tradeRow b {
  color: white;
}

.tradePanel input,
.toolBox input {
  width: 100%;
  height: 46px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #22324a;
  background: #07111d;
  color: white;
  padding: 0 14px;
  font-size: 16px;
}

.choice {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 4px;
}

.choice button {
  min-height: 92px;
  border-radius: 14px;
  color: white;
  font-size: 25px;
  font-weight: 900;
  padding: 14px;
  text-align: left;
}

.choice button small,
.choice button strong {
  display: block;
  margin-top: 7px;
  font-size: 13px;
}

.choice button strong {
  font-size: 15px;
}

.green {
  background: #12b8a6 !important;
}

.white {
  background: #ff4c5b !important;
}

.buyEven,
.mainBuy {
  width: 100%;
  min-height: 58px;
  border-radius: 14px;
  margin-top: 12px;
  background: #12d6b3;
  color: #061426;
  font-size: 19px;
  font-weight: 900;
}

.buyEven span {
  display: block;
  font-size: 13px;
  margin-top: 4px;
}

.toolBox {
  background: #101e31;
  border-radius: 16px;
  padding: 16px;
}

.toolBox h2 {
  font-size: 25px;
  margin-bottom: 8px;
}

.toolBox p {
  color: #9fb0c7;
  margin-bottom: 16px;
  line-height: 1.4;
}

.toolBox label {
  display: block;
  color: #c6d1e2;
  font-weight: 800;
  margin-bottom: 8px;
}

/* MODAL */

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.68);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 18px;
}

.modalBox {
  width: 420px;
  max-width: 100%;
  background: #0e1a2a;
  color: white;
  border-radius: 20px;
  padding: 26px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.x {
  position: absolute;
  right: 16px;
  top: 12px;
  font-size: 30px;
  background: transparent;
  color: white;
}

.modalBox h2 {
  font-size: 32px;
  margin-bottom: 6px;
}

.modalBox p {
  color: #9fb0c7;
  margin-bottom: 18px;
}

.modalBox input {
  width: 100%;
  height: 52px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #22324a;
  background: #07111d;
  color: white;
  padding: 0 14px;
  font-size: 16px;
}

.modalBox button:last-child {
  width: 100%;
  height: 54px;
  border-radius: 12px;
  background: #12d6b3;
  color: #061426;
  font-size: 18px;
  font-weight: 900;
}

/* TABLET */

@media (max-width: 1023px) {
  .topbar {
    height: 170px;
    grid-template-columns: 1fr;
    grid-template-rows: 54px 58px 58px;
  }

  .brand {
    font-size: 0;
    padding: 0 18px;
  }

  .brand::before {
    content: "☰";
    font-size: 32px;
    color: #111;
    margin-right: 30px;
  }

  .brand::after {
    content: "↻";
    font-size: 36px;
    color: #21b8bb;
  }

  .topbar {
    background: white;
  }

  .nav {
    height: 58px;
    background: #061426;
    padding: 0;
  }

  .nav button {
    height: 58px;
    min-width: 165px;
    border-radius: 0;
    background: #061426;
    color: white;
    font-size: 16px;
  }

  .nav button:nth-child(2) {
    background: #2fbec1;
    color: white;
  }

  .nav button:nth-child(n + 4) {
    display: none;
  }

  .accountBox {
    height: 58px;
    grid-template-columns: 1fr 1.75fr;
    padding: 8px 14px;
    background: white;
  }

  .accountBox select,
  .balance {
    height: 42px;
    background: white;
    border: 1px solid #e0e2e5;
    color: #111;
  }

  .balance {
    color: #14aeb0;
  }

  .depositBtn {
    display: none;
  }

  .mobileTabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 48px;
    gap: 0;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;
  }

  .mobileTabs button {
    height: 48px;
    border-radius: 0;
    background: white;
    color: #555;
    font-size: 13px;
  }

  .mobileTabs button.active {
    background: #061426;
    color: white;
  }

  .layout {
    height: calc(100dvh - 218px);
    flex: none;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 52% 48%;
    background: white;
  }

  .leftPanel {
    display: none;
  }

  .chartWrap {
    background: white;
    padding: 14px 16px 0;
  }

  .chartCard {
    background: white;
    border: none;
    border-radius: 0;
    padding: 0;
    position: relative;
  }

  .chartHeader {
    height: 112px;
    background: white;
    border: 1px solid #e2e4e7;
    border-radius: 8px;
    padding: 26px 16px 14px 78px;
    margin-bottom: 36px;
    color: #222;
  }

  .chartHeader::before {
    content: "100  1s";
    position: absolute;
    left: 38px;
    top: 29px;
    height: 22px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111;
    color: white;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 900;
  }

  .chartHeader::after {
    content: "▥";
    position: absolute;
    left: 36px;
    top: 52px;
    font-size: 30px;
    color: #74bdc0;
  }

  .chartHeader h1 {
    font-size: 22px;
    color: #202020;
    white-space: nowrap;
  }

  .chartHeader h1::after {
    content: "⌄";
    float: right;
    font-size: 28px;
    font-weight: 400;
  }

  .chartHeader p {
    font-size: 16px;
    color: #999;
  }

  .chartHeader p::after {
    content: " ▼";
    color: #d22657;
  }

  .chart,
  .priceTag {
    display: none;
  }

  .digits {
    height: auto;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 38px 12px;
    padding: 0 12px;
  }

  .digit {
    width: 58px;
    height: 58px;
    min-width: 58px;
    border-radius: 50%;
    background: white;
    border: 6px solid #e9ebee;
    margin: auto;
    color: #222;
  }

  .digit b {
    font-size: 20px;
    color: #222;
  }

  .digit span {
    font-size: 13px;
    color: #333;
  }

  .digit.selected {
    border-color: #21b8bb;
    box-shadow: none;
  }

  .tradePanel {
    background: #f4f4f4;
    border-left: 0;
    padding: 12px 16px 14px;
    overflow-y: auto;
  }

  .desktopTabs {
    display: none;
  }

  .learn {
    font-size: 15px;
    color: #222;
    text-decoration: underline dotted;
  }

  .tradeTitle {
    height: 52px;
    background: white;
    border-radius: 8px;
    color: #222;
    font-size: 23px;
    margin-bottom: 9px;
  }

  .tradeTitle::before {
    content: "▦";
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f2f3;
    color: #4fb6b5;
    border-radius: 7px;
    margin-right: 14px;
    font-size: 20px;
  }

  .tradeTitle::after {
    content: "›";
    font-size: 38px;
    font-weight: 300;
    margin-left: auto;
  }

  .contractTabs,
  .tradeMode {
    display: none;
  }

  .tradeRow {
    height: 46px;
    background: white;
    border-radius: 8px;
    color: #333;
    font-size: 17px;
    margin-bottom: 9px;
  }

  .tradeRow span {
    color: #333;
  }

  .tradeRow b {
    color: #111;
    font-size: 22px;
  }

  .tradePanel input {
    display: none;
  }

  .choice {
    gap: 12px;
  }

  .choice button {
    height: 78px;
    border-radius: 8px;
    font-size: 24px;
    display: grid;
    grid-template-rows: 1fr 32px;
    overflow: hidden;
    padding: 0;
    text-align: center;
  }

  .choice button small {
    height: 32px;
    display: flex;
    align-items: center;
    padding-left: 16px;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.16);
  }

  .choice button strong {
    position: absolute;
    right: 16px;
    bottom: 8px;
    font-size: 13px;
  }

  .buyEven {
    display: none;
  }

  .toolBox {
    background: white;
    color: #222;
    border-radius: 10px;
  }

  .toolBox p,
  .toolBox label {
    color: #555;
  }

  .toolBox input {
    display: block;
    background: white;
    color: #222;
    border: 1px solid #ddd;
  }

  .modal {
    align-items: flex-end;
  }

  .modalBox {
    width: 100%;
    background: white;
    color: #222;
    border-radius: 22px 22px 0 0;
  }

  .x {
    color: #222;
  }

  .modalBox input {
    background: white;
    color: #222;
    border: 1px solid #ddd;
  }
}

/* PHONE */

@media (max-width: 430px) {
  .topbar {
    height: 182px;
    grid-template-rows: 52px 62px 68px;
  }

  .brand::before {
    font-size: 30px;
    margin-right: 28px;
  }

  .brand::after {
    font-size: 34px;
  }

  .nav {
    height: 62px;
  }

  .nav button {
    height: 62px;
    min-width: 172px;
    font-size: 17px;
  }

  .accountBox {
    height: 68px;
    padding: 11px 16px;
  }

  .layout {
    height: calc(100dvh - 230px);
    grid-template-rows: 55% 45%;
  }

  .chartWrap {
    padding: 14px 16px 0;
  }

  .chartHeader {
    height: 112px;
    padding: 26px 16px 14px 78px;
    margin-bottom: 46px;
  }

  .digits {
    gap: 38px 12px;
    padding: 0 12px;
  }

  .digit {
    width: 58px;
    height: 58px;
    min-width: 58px;
  }

  .tradePanel {
    padding: 12px 16px 14px;
  }
}

/* SMALL PHONE */

@media (max-width: 380px) {
  .topbar {
    height: 170px;
    grid-template-rows: 48px 58px 64px;
  }

  .nav {
    height: 58px;
  }

  .nav button {
    height: 58px;
    min-width: 160px;
    font-size: 16px;
  }

  .accountBox {
    height: 64px;
    padding: 10px 12px;
  }

  .accountBox select,
  .balance {
    height: 44px;
    font-size: 16px;
  }

  .balance {
    font-size: 20px;
  }

  .layout {
    height: calc(100dvh - 218px);
    grid-template-rows: 55% 45%;
  }

  .chartWrap {
    padding: 12px 12px 0;
  }

  .chartHeader {
    height: 104px;
    padding: 24px 12px 12px 70px;
    margin-bottom: 40px;
  }

  .chartHeader::before {
    left: 34px;
    top: 27px;
  }

  .chartHeader::after {
    left: 32px;
    top: 49px;
    font-size: 28px;
  }

  .chartHeader h1 {
    font-size: 19px;
  }

  .chartHeader p {
    font-size: 14px;
  }

  .digits {
    gap: 30px 8px;
    padding: 0 8px;
  }

  .digit {
    width: 50px;
    height: 50px;
    min-width: 50px;
    border-width: 5px;
  }

  .digit b {
    font-size: 17px;
  }

  .digit span {
    font-size: 11px;
  }

  .tradePanel {
    padding: 10px 12px 12px;
  }

  .learn {
    font-size: 14px;
  }

  .tradeTitle {
    height: 48px;
    font-size: 21px;
    padding: 0 16px;
  }

  .tradeRow {
    height: 42px;
    font-size: 16px;
    padding: 0 16px;
  }

  .tradeRow b {
    font-size: 20px;
  }

  .choice {
    gap: 10px;
  }

  .choice button {
    height: 70px;
    font-size: 21px;
  }
}
@media (max-width: 1023px) {
  html,
  body,
  #root {
    height: 100%;
    overflow: hidden !important;
  }

  .platform {
    height: 100dvh !important;
    overflow: hidden !important;
    background: white !important;
  }

  .layout {
    height: calc(100dvh - 230px) !important;
    display: grid !important;
    grid-template-rows: 48% 52% !important;
    overflow: hidden !important;
  }

  .chartWrap {
    height: 100% !important;
    padding: 14px 16px 0 !important;
    overflow: hidden !important;
  }

  .chartCard {
    height: 100% !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }

  .chartHeader {
    margin-bottom: 28px !important;
  }

  .digits {
    gap: 26px 10px !important;
  }

  .tradePanel {
    height: 100% !important;
    min-height: 0 !important;
    overflow-y: auto !important;
    padding-bottom: 30px !important;
  }
}

@media (max-width: 430px) {
  .layout {
    height: calc(100dvh - 230px) !important;
    grid-template-rows: 47% 53% !important;
  }

  .chartHeader {
    height: 104px !important;
    margin-bottom: 26px !important;
  }

  .digits {
    gap: 24px 8px !important;
  }

  .digit {
    width: 54px !important;
    height: 54px !important;
    min-width: 54px !important;
  }
}
@media (max-width: 430px) {
  .layout {
    height: calc(100dvh - 230px) !important;
    grid-template-rows: 42% 58% !important;
  }

  .chartHeader {
    height: 96px !important;
    margin-bottom: 18px !important;
  }

  .digits {
    gap: 14px 8px !important;
  }

  .digit {
    width: 50px !important;
    height: 50px !important;
    min-width: 50px !important;
  }

  .digit b {
    font-size: 18px !important;
  }

  .digit span {
    font-size: 11px !important;
  }

  .tradePanel {
    padding-bottom: 90px !important;
  }

  .choice button {
    height: 96px !important;
  }
}
@media (max-width: 1023px) {
  .nav button:nth-child(2),
  .nav button:nth-child(3) {
    display: none !important;
  }

  .nav {
    justify-content: flex-start !important;
  }

  .nav button:nth-child(1) {
    min-width: 100% !important;
  }
}
.sideMenu {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 99999;
}

.menuContent {
  position: absolute;
  left: 0;
  top: 0;
  width: 280px;
  height: 100%;
  background: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.25);
}

.menuContent button {
  height: 54px;
  border-radius: 10px;
  background: #f4f4f4;
  font-size: 17px;
  font-weight: 800;
  color: #222;
}

.closeMenu {
  background: none !important;
  font-size: 36px !important;
  height: auto !important;
  align-self: flex-end;
}

@media (max-width: 1023px) {
  .nav button {
    min-width: 50% !important;
  }
}
