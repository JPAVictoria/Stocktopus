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

export default function SubtractModal({ open, onClose, product = null }) {
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    if (open && product) {
      const locations = product.originalData?.locations || [];
      setAvailableLocations(locations);
      clearFields();
    } else {
      clearFields();
    }
  }, [open, product]);

  const clearFields = () => {
    setQuantity("");
    setLocation("");
  };

  const handleSubmit = () => {
    if (!quantity || quantity <= 0) {
      openSnackbar("Valid quantity is required", "error");
      return;
    }

    if (!location) {
      openSnackbar("Location is required", "error");
      return;
    }

    const maxAvailable = getMaxQuantityForLocation();
    if (parseInt(quantity) > maxAvailable) {
      openSnackbar(`Cannot subtract ${quantity} items. Only ${maxAvailable} available at this location.`, "error");
      return;
    }

    console.log("Subtract operation:", {
      productId: product?.id,
      quantity: parseInt(quantity),
      locationId: location,
    });

    const locationName = availableLocations.find(loc => loc.locationId === location)?.location.name;
    openSnackbar(`Successfully subtracted ${quantity} units from ${locationName}`, "success");

    clearFields();
    onClose();
  };

  const getMaxQuantityForLocation = () => {
    if (!location) return 0;
    const selectedLocation = availableLocations.find(loc => loc.locationId === location);
    return selectedLocation?.quantity || 0;
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
        Subtract Product
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
            <h4 className="font-medium text-gray-800 mb-1">Product: {product.name}</h4>
            <p className="text-sm text-gray-600">Total Available: {product.totalQuantity}</p>
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
          >
            <MenuItem value="" disabled>
              Choose location to subtract from
            </MenuItem>
            {availableLocations.map((loc) => (
              <MenuItem key={loc.locationId} value={loc.locationId}>
                {loc.location.name} (Available: {loc.quantity})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Quantity to Subtract"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          margin="dense"
          size="small"
          sx={{ mt: 2 }}
          InputLabelProps={{ style: { color: "#333333", fontSize: "14px" } }}
          InputProps={{
            style: { color: "#333333" },
            inputProps: { 
              min: 1, 
              max: getMaxQuantityForLocation()
            }
          }}
          helperText={location ? `Max available: ${getMaxQuantityForLocation()}` : "Select location first"}
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
        >
          Subtract
        </Button>
      </DialogActions>
    </Dialog>
  );
}