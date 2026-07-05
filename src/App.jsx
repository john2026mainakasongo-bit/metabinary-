*{margin:0;padding:0;box-sizing:border-box}

html,body,#root{
width:100%;
height:100%;
overflow:hidden;
font-family:Arial,Helvetica,sans-serif;
background:#f5f6f7;
color:#111;
}

button,input,select{font-family:inherit}
button{cursor:pointer}

.platform{
width:100vw;
height:100vh;
background:#f5f6f7;
display:flex;
flex-direction:column;
overflow:hidden;
}

.topbar{
height:72px;
background:#07111d;
color:white;
border-bottom:1px solid #dfe3e8;
display:grid;
grid-template-columns:260px 1fr 300px;
align-items:center;
padding:0 18px;
gap:14px;
}

.brand{
font-size:36px;
font-weight:900;
color:white;
white-space:nowrap;
}

.nav{
display:flex;
justify-content:center;
gap:8px;
overflow:hidden;
}

.nav button{
background:#101b2d;
border:1px solid #26364d;
color:white;
border-radius:8px;
padding:10px 13px;
font-weight:800;
white-space:nowrap;
}

.accountBox{
display:flex;
align-items:center;
justify-content:flex-end;
gap:10px;
}

.accountBox select{
height:42px;
background:#101b2d;
color:white;
border:1px solid #26364d;
border-radius:8px;
padding:0 12px;
}

.balance{
font-size:22px;
font-weight:900;
color:white;
white-space:nowrap;
}

.depositBtn{
background:#ff5d6c!important;
border:none!important;
color:white!important;
border-radius:9px!important;
padding:13px 18px!important;
font-weight:900!important;
}

.layout{
flex:1;
display:grid;
grid-template-columns:230px minmax(0,1fr)330px;
overflow:hidden;
}

.leftPanel{
background:#f1f3f5;
border-right:1px solid #dfe3e8;
display:flex;
flex-direction:column;
overflow:hidden;
color:#111;
}

.tabs{
height:55px;
display:flex;
border-bottom:1px solid #dfe3e8;
}

.tabs span{
flex:1;
display:flex;
align-items:center;
justify-content:center;
color:#596579;
font-size:15px;
}

.tabs .active{
color:#00a7a7;
border-bottom:3px solid #00c7c7;
}

.positions{
flex:1;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:18px;
text-align:center;
padding:18px;
overflow:auto;
}

.avatar{
width:82px;
height:82px;
border-radius:50%;
background:#e3e7ec;
color:#111;
display:flex;
align-items:center;
justify-content:center;
font-size:34px;
font-weight:900;
}

.positions h2{
font-size:23px;
color:#111;
}

.positions p{
font-size:16px;
line-height:1.4;
color:#596579;
}

.tradeCard{
background:white;
color:#111;
border-radius:8px;
padding:10px;
width:100%;
text-align:left;
border:1px solid #dfe3e8;
}

.tradeCard b{display:block}

.tradeCard span,
.tradeCard small{
display:block;
color:#555;
margin-top:4px;
}

