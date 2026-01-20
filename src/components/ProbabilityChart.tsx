
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PricePoint } from "@/types";

interface ProbabilityChartProps {
  data: PricePoint[];
}

export function ProbabilityChart({ data }: ProbabilityChartProps) {
  const chartData = data.map((point) => ({
    time: new Date(point.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    probability: point.price,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="time"
          stroke="#9ca3af"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          domain={[0, 100]}
          stroke="#9ca3af"
          style={{ fontSize: "12px" }}
          label={{ value: "Probability (%)", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
          formatter={(value: any) => `${(value as number).toFixed(1)}%`}
          labelFormatter={(label: any) => `${label}`}
        />
        <Line
          type="monotone"
          dataKey="probability"
          stroke="#10B981"
          dot={false}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
