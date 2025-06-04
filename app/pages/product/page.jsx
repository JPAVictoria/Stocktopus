"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { SquarePlus, Minus, MoveRight, Plus } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
import ProductModal from "@/app/components/ProductModal";

// Helper function to validate URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
};

const columns = [
  {
    field: "product",
    headerName: "Product",
    width: 300,
    renderCell: (params) => {
      const [imageError, setImageError] = useState(false);
      const [imageSrc, setImageSrc] = useState(() => {
        // Validate the URL before using it
        if (params.row.imageUrl && isValidUrl(params.row.imageUrl)) {
          return params.row.imageUrl;
        }
        return "/octopus.png"; // fallback to default image
      });

      const handleImageError = () => {
        setImageError(true);
        setImageSrc("/octopus.png");
      };

      return (
        <div className="flex items-center gap-4">
          <Image
            src={imageSrc}
            alt={params.row.name || "Product"}
            width={60}
            height={60}
            className="rounded"
            onError={handleImageError}
            unoptimized={!imageSrc.startsWith('/')} // Don't optimize external images
          />
          <span className="text-sm font-medium text-[#333333]">
            {params.row.name}
          </span>
        </div>
      );
    },
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
        ₱{params.value}
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

export default function ProductOverview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products data using axios
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/products', {
        withCredentials: true, // Include cookies for authentication
      });

      const data = response.data;
      
      // Transform the data to match the DataGrid format
      const transformedData = data.map(product => {
        // Calculate total quantity across all locations
        const totalQuantity = product.locations.reduce((sum, loc) => sum + loc.quantity, 0);
        
        // Get location names (assuming a product can be in multiple locations)
        const locationNames = product.locations.map(loc => loc.location.name).join(', ');
        
        // Validate and clean image URL
        let validImageUrl = "/octopus.png"; // default fallback
        if (product.imageUrl) {
          const trimmedUrl = product.imageUrl.trim();
          if (isValidUrl(trimmedUrl)) {
            validImageUrl = trimmedUrl;
          }
        }
        
        return {
          id: product.id,
          name: product.name,
          imageUrl: validImageUrl,
          totalQuantity: totalQuantity,
          location: locationNames || 'No location',
          srp: product.price.toFixed(2),
          // Keep original product data for potential future use
          originalData: product
        };
      });

      setProducts(transformedData);
    } catch (err) {
      console.error('Error fetching products:', err);
      
      // Handle different types of axios errors
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          setError('Authentication required. Please log in.');
        } else {
          setError(`Failed to fetch products: ${err.response.status} - ${err.response.data?.error || 'Unknown error'}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection.');
      } else {
        // Something else happened
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Refresh products when modal closes (in case new product was added)
  const handleModalClose = () => {
    setModalOpen(false);
    fetchProducts(); // Refresh the data
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-[#333333]">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-lg text-red-600 mb-4">Error: {error}</div>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-4 mt-15">
          <h2 className="text-2xl font-semibold text-[#333333]">
            Product Inventory
          </h2>
          <button
            onClick={() => setModalOpen(true)}
            className="flex flex-col items-center text-sm text-[#333333] cursor-pointer hover:bg-gray-200 rounded-md transition-colors duration-200 px-4 py-2"
          >
            <SquarePlus size={20} className="mb-1" />
            <span>Add product</span>
          </button>
        </div>

        <DataGrid
          rows={products}
          columns={columns}
          rowHeight={80}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
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
          loading={loading}
          disableRowSelectionOnClick
        />

        {products.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No products found. Add your first product to get started.
          </div>
        )}
      </div>

      <ProductModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={() => {}}
      />
    </div>
  );
}