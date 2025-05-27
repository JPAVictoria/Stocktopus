"use client";

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { SquarePlus, Minus, MoveRight, Plus } from "lucide-react";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";

const columns = [
  {
    field: "product",
    headerName: "Product",
    width: 300,
    renderCell: () => (
      <div className="flex items-center gap-4">
        <Image
          src="/octopus.png"
          alt="Product"
          width={60}
          height={60}
          className="rounded"
        />
        <span className="text-sm font-medium text-[#333333]">
          Gaming Laptop
        </span>
      </div>
    ),
  },
  {
    field: "totalQuantity",
    headerName: "Total Quantity",
    headerAlign: "center",
    align: "center",
    flex: 0.5,
    renderCell: (params) => (
      <div className="text-[#333333] flex items-center h-full">
        {params.value}
      </div>
    ),
  },
  {
    field: "location",
    headerName: "Inventory Location",
    headerAlign: "center",
    align: "center",

    flex: 1,
    renderCell: (params) => (
      <div className="text-[#333333] flex items-center h-full">
        {params.value}
      </div>
    ),
  },
  {
    field: "srp",
    headerName: "SRP",
    headerAlign: "center",
    align: "center",
    width: 50,
    flex: 0.8,
    renderCell: (params) => (
      <div className="text-[#333333] flex items-center h-full">
        {params.value}
      </div>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    headerAlign: "center",
    align: "center",
    sortable: false,
    renderCell: () => {
      const colors = {
        add: "rgba(34,197,94,0.15)",
        subtract: "rgba(220,38,38,0.15)",
        transfer: "rgba(6,182,212,0.15)",
      };

      const iconWrapperStyle = (bgColor) => ({
        background: `radial-gradient(circle, ${bgColor} 0%, transparent 80%)`,
        borderRadius: "50%",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        width: "40px",
        height: "40px",
        userSelect: "none",
      });

      return (
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center cursor-pointer text-green-600">
            <div style={iconWrapperStyle(colors.add)}>
              <Plus size={22} />
            </div>
            <span className="text-xs">Add</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-red-600">
            <div style={iconWrapperStyle(colors.subtract)}>
              <Minus size={22} />
            </div>
            <span className="text-xs">Subtract</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-cyan-600">
            <div style={iconWrapperStyle(colors.transfer)}>
              <MoveRight size={22} />
            </div>
            <span className="text-xs">Transfer</span>
          </div>
        </div>
      );
    },
  },
];

const rows = [
  {
    id: 1,
    totalQuantity: "500",
    location: "Muntinlupa",
    srp: "999.99",
  },

];

export default function ProductOverview() {
  return (
    <div className="p-8 min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-4 mt-15">
          <h2 className="text-2xl font-semibold text-[#333333]">
            Product Inventory
          </h2>
          <button
            className="flex flex-col items-center text-sm text-[#333333] cursor-pointer  hover:bg-gray-200 rounded-md 
            transition-colors duration-200 px-4 py-2"
          >
            <SquarePlus size={20} className="mb-1" />
            <span>Add product</span>
          </button>
        </div>

        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={80}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          sx={{
            height: 500,
            ".MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
            },
            ".MuiDataGrid-row": {
              alignItems: "center",
              "&:hover": {
                backgroundColor: "transparent",
              },
            },
            ".MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </div>
    </div>
  );
}
