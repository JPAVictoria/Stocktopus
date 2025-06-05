"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "../context/SnackbarContext";
import axios from "axios";

export default function AdditionModal({ open, onClose, product = null }) {
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [fetchingLocations, setFetchingLocations] = useState(false);

  
  const fetchAllLocations = async () => {
    try {
      setFetchingLocations(true);
      const response = await axios.get("/api/inventory", {
        withCredentials: true,
      });
      
      
      const allLocations = response.data.map(loc => ({
        locationId: loc.id,
        location: {
          id: loc.id,
          name: loc.location 
        },
        quantity: 0, 
        isExisting: false 
      }));

      
      if (product && product.originalData?.locations) {
        const existingLocationIds = product.originalData.locations.map(l => l.locationId);
        
        
        const mergedLocations = allLocations.map(loc => {
          const existingLocation = product.originalData.locations.find(
            existing => existing.locationId === loc.locationId
          );
          
          if (existingLocation) {
            return {
              ...loc,
              quantity: existingLocation.quantity,
              isExisting: true
            };
          }
          return loc;
        });

        setAvailableLocations(mergedLocations);
      } else {
        setAvailableLocations(allLocations);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      openSnackbar("Failed to fetch locations", "error");
      
      
      if (product && product.originalData?.locations) {
        setAvailableLocations(product.originalData.locations);
      }
    } finally {
      setFetchingLocations(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAllLocations();
      clearFields();
    } else {
      clearFields();
    }
  }, [open, product]);

  const clearFields = () => {
    setQuantity("");
    setLocation("");
  };

  const handleSubmit = async () => {
    if (!quantity || quantity <= 0) {
      openSnackbar("Valid quantity is required", "error");
      return;
    }

    if (!location) {
      openSnackbar("Location is required", "error");
      return;
    }

    setLoading(true);

    try {
      
      const response = await axios.post("/api/products/add", {
        productId: product?.id,
        locationId: location,
        quantity: parseInt(quantity),
      }, {
        withCredentials: true,
      });

      const selectedLocation = availableLocations.find(
        (loc) => loc.locationId === location
      );
      
      openSnackbar(
        `Successfully added ${quantity} units to ${selectedLocation?.location.name}`,
        "success"
      );

      clearFields();
      onClose();
    } catch (error) {
      console.error("Error adding product quantity:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          openSnackbar("Authentication required. Please log in.", "error");
        } else {
          openSnackbar(
            `Failed to add quantity: ${error.response.data?.error || "Unknown error"}`,
            "error"
          );
        }
      } else if (error.request) {
        openSnackbar("Network error. Please check your connection.", "error");
      } else {
        openSnackbar("Failed to add product quantity", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px" } }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#22c55e",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          fontSize: "1rem",
          py: 1.5,
          px: 2,
        }}
      >
        Add Product Quantity
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close"
          sx={{ color: "#ffffff" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2.5, py: 2.5 }}>
        {product && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-1">
              Product: {product.name}
            </h4>
            <p className="text-sm text-gray-600">
              Current Total: {product.totalQuantity}
            </p>
          </div>
        )}

        <FormControl fullWidth margin="dense" size="small" sx={{ mt: 1 }}>
          <InputLabel
            id="location-label"
            sx={{ color: "#333333", fontSize: "14px" }}
          >
            Select Location
          </InputLabel>
          <Select
            labelId="location-label"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            label="Select Location"
            sx={{ color: "#333333" }}
            disabled={loading || fetchingLocations}
            endAdornment={
              location &&
              !loading && (
                <IconButton
                  size="small"
                  onClick={() => setLocation("")}
                  aria-label="Clear inventory location"
                  sx={{ mr: 1, transform: "translateX(-4px)" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )
            }
          >
            <MenuItem value="" disabled>
              {fetchingLocations ? "Loading locations..." : "Choose location to add to"}
            </MenuItem>
            {availableLocations.map((loc) => (
              <MenuItem key={loc.locationId} value={loc.locationId}>
                {loc.location.name} 
                {loc.isExisting ? ` (Current: ${loc.quantity})` : " (New location)"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Quantity to Add"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          margin="dense"
          size="small"
          sx={{ mt: 2 }}
          disabled={loading}
        />
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button
          onClick={clearFields}
          variant="outlined"
          size="small"
          sx={{
            color: "#333333",
            borderColor: "#333333",
            textTransform: "none",
            fontSize: "0.8rem",
            px: 2,
            py: 0.5,
            borderRadius: "8px",
          }}
          disabled={loading}
        >
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#22c55e",
            color: "#ffffff",
            textTransform: "none",
            fontSize: "0.8rem",
            px: 2.5,
            py: 0.5,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#16a34a",
            },
          }}
          disabled={loading || fetchingLocations}
        >
          {loading ? "Adding..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}