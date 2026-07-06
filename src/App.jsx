*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial,Helvetica,sans-serif;
}

html,
body,
#root{
  width:100%;
  min-height:100%;
  background:#07111d;
}

button,
input,
select{
  font:inherit;
}

.platform{
  width:100%;
  min-height:100vh;
  background:#07111d;
  color:white;
}

.topbar{
  background:white;
  color:#111;
  padding:18px 22px;
  border-bottom:1px solid #ddd;
}

.topbar h1{
  font-size:34px;
  font-weight:900;
}

.topbar p{
  font-size:24px;
  margin-top:14px;
}

.main{
  display:grid;
  grid-template-columns:1fr 360px;
  gap:16px;
  padding:16px;
}

.chartArea{
  background:#07111d;
  min-height:520px;
  border-radius:18px;
  overflow:hidden;
}

.market{
  background:#0d1a2b;
  border-radius:18px;
  padding:16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:16px;
}

.market h2{
  font-size:22px;
}

.market span{
  color:#8d9aad;
}

.market strong{
  color:#2ef2a2;
  font-size:30px;
}

.digitsRow{
  width:100%;
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
  flex-wrap:wrap;
  gap:8px;
  margin:16px 0;
}

.digit{
  width:44px;
  height:44px;
  min-width:44px;
  border-radius:50%;
  background:#142238;
  border:1px solid #31425c;
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:20px;
  font-weight:900;
}

.activeDigit{
  background:#ff444f;
  border-color:#ff444f;
  box-shadow:0 0 20px rgba(255,68,79,.8);
}

.chartBox{
  height:320px;
  background:linear-gradient(180deg,#10213a,#07111d);
  border:1px solid rgba(255,255,255,.07);
  border-radius:18px;
  position:relative;
  overflow:hidden;
}

.chartLine{
  position:absolute;
  left:-10%;
  top:50%;
  width:120%;
  height:4px;
  background:#2ef2a2;
  box-shadow:0 0 24px #2ef2a2;
  animation:moveLine 2s infinite ease-in-out;
}

@keyframes moveLine{
  0%{transform:translateY(0) rotate(0deg);}
  25%{transform:translateY(-35px) rotate(1deg);}
  50%{transform:translateY(25px) rotate(-1deg);}
  75%{transform:translateY(-15px) rotate(1deg);}
  100%{transform:translateY(0) rotate(0deg);}
}

.cursorDigit{
  position:absolute;
  right:25px;
  top:42%;
  width:62px;
  height:62px;
  border-radius:50%;
  background:#ff444f;
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:28px;
  font-weight:900;
  box-shadow:0 0 24px rgba(255,68,79,.8);
}

.recentDigits{
  margin-top:16px;
  display:flex;
  gap:8px;
  overflow-x:auto;
  padding-bottom:8px;
}

.recentDigits span{
  min-width:38px;
  height:38px;
  border-radius:50%;
  background:#142238;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:900;
}

.tradePanel{
  background:white;
  color:#111;
  border-radius:22px;
  padding:22px;
  height:max-content;
}

.tradePanel h2{
  font-size:28px;
  margin-bottom:20px;
}

.tradePanel label{
  display:block;
  font-size:20px;
  font-weight:900;
  margin-top:18px;
  margin-bottom:8px;
}

.tradePanel select,
.tradePanel input{
  width:100%;
  height:58px;
  border-radius:16px;
  border:1px solid #ddd;
  padding:0 16px;
  font-size:20px;
  background:white;
  color:#111;
}

.tradePanel select{
  border:3px solid #111;
}

.predictionGrid{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:8px;
}

.predictionGrid button{
  width:48px;
  height:48px;
  border-radius:50%;
  border:1px solid #ddd;
  background:#f0f2f5;
  color:#111;
  font-weight:900;
  cursor:pointer;
}

.predictionGrid button.selected{
  background:#ff444f;
  color:white;
  border-color:#ff444f;
}

.info{
  margin-top:14px;
  background:#f3f5f7;
  border-radius:14px;
  padding:13px;
  display:flex;
  justify-content:space-between;
  font-size:17px;
}

.buyBtn{
  width:100%;
  height:58px;
  margin-top:18px;
  border:none;
  border-radius:16px;
  background:#ff444f;
  color:white;
  font-size:20px;
  font-weight:900;
  cursor:pointer;
}

.bottom{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
  padding:0 16px 16px;
}

.box{
  background:#0d1a2b;
  border-radius:18px;
  padding:16px;
}

.box h2{
  font-size:24px;
  margin-bottom:12px;
}

.empty{
  color:#91a0b5;
}

.tradeCard{
  margin-top:10px;
  background:#101f35;
  border-radius:14px;
  padding:14px;
  display:flex;
  flex-direction:column;
  gap:5px;
}

.tradeCard span{
  color:#c6d0dd;
}

.open{
  border-left:5px solid #ffc107;
}

.won{
  border-left:5px solid #2ef2a2;
}

.lost{
  border-left:5px solid #ff444f;
}

@media(max-width:850px){
  .topbar{
    padding:20px;
  }

  .topbar h1{
    font-size:38px;
  }

  .topbar p{
    font-size:26px;
  }

  .main{
    display:flex;
    flex-direction:column;
    padding:0;
    gap:0;
  }

  .chartArea{
    border-radius:0;
    min-height:auto;
    padding:12px;
  }

  .market{
    margin-bottom:12px;
  }

  .market h2{
    font-size:18px;
  }

  .market strong{
    font-size:24px;
  }

  .digitsRow{
    flex-wrap:nowrap;
    overflow-x:auto;
    justify-content:flex-start;
    padding:0 4px 10px;
  }

  .digit{
    width:38px;
    height:38px;
    min-width:38px;
    font-size:18px;
  }

  .chartBox{
    height:300px;
  }

  .tradePanel{
    border-radius:28px 28px 0 0;
    padding:30px;
    width:100%;
  }

  .bottom{
    grid-template-columns:1fr;
    padding:0;
  }

  .box{
    border-radius:0;
  }
}
