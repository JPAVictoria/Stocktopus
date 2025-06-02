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
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function LocationModal({ open, onClose, onSuccess }) {
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    if (!open) {
      setLocation("");
      setAddress("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  const handleClear = () => {
    setLocation("");
    setAddress("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!location.trim() || !address.trim()) {
      setError("Both Location Name and Address are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("/api/inventory", { location: location.trim(), address: address.trim() });

      
      if (onSuccess) onSuccess();

      handleClear();
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data || "Failed to create location. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!loading) onClose();
      }}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
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
        Add New Location
        <IconButton
          onClick={() => {
            if (!loading) onClose();
          }}
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
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Location Name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          margin="dense"
          size="small"
          disabled={loading}
          sx={{ mt: 1 }}
          InputLabelProps={{
            style: {
              color: "#333333",
              fontSize: "15px",
            },
          }}
          InputProps={{
            style: {
              color: "#333333",
            },
          }}
        />

        <TextField
          fullWidth
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          margin="dense"
          size="small"
          disabled={loading}
          sx={{ mt: 3 }}
          InputLabelProps={{
            style: {
              color: "#333333",
              fontSize: "15px",
            },
          }}
          InputProps={{
            style: {
              color: "#333333",
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button
          onClick={handleClear}
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
            position: "relative",
            minWidth: "80px",
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Submit"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
