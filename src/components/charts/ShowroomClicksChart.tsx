"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface ShowroomClicksChartProps {
  data: {
    name: string;
    clicks: number;
  }[];
}

const BAR_COLORS = ["#1B3E7A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"];

function truncateLabel(name: string, max = 20) {
  return name.length > max ? `${name.slice(0, max)}…` : name;
}

export function ShowroomClicksChart({ data }: ShowroomClicksChartProps) {
  const chartData = data.slice(0, 10).map((item) => ({
    ...item,
    shortName: truncateLabel(item.name),
  }));

  return (
    <Card className="h-full overflow-hidden rounded-lg border-slate-200 shadow-none print:hidden">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-medium text-slate-800">أعلى المعارض</h2>
        <p className="text-[11px] text-slate-400">أول 10 معارض</p>
      </div>
      <CardContent className="p-4">
        <div className="h-[260px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 4, left: -16, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="shortName"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10 }}
                angle={-30}
                textAnchor="end"
                interval={0}
                height={56}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#CBD5E1", fontSize: 10 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "#F8FAFC" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  fontSize: "12px",
                  direction: "rtl",
                }}
                formatter={(value) => [`${Number(value ?? 0)}`, "اتصال"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.name ? String(payload[0].payload.name) : ""
                }
              />
              <Bar dataKey="clicks" radius={[4, 4, 0, 0]} barSize={32}>
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={BAR_COLORS[Math.min(index, BAR_COLORS.length - 1)]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
