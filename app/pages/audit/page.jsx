"use client";

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Navbar from "@/app/components/Navbar";

const columns = [
  {
    field: "action",
    headerName: "Action",
    width: 450,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "timestamp",
    headerName: "Timestamp",
    headerAlign: "center",
    align: "center",
    width: 350,
  },
  {
    field: "email",
    headerName: "Email",
    headerAlign: "center",
    align: "center",
    flex: 1,
    width: 200,
  },
];

const rows = [
  {
    id: 1,
    action: "TRANSFERRED 20 ITEMS TO MUNTINLUPA",
    timestamp: "August 29, 2004 10:52:24 PM",
    email: "andrevictoria829@gmail.com"

  },

];

export default function AuditLogs() {
  return (
    <div className="p-8 min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-4 mt-15">
          <h2 className="text-2xl font-semibold text-[#333333]">
            Audit Logs
          </h2>
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