.tradeCard.win{border-left:5px solid #18be84}
.tradeCard.loss{border-left:5px solid #ef3737}

.chartWrap{
padding:0;
background:white;
overflow:hidden;
}

.chartCard{
height:100%;
background:white;
display:flex;
flex-direction:column;
position:relative;
overflow:hidden;
padding:0;
border-radius:0;
}

.chartHeader{
position:absolute;
top:0;
left:0;
padding:20px;
background:white;
z-index:10;
box-shadow:0 2px 12px rgba(0,0,0,.05);
}

.chartHeader h1{
font-size:22px;
color:#333;
font-weight:900;
}

.chartHeader p{
color:#777;
margin-top:6px;
font-size:14px;
}

.lastDigit{
display:none;
}

.chart{
flex:1;
position:relative;
background:
linear-gradient(to right,rgba(0,0,0,.08) 1px,transparent 1px),
linear-gradient(to bottom,rgba(0,0,0,.08) 1px,transparent 1px);
background-size:
100px 100%,
100% 60px;
overflow:hidden;
}

.chart svg{
width:100%;
height:100%;
}

.chart svg rect{
opacity:.5;
}

.chart svg polyline{
stroke:#2b2b2b!important;
stroke-width:3!important;
filter:none!important;
}

.priceTag{
position:absolute;
right:10px;
top:50%;
transform:translateY(-50%);
background:black;
color:white;
padding:8px 12px;
border-radius:4px;
font-weight:700;
font-size:14px;
z-index:20;
}

.digits{
position:absolute;
bottom:15px;
left:50%;
transform:translateX(-50%);
display:flex;
gap:14px;
z-index:20;
}

.digit{
width:58px;
height:58px;
min-width:58px;
border-radius:50%;
background:white;
color:#333;
border:5px solid #e7e7e7;
box-shadow:0 2px 8px rgba(0,0,0,.08);
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
}

.digit b{
font-size:18px;
color:#333;
}

.digit span{
font-size:11px;
color:#555;
}

.selected{
border-color:#2cb8b8!important;
box-shadow:0 0 0 4px rgba(44,184,184,.18)!important;
}

.tradePanel{
background:#f0f1f3;
border-left:1px solid #dfe3e8;
padding:10px;
overflow-y:auto;
overflow-x:hidden;
color:#111;
}

.learn{
color:#111;
margin-bottom:10px;
text-align:left;
font-size:13px;
text-decoration:underline;
}

.tradeTitle{
font-size:18px;
font-weight:900;
text-align:left;
margin-bottom:10px;
color:#111;
background:white;
border-radius:5px;
padding:22px 15px;
}

.contractTabs{
display:flex;
flex-wrap:wrap;
gap:8px;
margin-bottom:14px;
background:white;
padding:10px;
border-radius:5px;
}

.contractTabs button{
background:#f8f9fa;
border:1px solid #dfe3e8;
color:#111;
border-radius:6px;
padding:10px 12px;
font-weight:800;
}

.contractTabs .active{
border-color:#00a7a7;
color:#00a7a7;
background:#e9ffff;
}

.tradeMode{
background:white;
border:1px solid #dfe3e8;
padding:16px;
border-radius:6px;
display:flex;
justify-content:space-between;
margin-bottom:12px;
font-size:17px;
color:#111;
}

.choice{
display:flex;
flex-direction:column;
gap:12px;
margin-bottom:12px;
}

.choice button{
height:66px;
border-radius:5px;
border:none;
font-weight:900;
font-size:17px;
text-align:left;
padding:0 18px;
}

.green{
background:#49b8b7!important;
color:white!important;
}

.white{
background:#ef3737!important;
color:white!important;
}

.tradePanel label{
display:block;
margin:12px 0 7px;
color:#555;
text-align:left;
font-size:15px;
}

.tradePanel input{
width:100%;
height:48px;
border-radius:6px;
background:white;
border:1px solid #dfe3e8;
color:#111;
padding-left:15px;
font-size:17px;
}

.buyEven{
width:100%;
height:76px;
border-radius:6px;
margin-top:14px;
border:none;
background:#18be84;
color:white;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:6px;
font-size:25px;
font-weight:900;
}

.buyEven span{
font-size:15px;
}

.authPage{
width:100vw;
height:100vh;
background:radial-gradient(circle at top,#173050,#07111d 60%);
display:flex;
align-items:center;
justify-content:center;
padding:20px;
}

.authCard{
width:430px;
background:#111c2d;
border:1px solid #26364d;
border-radius:22px;
padding:35px;
box-shadow:0 30px 90px rgba(0,0,0,.7);
}

.authCard h1{
font-size:50px;
font-weight:900;
color:white;
text-align:center;
margin-bottom:10px;
}

.authCard p{
color:#aebbd0;
text-align:center;
margin-bottom:25px;
}

.authCard input{
width:100%;
height:52px;
margin-bottom:14px;
background:#07111d;
border:1px solid #26364d;
border-radius:10px;
color:white;
padding:0 15px;
font-size:16px;
}

.authCard button{
width:100%;
height:54px;
background:#20c98b;
color:white;
border:none;
border-radius:10px;
font-size:18px;
font-weight:900;
}

.authCard span{
display:block;
text-align:center;
margin-top:20px;
color:#22d7cf;
}

.modal{
position:fixed;
inset:0;
background:rgba(0,0,0,.75);
display:flex;
align-items:center;
justify-content:center;
z-index:999;
}

.modalBox{
width:420px;
background:#111c2d;
border:1px solid #26364d;
border-radius:20px;
padding:30px;
position:relative;
color:white;
}

.modalBox h2{
font-size:34px;
margin-bottom:8px;
}

.modalBox p{
color:#aebbd0;
margin-bottom:18px;
}

.modalBox input{
width:100%;
height:52px;
margin-bottom:14px;
background:#07111d;
border:1px solid #26364d;
border-radius:10px;
color:white;
padding:0 15px;
}

.modalBox button:not(.x){
width:100%;
height:52px;
background:#20c98b;
color:white;
border:none;
border-radius:10px;
font-weight:900;
}

.x{
position:absolute;
right:15px;
top:15px;
background:#26364d;
color:white;
border:none;
width:35px;
height:35px;
border-radius:50%;
font-size:22px;
}

@media(max-width:900px){
html,body,#root{
overflow:auto;
}

.platform{
height:auto;
min-height:100vh;
overflow:auto;
}

.topbar{
height:auto;
display:flex;
flex-direction:column;
align-items:flex-start;
padding:15px;
}

.nav{
width:100%;
overflow-x:auto;
justify-content:flex-start;
}

.accountBox{
width:100%;
justify-content:space-between;
}

.layout{
display:flex;
flex-direction:column;
}

.leftPanel{
min-height:220px;
}

.chartCard{
min-height:620px;
}

.tradePanel{
border-left:none;
}

.digits{
left:0;
right:0;
bottom:15px;
transform:none;
overflow-x:auto;
justify-content:flex-start;
padding:0 12px;
}

.priceTag{
right:20px;
top:45%;
}
}
