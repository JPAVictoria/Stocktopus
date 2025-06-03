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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ProductModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (open) {
      fetchLocations();
    } else {
      clearFields();
    }
  }, [open]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get("/api/inventory"); 
      setLocations(response.data || []);
    } catch (error) {
      console.error("Failed to fetch inventory locations", error);
    }
  };

  const clearFields = () => {
    setName("");
    setImage("");
    setQuantity("");
    setPrice("");
    setLocation("");
  };

  const handleSubmit = () => {
    if (!name.trim() || !image.trim() || !quantity || !price || !location) return;
    onSubmit({ name, image, quantity, price, location });
    clearFields();
    onClose();
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
          InputProps={{ style: { color: "#333333" }, inputProps: { min: 0 } }}
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
          InputProps={{ style: { color: "#333333" }, inputProps: { min: 0 } }}
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
            endAdornment={
              location && (
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
              <MenuItem key={loc.id} value={loc.location}>
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
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
