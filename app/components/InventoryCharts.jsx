"use client";
import { PieChart, LineChart } from "@mui/x-charts";

export default function InventoryCharts({ pieData, lineData }) {
  const xAxisData =
    lineData?.xAxis?.[0]?.data ?? ["Day 1", "Day 5", "Day 10", "Day 15"];

  return (
    <>
      <div className="grid grid-cols-3 gap-6 w-300 mx-auto">
        {/* Company User Count Block */}
        <div className="bg-white border border-[#2D2D2D]/25 rounded-lg p-6">
          <p className="font-regular text-[#333333] text-[14px] mb-1">
            Company User Count:
          </p>
          <p className="text-lg text-[#333333] font-bold mb-1">20k</p>
          <p className="text-[#333333]/75 text-[12.5px] font-regular mb-5">
            Last 30 days
          </p>
          <LineChart
            {...lineData}
            height={120}
            colors={["#00C853"]}
            xAxis={[
              {
                scaleType: "point",
                data: xAxisData,
              },
            ]}
            yAxis={[{}]}
            grid={{ horizontal: false, vertical: false }}
            sx={{
              "& .MuiChartsAxis-root": {
                display: "none",
              },
              "& .MuiChartsGrid-line": {
                display: "none",
              },
            }}
          />
        </div>

        {/* Most Stocked Products Block */}
        <div className="bg-white p-6 border border-[#2D2D2D]/25 rounded-lg text-center">
          <p className="font-regular text-[14px] text-[#3d3d3d] mb-1">
            Most Stocked Products
          </p>
          <p className="text-[#333333]/75 text-[12.5px]">Top 5 by Quantity</p>
          <ul className="space-y-1 font-semibold mt-5">
            <li>Keyboard Warrior</li>
            <li>Apple Wine</li>
            <li>Juice ko po</li>
            <li>Apple Wine</li>
            <li>Juice ko po</li>
          </ul>
        </div>

        {/* Active Suppliers Block */}
        <div className="bg-white p-6 border border-[#2D2D2D]/25 rounded-lg">
          <p className="font-regular text-[#333333] text-[14px]">
            Active Suppliers:
          </p>
          <p className="text-lg text-[#333333] font-bold mb-1">20k</p>
          <p className="text-[#333333]/75 text-[12.5px] font-regular mb-5">
            Last 30 days
          </p>
          <LineChart
            {...lineData}
            height={120}
            colors={["#00C853"]}
            xAxis={[
              {
                scaleType: "point",
                data: xAxisData,
              },
            ]}
            yAxis={[{}]}
            grid={{ horizontal: false, vertical: false }}
            sx={{
              "& .MuiChartsAxis-root": {
                display: "none",
              },
              "& .MuiChartsGrid-line": {
                display: "none",
              },
            }}
          />
        </div>
      </div>



      {/* <div className="grid grid-cols-2 gap-6">
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
      </div> */}
    </>
  );
}
