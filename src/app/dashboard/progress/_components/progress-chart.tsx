"use client";

import { useMemo } from "react";

type Measurement = {
  date: string;
  value: number | null;
};

export function MiniChart({
  data,
  color = "#4ade80",
  height = 80,
}: {
  data: Measurement[];
  color?: string;
  height?: number;
}) {
  const points = useMemo(() => {
    const valid = data
      .filter((d) => d.value !== null)
      .sort((a, b) => a.date.localeCompare(b.date));
    if (valid.length < 2) return null;

    const values = valid.map((d) => d.value!);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const width = 300;
    const padding = 8;
    const usableH = height - padding * 2;
    const usableW = width - padding * 2;

    const pts = valid.map((d, i) => ({
      x: padding + (i / (valid.length - 1)) * usableW,
      y: padding + usableH - ((d.value! - min) / range) * usableH,
    }));

    const linePath = pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

    return { linePath, areaPath, pts, width };
  }, [data, height]);

  if (!points) {
    return (
      <div
        className="flex items-center justify-center text-xs text-muted-foreground"
        style={{ height }}
      >
        Datos insuficientes para gráfica
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${points.width} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={points.areaPath} fill={`url(#grad-${color})`} />
      <path
        d={points.linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
      ))}
    </svg>
  );
}
