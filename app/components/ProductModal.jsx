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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "@/app/context/SnackbarContext";

export default function ProductModal({ open, onClose, onSubmit, mode = 'create', product = null }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { openSnackbar } = useSnackbar();
  const isUpdateMode = mode === 'update';

  useEffect(() => {
    if (open) {
      fetchLocations();
      if (isUpdateMode && product) {
        populateFields(product);
      } else {
        clearFields();
      }
    } else {
      clearFields();
    }
  }, [open, mode, product]);

  const populateFields = (productData) => {
    setName(productData.name || "");
    setImage(productData.imageUrl || "");
    setPrice(productData.srp || "");
    
    if (productData.originalData) {
      const totalQuantity = productData.originalData.locations.reduce(
        (sum, loc) => sum + loc.quantity,
        0
      );
      setQuantity(totalQuantity.toString());
      
      if (productData.originalData.locations.length > 0) {
        setLocation(productData.originalData.locations[0].locationId);
      }
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get("/api/inventory");
      setLocations(response.data || []);
    } catch (error) {
      console.error("Failed to fetch inventory locations", error);
      openSnackbar("Failed to fetch locations", "error");
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
    if (!name.trim()) {
      openSnackbar("Product name is required", "error");
      return;
    }
    if (!image.trim()) {
      openSnackbar("Image URL is required", "error");
      return;
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      openSnackbar("Valid quantity is required", "error");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      openSnackbar("Valid price is required", "error");
      return;
    }
    if (!location) {
      openSnackbar("Location is required", "error");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: name.trim(),
        imageUrl: image.trim(),
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        locationId: location,
      };

      let response;
      if (isUpdateMode) {
        response = await axios.put(`/api/products/${product.id}`, productData);
        openSnackbar("Product updated successfully!", "success");
      } else {
        response = await axios.post("/api/products", productData);
        openSnackbar("Product created successfully!", "success");
      }

      if (onSubmit) {
        onSubmit(response.data);
      }

      clearFields();
      onClose();
    } catch (error) {
      console.error(`Failed to ${isUpdateMode ? 'update' : 'create'} product:`, error);

      if (error.response?.status === 409) {
        openSnackbar("A product with this name already exists", "error");
      } else if (error.response?.status === 404 && isUpdateMode) {
        openSnackbar("Product not found", "error");
      } else if (error.response?.data?.error) {
        openSnackbar(error.response.data.error, "error");
      } else {
        openSnackbar(`Failed to ${isUpdateMode ? 'update' : 'create'} product. Please try again.`, "error");
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
        {isUpdateMode ? "Update Product" : "Add New Product"}
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
          InputProps={{ 
            style: { color: "#333333" }, 
            inputProps: { min: 0.01, step: 0.01 } 
          }}
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
              {isUpdateMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            isUpdateMode ? "Update" : "Submit"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}