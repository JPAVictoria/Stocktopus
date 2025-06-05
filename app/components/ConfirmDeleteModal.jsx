import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  CircularProgress,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  isDeleting = false,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  itemName = "",
}) {
  const handleClose = () => {
    if (isDeleting) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={isDeleting}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: "8px",
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: "center", 
        paddingBottom: "8px",
        fontSize: "1.25rem",
        fontWeight: 600,
        color: "#1f2937"
      }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <Box 
            sx={{
              backgroundColor: "#fef2f2",
              borderRadius: "50%",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <AlertTriangle size={24} color="#dc2626" />
          </Box>
        </Box>
        <Box sx={{ marginTop: "16px" }}>
          {title}
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: "center", paddingTop: "8px" }}>
        <DialogContentText sx={{ 
          fontSize: "1rem", 
          color: "#6b7280",
          lineHeight: 1.6
        }}>
          {message}
        </DialogContentText>
        
        {itemName && (
          <Box sx={{ 
            marginTop: "12px", 
            padding: "12px", 
            backgroundColor: "#f9fafb", 
            borderRadius: "8px",
            border: "1px solid #e5e7eb"
          }}>
            <strong style={{ color: "#374151" }}>{itemName}</strong>
          </Box>
        )}
        
        <DialogContentText sx={{ 
          fontSize: "0.875rem", 
          color: "#9ca3af",
          marginTop: "16px",
          fontStyle: "italic"
        }}>
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ 
        justifyContent: "center", 
        gap: "12px", 
        padding: "24px",
        paddingTop: "16px"
      }}>
        <Button 
          onClick={handleClose} 
          disabled={isDeleting}
          variant="outlined"
          sx={{
            minWidth: "100px",
            borderColor: "#d1d5db",
            color: "#6b7280",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f9fafb"
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isDeleting}
          sx={{
            minWidth: "100px",
            backgroundColor: "#dc2626",
            "&:hover": {
              backgroundColor: "#b91c1c"
            },
            "&:disabled": {
              backgroundColor: "#fca5a5"
            }
          }}
          startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isDeleting ? "Deleting..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}