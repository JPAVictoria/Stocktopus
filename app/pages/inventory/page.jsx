"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { SquarePlus, Trash2, Pen } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { Chip } from "@mui/material";
import LocationModal from "@/app/components/LocationModal";

const columns = [
  {
    field: "location",
    headerName: "Location",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "products",
    headerName: "Associated Products",
    headerAlign: "center",
    align: "center",
    flex: 0.8,
    renderCell: (params) => (
      <div className="flex items-center gap-2">
        <span>{params.value}</span>
        <Chip
          label={params.row.productCount}
          size="small"
          sx={{
            backgroundColor: "rgba(34,197,94,0.2)",
            color: "rgb(34, 197, 94)",
            fontWeight: 500,
            fontSize: "0.75rem",
            height: "20px",
          }}
        />
      </div>
    ),
  },
  {
    field: "address",
    headerName: "Address",
    headerAlign: "center",
    align: "center",
    flex: 0.6,
  },
  {
    field: "createdDate",
    headerName: "Created Date",
    headerAlign: "center",
    align: "center",
    flex: 0.8,
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
              <Pen size={22} />
            </div>
            <span className="text-xs">Edit</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-red-600">
            <div style={iconWrapperStyle(colors.subtract)}>
              <Trash2 size={22} />
            </div>
            <span className="text-xs">Delete</span>
          </div>
        </div>
      );
    },
  },
];

export default function InventoryLocations() {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true); 
      try {
        const res = await axios.get("/api/inventory");
        setRows(res.data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="p-8 min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-4 mt-15">
          <h2 className="text-2xl font-semibold text-[#333333]">Inventory Location</h2>
          <button
            className="flex flex-col items-center text-sm text-[#333333] cursor-pointer hover:bg-gray-200 rounded-md transition-colors duration-200 px-4 py-2"
            onClick={() => setOpenModal(true)}
          >
            <SquarePlus size={20} className="mb-1" />
            <span>Add location</span>
          </button>
        </div>

        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={80}
          pageSizeOptions={[5, 10]}
          loading={loading} 
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

      <LocationModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={() => {}} />
    </div>
  );
}
