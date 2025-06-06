"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { SquarePlus, Trash2, Pen } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { Chip } from "@mui/material";
import LocationModal from "@/app/components/LocationModal";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { getRowHeightProduct } from "@/app/utils/helpers";

export default function InventoryLocations() {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [initialEditData, setInitialEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { openSnackbar } = useSnackbar();

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/inventory");
      setRows(res.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      openSnackbar("Failed to load locations.", "error");
    } finally {
      setLoading(false);
    }
  }, [openSnackbar]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleOpenConfirm = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setDeletingId(null);
  };

  const handleSoftDelete = useCallback(async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await axios.put("/api/inventory", {
        id: deletingId,
        softDelete: true,
      });
      setRows((prevRows) => prevRows.filter((r) => r.id !== deletingId));
      openSnackbar("Location deleted successfully.", "success");
      setConfirmOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to soft delete location:", error);
      openSnackbar("Failed to delete location. Try again.", "error");
    } finally {
      setDeleting(false);
    }
  }, [deletingId, openSnackbar]);

  const handleEdit = (row) => {
    setInitialEditData(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInitialEditData(null);
  };

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
        <div className="flex flex-col items-center gap-1 py-3">
          {params.row.productDetails?.map((product, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm">{product.name}</span>
              <Chip
                label={product.quantity}
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
          )) || <span className="text-gray-500 text-sm">No products</span>}
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
      flex: 0.6,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
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
            <div
              className="flex flex-col items-center cursor-pointer text-green-600"
              onClick={() => handleEdit(params.row)}
            >
              <div style={iconWrapperStyle(colors.add)}>
                <Pen size={22} />
              </div>
              <span className="text-xs">Edit</span>
            </div>
            <div
              className="flex flex-col items-center cursor-pointer text-red-600"
              onClick={() => handleOpenConfirm(params.row.id)}
            >
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

  return (
    <div className="p-8 min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-4 mt-15">
          <h2 className="text-2xl font-semibold text-[#333333]">
            Inventory Location
          </h2>
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
          getRowHeight={getRowHeightProduct}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
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

      <LocationModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={fetchLocations}
        existingLocations={rows}
        initialData={initialEditData}
      />

      <ConfirmDeleteModal
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleSoftDelete}
        isDeleting={deleting}
        message="Are you sure you want to delete this location?"
      />
    </div>
  );
}
