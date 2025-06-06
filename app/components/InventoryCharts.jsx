"use client";
import { LineChart } from "@mui/x-charts";
import { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "@mui/material";

export default function InventoryCharts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/statistics');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6 w-300 mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-[#2D2D2D]/25 rounded-lg p-6">
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={16} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" width="100%" height={80} />
          </div>
        ))}
      </div>
    );
  }

  const userLineData = data?.userLineData || {
    series: [{ data: [10, 15, 20, 25] }],
    xAxis: [{ data: ["Day 1", "Day 5", "Day 10", "Day 15"] }]
  };

  const inventoryLineData = data?.lineData || {
    series: [{ data: [5, 10, 15, 20] }],
    xAxis: [{ data: ["Day 1", "Day 5", "Day 10", "Day 15"] }]
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6 w-300 mx-auto">
        <div className="bg-white border border-[#2D2D2D]/25 rounded-lg p-6 flex flex-col justify-between overflow-hidden">
          <div>
            <p className="font-regular text-[#333333] text-[14px] mb-1">
              Company User Count:
            </p>
            <p className="text-lg text-[#333333] font-bold mb-1">
              {data?.userCount?.toLocaleString() || '0'}
            </p>
            <p className="text-[#333333]/75 text-[12.5px] font-regular mb-3">
              Last 30 days
            </p>
          </div>
          <div className="relative w-full h-20 overflow-hidden">
            <LineChart
              className="absolute -left-8 top-0"
              {...userLineData}
              width={280}
              height={80}
              colors={["#00C853"]}
              xAxis={[
                {
                  scaleType: "point",
                  data: userLineData.xAxis?.[0]?.data || [],
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
                "& .MuiLineElement-root": {
                  strokeWidth: 3,
                  filter: "drop-shadow(0 2px 4px rgba(0, 200, 83, 0.3))",
                },
                "& .MuiMarkElement-root": {
                  fill: "#00C853",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                  r: 4,
                  filter: "drop-shadow(0 2px 4px rgba(0, 200, 83, 0.4))",
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 border border-[#2D2D2D]/25 rounded-lg text-center flex flex-col justify-between">
          <div>
            <p className="font-regular text-[14px] text-[#3d3d3d] mb-1">
              Most Stocked Products
            </p>
            <p className="text-[#333333]/75 text-[12.5px]">Top 3 by Quantity</p>
            <ul className="space-y-1 font-semibold mt-10">
              {data?.mostStockedProducts?.length > 0 ? (
                data.mostStockedProducts.slice(0, 3).map((product, index) => (
                  <li key={index} className="text-lg">{product}</li>
                ))
              ) : (
                <>
                  <li>No products found</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 border border-[#2D2D2D]/25 rounded-lg flex flex-col justify-between overflow-hidden">
          <div>
            <p className="font-regular text-[#333333] text-[14px]">
              Active Products:
            </p>
            <p className="text-lg text-[#333333] font-bold mb-1">
              {data?.activeInventories?.toLocaleString() || '0'}
            </p>
            <p className="text-[#333333]/75 text-[12.5px] font-regular mb-5">
              Last 30 days
            </p>
          </div>
          <div className="relative w-full h-20 overflow-hidden">
            <LineChart
              className="absolute -left-8 top-0"
              {...inventoryLineData}
              width={280}
              height={80}
              colors={["#6366f1"]}
              xAxis={[
                {
                  scaleType: "point",
                  data: inventoryLineData.xAxis?.[0]?.data || [],
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
                "& .MuiLineElement-root": {
                  strokeWidth: 3,
                  filter: "drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))",
                },
                "& .MuiMarkElement-root": {
                  fill: "#6366f1",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                  r: 4,
                  filter: "drop-shadow(0 2px 4px rgba(99, 102, 241, 0.4))",
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}