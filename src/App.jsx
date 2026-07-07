          grid-template-columns:1fr 1fr;
          gap:14px;
        }

        .tradeBtns button{
          height:94px;
          border:none;
          border-radius:22px;
          color:white;
          font-size:30px;
          font-weight:900;
        }

        .rise{
          background:#19b8aa;
        }

        .fall{
          background:#ff4057;
        }

        .depositOverlay{
          position:fixed;
          inset:0;
          background:rgba(4,10,18,.78);
          backdrop-filter:blur(7px);
          z-index:100;
          display:grid;
          place-items:center;
          padding:18px;
        }

        .depositModal{
          width:min(672px,100%);
          background:#1f293a;
          color:white;
          border:1px solid rgba(255,255,255,.08);
          border-radius:22px;
          box-shadow:0 24px 80px rgba(0,0,0,.45);
          overflow:hidden;
        }

        .depositHeader{
          min-height:124px;
          padding:28px 32px;
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          border-bottom:1px solid rgba(255,255,255,.08);
        }

        .depositHeader h2{
          font-size:30px;
          line-height:1.1;
          margin-bottom:9px;
        }

        .depositHeader p{
          color:#a8b2c2;
          font-size:20px;
        }

        .closeDeposit{
          border:none;
          background:transparent;
          color:#7f8999;
          font-size:42px;
          line-height:1;
          cursor:pointer;
        }

        .depositBody{
          padding:30px 32px;
        }

        .paymentMethod{
          width:100%;
          min-height:122px;
          border:1px solid rgba(255,255,255,.07);
          border-radius:18px;
          background:#273345;
          color:white;
          display:grid;
          grid-template-columns:72px 1fr 34px;
          gap:24px;
          align-items:center;
          padding:24px;
          margin-bottom:18px;
          text-align:left;
          cursor:pointer;
        }

        .paymentMethod:hover{
          background:#303d50;
        }

        .methodIcon{
          width:72px;
          height:72px;
          border-radius:20px;
          display:grid;
          place-items:center;
          font-size:34px;
          font-weight:900;
        }

        .mpesaIcon{
          background:#2e7580;
          color:#6ff1ee;
        }

        .cardIcon{
          background:#46357b;
          color:#a66dff;
        }

        .usdtIcon{
          background:#57401f;
          color:#ffad1f;
        }

        .methodText strong{
          display:block;
          font-size:25px;
          margin-bottom:8px;
        }

        .methodText span{
          color:#a8b2c2;
          font-size:20px;
        }

        .methodArrow{
          color:#7f8999;
          font-size:42px;
        }

        .backLine{
          border:none;
          background:transparent;
          color:#a8b2c2;
          font-size:21px;
          margin-bottom:28px;
          cursor:pointer;
        }

        .modalLabel{
          display:block;
          color:#a8b2c2;
          font-size:20px;
          font-weight:900;
          margin:18px 0 12px;
        }

        .amountInputWrap{
          height:74px;
          border:1px solid rgba(255,255,255,.1);
          border-radius:17px;
          background:#121926;
          display:flex;
          align-items:center;
          padding:0 24px;
          gap:14px;
        }

        .amountInputWrap span{
          color:#8f99aa;
          font-size:26px;
        }

        .amountInputWrap input,
        .phoneInput{
          width:100%;
          border:none;
          outline:none;
          color:white;
          background:transparent;
          font-size:26px;
        }

        .quickAmounts{
          display:grid;
          grid-template-columns:repeat(6,1fr);
          gap:12px;
          margin:14px 0 26px;
        }

        .quickAmounts button{
          height:49px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:12px;
          background:#273345;
          color:#a8b2c2;
          font-size:21px;
          cursor:pointer;
        }

        .quickAmounts button.active{
          color:white;
          border-color:#4ebdb7;
          background:#33575d;
        }

        .phoneInput{
          height:74px;
          border:1px solid rgba(255,255,255,.1);
          border-radius:17px;
          background:#121926;
          padding:0 24px;
        }

        .hint{
          color:#778294;
          font-size:17px;
          margin-top:9px;
        }

        .depositSubmit{
          width:100%;
          height:85px;
          border:none;
          border-radius:18px;
          background:#49b8b5;
          color:white;
          font-size:25px;
          font-weight:900;
          margin-top:26px;
          cursor:pointer;
        }

        .depositSubmit:disabled{
          opacity:.65;
          cursor:not-allowed;
        }

        @media (max-width:700px){
          .depositHeader{
            padding:24px;
          }

          .depositBody{
            padding:24px;
          }

          .quickAmounts{
            grid-template-columns:repeat(3,1fr);
          }

          .paymentMethod{
            grid-template-columns:58px 1fr 28px;
