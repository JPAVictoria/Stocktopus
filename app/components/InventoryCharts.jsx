"use client";
import {LineChart } from "@mui/x-charts";

export default function InventoryCharts({ lineData }) {
  const xAxisData = lineData?.xAxis?.[0]?.data ?? [
    "Day 1",
    "Day 5",
    "Day 10",
    "Day 15",
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-6 w-300 mx-auto">
        {/* Company User Count Card */}
        <div className="bg-white border border-[#2D2D2D]/25 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <p className="font-regular text-[#333333] text-[14px] mb-1">
              Company User Count:
            </p>
            <p className="text-lg text-[#333333] font-bold mb-1">20k</p>
            <p className="text-[#333333]/75 text-[12.5px] font-regular mb-5">
              Last 30 days
            </p>
          </div>
          <LineChart
            className="ml-[-35px]"
            {...lineData}
            height={80} 
            colors={["#00C853"]}
            xAxis={[
              {
                scaleType: "point",
                data: xAxisData,
                display: false,
              },
            ]}
            yAxis={[{ display: false }]}
            grid={{ horizontal: false, vertical: false }}
            sx={{
              "& .MuiChartsAxis-root": {
                display: "none",
              },
              "& .MuiChartsGrid-line": {
                display: "none",
              },
              
              "& .MuiChartsLineChart-root": {
                paddingBottom: 0,
                marginBottom: 0,
              },
              "& svg": {
                marginBottom: 0,
                paddingBottom: 0,
              },
            }}
          />
        </div>

        {/* Most Stocked Products Card */}
        <div className="bg-white p-6 border border-[#2D2D2D]/25 rounded-lg text-center flex flex-col justify-between">
          <div>
            <p className="font-regular text-[14px] text-[#3d3d3d] mb-1">
              Most Stocked Products
            </p>
            <p className="text-[#333333]/75 text-[12.5px]">Top 5 by Quantity</p>
            <ul className="space-y-1 font-semibold mt-5">
              <li>Keyboard Warrior</li>
              <li>Apple Wine</li>
              <li>Juice ko po</li>
            </ul>
          </div>
        </div>

        {/* Active Suppliers Card */}
        <div className="bg-white p-6 border border-[#2D2D2D]/25 rounded-lg flex flex-col justify-between">
          <div>
            <p className="font-regular text-[#333333] text-[14px]">
              Active Suppliers:
            </p>
            <p className="text-lg text-[#333333] font-bold mb-1">20k</p>
            <p className="text-[#333333]/75 text-[12.5px] font-regular mb-5">
              Last 30 days
            </p>
          </div>
          <LineChart
            className="ml-[-35px]"
            {...lineData}
            height={80} 
            colors={["#00C853"]}
            xAxis={[
              {
                scaleType: "point",
                data: xAxisData,
                display: false,
              },
            ]}
            yAxis={[{ display: false }]}
            grid={{ horizontal: false, vertical: false }}
            sx={{
              "& .MuiChartsAxis-root": {
                display: "none",
              },
              "& .MuiChartsGrid-line": {
                display: "none",
              },
              "& .MuiChartsLineChart-root": {
                paddingBottom: 0,
                marginBottom: 0,
              },
              "& svg": {
                marginBottom: 0,
                paddingBottom: 0,
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
