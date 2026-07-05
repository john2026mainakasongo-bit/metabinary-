export default function ChartArea() {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <main className="chartArea">
      <div className="chartHeader">
        <h2>Volatility 75 Index</h2>
        <span>Live synthetic chart</span>
      </div>

      <div className="fakeChart">
        <svg viewBox="0 0 800 300">
          <polyline
            points="0,210 70,180 140,220 210,130 280,160 350,90 420,130 490,70 560,110 630,50 700,90 800,40"
            fill="none"
            stroke="#22c55e"
            strokeWidth="5"
          />
        </svg>
      </div>

      <div className="digits">
        {digits.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </main>
  );
}
