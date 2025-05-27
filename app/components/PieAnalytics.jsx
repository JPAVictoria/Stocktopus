"use client";
import { PieChart} from "@mui/x-charts";

export default function PieAnalytics({pieData}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <p className="font-semibold mb-4">All-Time Inventory Breakdown</p>
          <PieChart
            series={[
              {
                data: pieData,
                innerRadius: 40,
                outerRadius: 80,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            width={300}
            height={200}
          />
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <p className="font-semibold mb-4">Inventory by Location</p>
          <PieChart
            series={[
              {
                data: pieData,
                innerRadius: 40,
                outerRadius: 80,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            width={300}
            height={200}
          />
        </div>
      </div>
    </>
  );
}
