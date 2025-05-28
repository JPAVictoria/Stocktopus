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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function LocationModal({ open, onClose, onSubmit }) {
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");

  
  useEffect(() => {
    if (!open) {
      setLocation("");
      setAddress("");
    }
  }, [open]);

  const handleClear = () => {
    setLocation("");
    setAddress("");
  };

  const handleSubmit = () => {
    if (!location.trim() || !address.trim()) return;
    onSubmit({ location, address });
    handleClear();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          fontWeight: 500, 
          fontSize: "1rem",
          py: 1.5,
          px: 2,
        }}
      >
        Add New Location
        <IconButton onClick={onClose} size="small" aria-label="close" sx={{ color: "#ffffff" }}>
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
          sx={{ mt: 3 }}
          InputLabelProps={{
            style: {
              color: "#333333",
              fontSize: "15px"
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
