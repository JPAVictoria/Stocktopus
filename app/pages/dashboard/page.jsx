"use client";
import Navbar from "@/app/components/Navbar";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useLoading } from "@/app/context/LoaderContext";

const InventoryCharts = dynamic(() => import("@/app/components/InventoryCharts"), {
  ssr: false,
});

const PieAnalytics = dynamic(() => import("@/app/components/PieAnalytics"), {
  ssr: false,
});

export default function InventoryDashboard() {
  
  const { loading, setLoading } = useLoading();

    useEffect(() => {
      setLoading(false);
    }, [setLoading]);

  const pieData = [
    { id: 0, value: 40, color: "#00BCD4" },
    { id: 1, value: 30, color: "#9C27B0" },
    { id: 2, value: 30, color: "#00ACC1" },
  ];

  const lineData = {
    xAxis: [
      {
        scaleType: "point",
        data: ["Day 1", "Day 5", "Day 10", "Day 15", "Day 20", "Day 25", "Day 30"],
      },
    ],
    series: [{ data: [4, 6, 8, 12, 15, 18, 20]}],
  };

  return (
    <div className="flex bg-[#f7f9fc] min-h-screen text-[#3d3d3d]">
      <Navbar />
      <div className="flex-1 ml-[80px] p-8">
        <h1 className="text-xl font-bold text-center mb-10 mt-12">
          Company Inventory Overview
        </h1>
        <InventoryCharts pieData={pieData} lineData={lineData} />
        <PieAnalytics pieData={pieData}/>
      </div>
    </div>
  );
}
