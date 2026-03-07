"use client";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  strokeWidth?: number;
  className?: string;
}

export function Sparkline({
  data,
  width = 64,
  height = 28,
  color = "#00c853",
  fillColor,
  strokeWidth = 1.5,
  className = "",
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Padding to avoid clipping the stroke
  const padY = 3;
  const usableHeight = height - padY * 2;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = padY + usableHeight - ((value - min) / range) * usableHeight;
    return { x, y };
  });

  // Build SVG path
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  // Fill path (area under curve)
  const fillPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  // Determine trend color: compare last value to first
  const trending = data[data.length - 1] >= data[0];
  const autoColor = trending ? "#00c853" : "#ff3d57";
  const lineColor = color === "auto" ? autoColor : color;
  const areaFill = fillColor || (lineColor + "15");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Area fill */}
      <path d={fillPath} fill={areaFill} />
      {/* Line */}
      <path
        d={linePath}
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* End dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={2}
        fill={lineColor}
      />
    </svg>
  );
}
