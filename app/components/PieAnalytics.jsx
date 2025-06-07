"use client";
import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import axios from "axios";

export default function PieAnalytics() {
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get("/api/charts");

        if (response.data.success) {
          setPieData(response.data.data.topProductsByValue);
        } else {
          setError("Failed to load chart data");
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-25 w-[1200px] mt-10 mx-auto">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#2D2D2D]/25 rounded-lg p-6"
          >
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={16} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" width="100%" height={60} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-25 w-[1200px] mt-10 mx-auto">
      <div className="bg-white p-10 border border-[#2D2D2D]/25 rounded-lg text-center">
        <p className="font-semibold mb-7 text-[#3d3d3d] text-lg">
          Top 10 Products by Amount * Quantity
        </p>
        {pieData.length > 0 ? (
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
            width={400}
            height={200}
            hideLegend={true}
            tooltip={{
              trigger: "item",
              formatter: (params) => {
                const item = pieData[params.dataIndex];
                return `${item.productName}: ${item.totalAmount.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`;
              },
            }}
          />
        ) : (
          <div className="flex justify-center items-center h-[200px]">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>

      <div className="bg-white p-10 text-center border border-[#2D2D2D]/25 rounded-lg">
        <p className="font-semibold mb-4 text-[#3d3d3d] text-lg">
          Inventory by Location
        </p>
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
