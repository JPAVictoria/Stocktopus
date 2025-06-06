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

export default function TransferModal({ open, onClose, product = null, onTransferSuccess }) {
  const [quantity, setQuantity] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

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
    setFromLocation("");
    setToLocation("");
  };

  const handleSubmit = async () => {
    if (!quantity || quantity <= 0) {
      openSnackbar("Valid quantity is required", "error");
      return;
    }

    if (!fromLocation) {
      openSnackbar("Source location is required", "error");
      return;
    }

    if (!toLocation) {
      openSnackbar("Destination location is required", "error");
      return;
    }

    if (fromLocation === toLocation) {
      openSnackbar(
        "Source and destination locations cannot be the same",
        "error"
      );
      return;
    }

    const maxAvailable = getMaxQuantityForLocation(fromLocation);
    if (parseInt(quantity) > maxAvailable) {
      openSnackbar(
        `Cannot transfer ${quantity} items. Only ${maxAvailable} available at source location.`,
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const transferData = {
        productId: product?.id,
        quantity: parseInt(quantity),
        fromLocationId: fromLocation,
        toLocationId: toLocation,
      };

      console.log("Transfer operation:", transferData);

      const response = await axios.post('/api/products/transfer', transferData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.data) {
        const fromLocationName = availableLocations.find(
          (loc) => loc.locationId === fromLocation
        )?.location.name;
        const toLocationName = availableLocations.find(
          (loc) => loc.locationId === toLocation
        )?.location.name;
        
        openSnackbar(
          `Successfully transferred ${quantity} units from ${fromLocationName} to ${toLocationName}`,
          "success"
        );

        
        if (onTransferSuccess) {
          onTransferSuccess(response.data.product);
        }

        clearFields();
        onClose();
      }
    } catch (error) {
      console.error("Transfer error:", error);
      
      const errorMessage = error.response?.data?.error || "Failed to transfer product quantity";
      openSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const getMaxQuantityForLocation = (locationId) => {
    if (!locationId) return 0;
    const selectedLocation = availableLocations.find(
      (loc) => loc.locationId === locationId
    );
    return selectedLocation?.quantity || 0;
  };

  const getDestinationLocations = () => {
    return availableLocations;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px" } }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#06b6d4",
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
        Transfer Product
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close"
          sx={{ color: "#ffffff" }}
          disabled={loading}
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
              Total Available: {product.totalQuantity}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth margin="dense" size="small">
            <InputLabel
              id="from-location-label"
              sx={{ color: "#333333", fontSize: "14px" }}
            >
              From Location
            </InputLabel>
            <Select
              labelId="from-location-label"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              label="From Location"
              sx={{ color: "#333333" }}
              disabled={loading}
            >
              <MenuItem value="" disabled>
                Choose source location
              </MenuItem>
              {availableLocations.map((loc) => (
                <MenuItem key={loc.locationId} value={loc.locationId}>
                  {loc.location.name} (Available: {loc.quantity})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" size="small">
            <InputLabel
              id="to-location-label"
              sx={{ color: "#333333", fontSize: "14px" }}
            >
              To Location
            </InputLabel>
            <Select
              labelId="to-location-label"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              label="To Location"
              sx={{ color: "#333333" }}
              disabled={!fromLocation || loading}
            >
              <MenuItem value="" disabled>
                Choose destination location
              </MenuItem>
              {getDestinationLocations()
                .filter((loc) => loc.locationId !== fromLocation)
                .map((loc) => (
                  <MenuItem key={loc.locationId} value={loc.locationId}>
                    {loc.location.name} (Current: {loc.quantity})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        <TextField
          fullWidth
          label="Quantity to Transfer"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          margin="dense"
          size="small"
          sx={{ mt: 2 }}
          disabled={loading}
          InputLabelProps={{ style: { color: "#333333", fontSize: "14px" } }}
          InputProps={{
            style: { color: "#333333" },
            inputProps: {
              min: 1,
              max: getMaxQuantityForLocation(fromLocation),
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button
          onClick={clearFields}
          variant="outlined"
          size="small"
          disabled={loading}
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
          disabled={loading}
          sx={{
            backgroundColor: "#06b6d4",
            color: "#ffffff",
            textTransform: "none",
            fontSize: "0.8rem",
            px: 2.5,
            py: 0.5,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#0891b2",
            },
            "&:disabled": {
              backgroundColor: "#94a3b8",
            },
          }}
        >
          {loading ? "Transferring..." : "Transfer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}