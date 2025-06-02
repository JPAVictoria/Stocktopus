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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "@/app/context/SnackbarContext";

export default function LocationModal({ open, onClose, onSuccess, existingLocations = [] }) {
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    if (!open) {
      setLocation("");
      setAddress("");
      setLoading(false);
    }
  }, [open]);

  const handleClear = () => {
    setLocation("");
    setAddress("");
  };

  const handleSubmit = async () => {
    const trimmedLocation = location.trim();
    const trimmedAddress = address.trim();

    if (!trimmedLocation || !trimmedAddress) {
      openSnackbar("Please fill in all input fields.", "error");
      return;
    }

    const duplicate = existingLocations.some(
      (loc) => loc.location.toLowerCase() === trimmedLocation.toLowerCase()
    );

    if (duplicate) {
      openSnackbar("Location name must be unique. This name already exists.", "error");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/inventory", { location: trimmedLocation, address: trimmedAddress });

      openSnackbar("Location added successfully.", "success");

      if (onSuccess) onSuccess();

      handleClear();
      onClose();
    } catch (err) {
      console.error(err);
      const message = err.response?.data || "Failed to create location. Please try again.";
      openSnackbar(message, "error");
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
