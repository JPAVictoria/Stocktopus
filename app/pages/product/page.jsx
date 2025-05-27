'use client';

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { SquarePlus, Minus, MoveRight, Plus } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';

const columns = [
  {
    field: 'product',
    headerName: 'Product',
    flex: 1.5,
    renderCell: () => (
      <div className="flex items-center gap-4">
        <Image
          src="/octopus.png"
          alt="Product"
          width={60}
          height={60}
          className="rounded"
        />
        <span className="text-sm font-medium text-[#333333]">Gaming Laptop</span>
      </div>
    ),
  },
  {
    field: 'totalQuantity',
    headerName: 'Total Quantity',
    flex: 1,
    renderCell: (params) => (
      <div className="text-[#333333] flex items-center h-full">{params.value}</div>
    ),
  },
  {
    field: 'location',
    headerName: 'Inventory Location',
    flex: 1,
    renderCell: (params) => (
      <div className="text-[#333333] flex items-center h-full">{params.value}</div>
    ),
  },
  {
    field: 'srp',
    headerName: 'SRP',
    flex: 1,
    renderCell: (params) => (
      <div className="text-[#333333] flex items-center h-full">{params.value}</div>
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    sortable: false,
    renderCell: () => (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center text-green-600 cursor-pointer">
          <Plus size={18} />
          <span className="text-xs">Add</span>
        </div>
        <div className="flex flex-col items-center text-red-600 cursor-pointer">
          <Minus size={18} />
          <span className="text-xs">Subtract</span>
        </div>
        <div className="flex flex-col items-center text-cyan-600 cursor-pointer">
          <MoveRight size={18} />
          <span className="text-xs">Transfer</span>
        </div>
      </div>
    ),
  },
];

const rows = [
  {
    id: 1,
    totalQuantity: '25',
    location: 'CHAMPION',
    srp: 'John Dre',
  },
  {
    id: 2,
    totalQuantity: '25',
    location: 'CHAMPION',
    srp: 'John Dre',
  },
];

export default function ProductOverview() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-10">
      <Navbar />

      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#333333]">Product Inventory</h2>
          <button className="flex flex-col items-center text-sm text-[#333333]">
            <SquarePlus size={24} />
            <span>Add product</span>
          </button>
        </div>

        <div className="bg-white rounded-md shadow-sm p-4">
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
              '.MuiDataGrid-columnHeaders': {
                backgroundColor: '#f9fafb',
              },
              '.MuiDataGrid-row': {
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              },
              '.MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
