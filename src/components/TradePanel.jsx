
export default function TradePanel(){

return(

<div className="tradePanel">

<p className="learn">

ⓘ Learn about this trade type

</p>

<h1 className="tradeTitle">

Even/Odd

</h1>

<div className="contractTabs">

<button className="active">

Even/Odd

</button>

<button>

Matches/Differs

</button>

<button>

Over/Under

</button>

<button>

Rise/Fall

</button>

<button>

Touch/No Touch

</button>

</div>

<div className="tradeMode">

<span>

Trade Mode

</span>

<b>

Manual

</b>

</div>

<div className="choice">

<button className="green">

Even

</button>

<button className="dark">

Odd

</button>

</div>

<label>

Duration ticks

</label>

<input value="5"/>

<label>

Stake

</label>

<input value="10"/>

<div className="buyEven">

Even

<span>

Payout 19 USD

</span>

</div>

<div className="buyOdd">

Odd

<span>

Payout 19 USD

</span>

</div>

</div>

)

}
