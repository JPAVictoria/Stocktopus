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

export default function SubtractModal({ open, onClose, product = null }) {
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [fetchingLocations, setFetchingLocations] = useState(false);

  const fetchExistingLocations = async () => {
    try {
      setFetchingLocations(true);
      
      
      if (product && product.originalData?.locations) {
        
        const locationsWithStock = product.originalData.locations.filter(
          loc => parseFloat(loc.quantity) > 0 && !loc.deleted
        );
        setAvailableLocations(locationsWithStock);
      } else {
        setAvailableLocations([]);
      }
    } catch (error) {
      console.error("Error processing locations:", error);
      openSnackbar("Failed to load locations", "error");
      setAvailableLocations([]);
    } finally {
      setFetchingLocations(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchExistingLocations();
      clearFields();
    } else {
      clearFields();
    }
  }, [open, product]);

  const clearFields = () => {
    setQuantity("");
    setLocation("");
  };

  const getMaxQuantityForLocation = () => {
    if (!location) return 0;
    const selectedLocation = availableLocations.find(
      (loc) => loc.locationId === location
    );
    return parseFloat(selectedLocation?.quantity) || 0;
  };

  const formatQuantity = (value) => {
    
    const num = parseFloat(value);
    if (isNaN(num)) return "0";
    return num % 1 === 0 ? num.toString() : num.toFixed(2).replace(/\.?0+$/, '');
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    
    
    if (value === "") {
      setQuantity("");
      return;
    }
    
    
    const decimalRegex = /^\d*\.?\d{0,2}$/;
    if (decimalRegex.test(value)) {
      setQuantity(value);
    }
  };

  const handleSubmit = async () => {
    const quantityValue = parseFloat(quantity);
    
    if (!quantity || quantityValue <= 0 || isNaN(quantityValue)) {
      openSnackbar("Valid quantity is required", "error");
      return;
    }

    if (!location) {
      openSnackbar("Location is required", "error");
      return;
    }

    const maxAvailable = getMaxQuantityForLocation();
    if (quantityValue > maxAvailable) {
      openSnackbar(
        `Cannot subtract ${formatQuantity(quantity)} items. Only ${formatQuantity(maxAvailable)} available at this location.`,
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/products/subtract", {
        productId: product?.id,
        locationId: location,
        quantity: quantityValue,
      }, {
        withCredentials: true,
      });

      const selectedLocation = availableLocations.find(
        (loc) => loc.locationId === location
      );
      
      openSnackbar(
        `Successfully subtracted ${formatQuantity(quantity)} units from ${selectedLocation?.location.name}`,
        "success"
      );

      clearFields();
      onClose();
    } catch (error) {
      console.error("Error subtracting product quantity:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          openSnackbar("Authentication required. Please log in.", "error");
        } else {
          openSnackbar(
            `Failed to subtract quantity: ${error.response.data?.error || "Unknown error"}`,
            "error"
          );
        }
      } else if (error.request) {
        openSnackbar("Network error. Please check your connection.", "error");
      } else {
        openSnackbar("Failed to subtract product quantity", "error");
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
          bgcolor: "#dc2626",
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
        Subtract Product Quantity
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
              Current Total: {formatQuantity(product.totalQuantity)}
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
              {fetchingLocations ? "Loading locations..." : 
               availableLocations.length === 0 ? "No locations with stock available" :
               "Choose location to subtract from"}
            </MenuItem>
            {availableLocations.map((loc) => (
              <MenuItem key={loc.locationId} value={loc.locationId}>
                {loc.location.name} (Available: {formatQuantity(loc.quantity)})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Quantity to Subtract"
          type="text"
          value={quantity}
          onChange={handleQuantityChange}
          margin="dense"
          size="small"
          sx={{ mt: 2 }}
          InputLabelProps={{ style: { color: "#333333", fontSize: "14px" } }}
          InputProps={{
            style: { color: "#333333" },
            inputProps: {
              inputMode: "decimal",
              pattern: "[0-9]*\\.?[0-9]{0,2}",
              step: "0.01",
            },
          }}
          helperText={
            location
              ? `Max available: ${formatQuantity(getMaxQuantityForLocation())} • Supports decimals (e.g., 1.5, 2.25)`
              : "Select location first • Supports decimals (e.g., 1.5, 2.25)"
          }
          disabled={loading}
          placeholder="Enter quantity (e.g., 1.5)"
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
            backgroundColor: "#dc2626",
            color: "#ffffff",
            textTransform: "none",
            fontSize: "0.8rem",
            px: 2.5,
            py: 0.5,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#b91c1c",
            },
          }}
          disabled={loading || fetchingLocations || availableLocations.length === 0}
        >
          {loading ? "Subtracting..." : "Subtract"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}