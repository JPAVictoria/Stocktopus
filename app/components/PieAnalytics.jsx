"use client";
import { PieChart } from "@mui/x-charts";

export default function PieAnalytics({ pieData }) {
  return (
    <div className="grid grid-cols-2 gap-45 w-[1200px] mt-10 mx-auto">
      <div className="bg-white p-10 border border-[#2D2D2D]/25 rounded-lg text-center">
        <p className="font-semibold mb-4 text-[#3d3d3d] text-lg">All-Time Inventory Breakdown</p>
        <PieChart
          series={[
            {
              data: pieData,
              innerRadius: 50,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 4,
              highlightScope: { fade: "global", highlight: "item" }, 
              faded: {
                innerRadius: 30,
                additionalRadius: -20,
                color: "rgba(0,0,0,0.1)", 
              },
            },
          ]}
          width={200}
          height={200}
        />
      </div>

      <div className="bg-white p-10 text-center border border-[#2D2D2D]/25 rounded-lg">
        <p className="font-semibold mb-4 text-[#3d3d3d] text-lg">Inventory by Location </p>
        <PieChart
          series={[
            {
              data: pieData,
              innerRadius: 50,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 4,
              highlightScope: { fade: "global", highlight: "item" }, 
              faded: {
                innerRadius: 30,
                additionalRadius: -20,
                color: "rgba(0,0,0,0.1)",
              },
            },
          ]}
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}
