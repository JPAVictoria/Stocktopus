"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ProductModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetchLocations();
    } else {
      clearFields();
      setError("");
    }
  }, [open]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get("/api/inventory");
      setLocations(response.data || []);
    } catch (error) {
      console.error("Failed to fetch inventory locations", error);
      setError("Failed to fetch locations");
    }
  };

  const clearFields = () => {
    setName("");
    setImage("");
    setQuantity("");
    setPrice("");
    setLocation("");
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!image.trim()) {
      setError("Image URL is required");
      return;
    }
    if (!quantity || quantity <= 0) {
      setError("Valid quantity is required");
      return;
    }
    if (!price || price <= 0) {
      setError("Valid price is required");
      return;
    }
    if (!location) {
      setError("Location is required");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: name.trim(),
        imageUrl: image.trim(),
        quantity: parseInt(quantity),
        price: parseFloat(price),
        locationId: location,
      };

      const response = await axios.post("/api/products", productData);

      // Call the parent's onSubmit callback if provided
      if (onSubmit) {
        onSubmit(response.data);
      }

      clearFields();
      onClose();
    } catch (error) {
      console.error("Failed to create product:", error);

      if (error.response?.status === 409) {
        setError("A product with this name already exists");
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to create product. Please try again.");
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
          bgcolor: "#ffa408",
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
        Add New Product
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
        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: "0.85rem" }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="dense"
          size="small"
          sx={{ mt: 1 }}
          InputLabelProps={{ style: { color: "#333333", fontSize: "14px" } }}
          InputProps={{ style: { color: "#333333" } }}
          disabled={loading}
          error={error.includes("name")}
        />

        <TextField
          fullWidth
          label="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          margin="dense"
          size="small"
          sx={{ mt: 2 }}
          InputLabelProps={{ style: { color: "#333333", fontSize: "14px" } }}
          InputProps={{ style: { color: "#333333" } }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          margin="dense"
          size="small"
          sx={{ mt: 2 }}
          InputLabelProps={{ style: { color: "#333333", fontSize: "14px" } }}
          InputProps={{ style: { color: "#333333" }, inputProps: { min: 1 } }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          margin="dense"
          size="small"
          sx={{ mt: 2 }}
          InputLabelProps={{ style: { color: "#333333", fontSize: "14px" } }}
          InputProps={{
            style: { color: "#333333" },
            inputProps: { min: 0.01, step: 0.01 },
          }}
          disabled={loading}
        />

        <FormControl fullWidth margin="dense" size="small" sx={{ mt: 2 }}>
          <InputLabel
            id="inventory-location-label"
            sx={{ color: "#333333", fontSize: "14px" }}
          >
            Inventory Location
          </InputLabel>
          <Select
            labelId="inventory-location-label"
            id="inventory-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            label="Inventory Location"
            sx={{ color: "#333333" }}
            disabled={loading}
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
              Select location
            </MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>
                {" "}
                {/* Changed from loc.location to loc.id */}
                {loc.location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            backgroundColor: "#ffa408",
            color: "#ffffff",
            textTransform: "none",
            fontSize: "0.8rem",
            px: 2.5,
            py: 0.5,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#e69906",
            },
            "&:disabled": {
              backgroundColor: "#cccccc",
            },
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1, color: "#ffffff" }} />
              Creating...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
