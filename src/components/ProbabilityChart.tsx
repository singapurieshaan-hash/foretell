
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" />
        <XAxis
          dataKey="time"
          stroke="#6B7280"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          domain={[0, 100]}
          stroke="#6B7280"
          style={{ fontSize: "12px" }}
          label={{ value: "Probability (%)", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e1e4e8",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value: any) => `${(value as number).toFixed(1)}%`}
          labelFormatter={(label: any) => `${label}`}
          cursor={{ stroke: "#10B981", strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="probability"
          stroke="#10B981"
          dot={false}
          strokeWidth={3}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
