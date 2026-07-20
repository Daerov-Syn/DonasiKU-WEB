"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { WeeklyTrendPoint } from "@/lib/repo";

export default function TrendChart({ data }: { data: WeeklyTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#dde3d9" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#4b5c54" }} axisLine={false} tickLine={false} />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: "#4b5c54" }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #dde3d9",
            fontSize: 12,
          }}
          formatter={(value, name) =>
            name === "moneyAmount"
              ? [`Rp${Number(value).toLocaleString("id-ID")}`, "Dana terkumpul"]
              : [String(value), "Barang masuk"]
          }
        />
        <Bar
          yAxisId="left"
          dataKey="itemsCount"
          fill="#c9962e"
          radius={[6, 6, 0, 0]}
          barSize={18}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="moneyAmount"
          stroke="#1e4b3c"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
