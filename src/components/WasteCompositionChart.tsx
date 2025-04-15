
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { WasteTypeComposition } from "@/lib/calculation";

interface WasteCompositionChartProps {
  composition: WasteTypeComposition[];
  className?: string;
}

const COLORS = [
  "#4CAF50", // green
  "#2196F3", // blue
  "#FFC107", // amber
  "#FF5722", // deep orange
  "#9C27B0", // purple
  "#3F51B5", // indigo
  "#795548", // brown
  "#607D8B", // blue grey
];

const WasteCompositionChart: React.FC<WasteCompositionChartProps> = ({
  composition,
  className,
}) => {
  // Transform composition data for the chart
  const chartData = composition.map((item) => {
    return {
      name: item.wasteTypeId,
      value: item.percentage,
    };
  });

  return (
    <div className={`h-64 ${className || ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return percent > 0.05 ? (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              ) : null;
            }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `${value}%`}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WasteCompositionChart;
