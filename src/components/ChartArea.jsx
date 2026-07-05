export default function ChartArea(){

return(

<div className="chartWrap">

<div className="chartCard">

<div className="chartHeader">

<div>

<h1>Volatility 100 (1s)</h1>

<p>Live Synthetic Market</p>

</div>

<div className="lastDigit">

8

</div>

</div>

<div className="chart">

<svg viewBox="0 0 1000 500">

<path d="
M0 300
L20 350
L40 220
L60 310
L80 240
L100 320
L120 250
L140 230
L160 310
L180 260
L200 280
L220 240
L240 300
L260 210
L280 320
L300 260
L320 280
L340 250
L360 300
L380 230
L400 270
L420 260
L440 220
L460 290
L480 240
L500 270
L520 220
L540 310
L560 260
L580 230
L600 300
L620 250
L640 280
L660 210
L680 320
L700 240
L720 260
L740 220
L760 310
L780 260
L800 230
L820 300
L840 260
L860 210
L880 290
L900 240
L920 270
L940 220
L960 310
L980 260
"/>

</svg>

</div>

<div className="digits">

{[0,1,2,3,4,5,6,7,8,9].map(n=>

<div

key={n}

className={

n===4

?

"digit selected"

:

"digit"

}

>

<div>{n}</div>

<div className="percent">

12.5%

</div>

</div>

)}

</div>

</div>

</div>

)

}
