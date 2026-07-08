export default function ChartArea() {

const points = `
40,300
70,340
100,280
130,310
160,250
190,230
220,260
250,210
280,170
310,200
340,270
370,300
400,280
430,260
460,350
490,390
520,380
550,340
580,260
610,280
640,260
670,200
700,150
730,180
760,260
790,340
820,330
850,360
880,390
910,310
940,230
970,250
1000,220
`;

return(

<div className="chartWrap">

<div className="chartCard">

<div className="chartHeader">

<h1>

Volatility 100 (1s) Index

</h1>

<p>

819.66 - 0.02 (0.00%)

</p>

</div>

<div className="chart">

<svg
viewBox="0 0 1100 500"
preserveAspectRatio="none"
>

<defs>

<linearGradient
id="fillArea"
x1="0"
y1="0"
x2="0"
y2="1"
>

<stop
offset="0%"
stopColor="#000"
stopOpacity=".10"
/>

<stop
offset="100%"
stopColor="#000"
stopOpacity="0"
/>

</linearGradient>

</defs>

<polygon

points={`40,500 ${points} 1040,500`}

fill="url(#fillArea)"

/>

<polyline

points={points}

fill="none"

stroke="#3b3b3b"

strokeWidth="3"

strokeLinecap="round"

strokeLinejoin="round"

/>

</svg>

<div className="priceTag">

819.66

</div>

</div>

<div className="digits">

{

[0,1,2,3,4,5,6,7,8,9]

.map(n=>

<div

key={n}

className={

n===6

?

"digit selected"

:

"digit"

}

>

<b>

{n}

</b>

<span>

{

(

8+

Math.random()*4

)

.toFixed(1)

}

%

</span>

</div>

)

}

</div>

</div>

</div>

)

}
