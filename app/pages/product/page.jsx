"use client";

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { SquarePlus } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import ProductModal from "@/app/components/ProductModal";
import SubtractModal from "@/app/components/SubtractModal";
import AdditionModal from "@/app/components/AdditionModal";
import TransferModal from "@/app/components/TransferModal";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useProducts } from "@/app/hooks/useProducts";
import { useModals } from "@/app/hooks/useProductModals";
import { createColumns } from "@/app/config/columns";

export default function ProductOverview() {
  const { openSnackbar } = useSnackbar();
  const { products, loading, fetchProducts, deleteProduct } = useProducts(openSnackbar);
  const modals = useModals();

  const handleConfirmDelete = async () => {
    if (!modals.deletingProduct) return;
    
    modals.setIsDeleting(true);
    try {
      await deleteProduct(modals.deletingProduct.id);
      openSnackbar("Product deleted successfully.", "success");
      modals.closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete product:", error);
      openSnackbar("Failed to delete product. Please try again.", "error");
    } finally {
      modals.setIsDeleting(false);
    }
  };

  const columnHandlers = {
    onProductNameClick: (product) => modals.openProductModal(product, 'update'),
    onAdd: modals.openAdditionModal,
    onSubtract: modals.openSubtractModal,
    onTransfer: modals.openTransferModal,
    onDelete: modals.openDeleteModal,
  };

  const columns = createColumns(columnHandlers);

  const handleModalClose = (closeModal) => {
    closeModal();
    fetchProducts();
  };

  return (
    <div className="p-8 min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-4 mt-15">
          <h2 className="text-2xl font-semibold text-[#333333]">
            Product Inventory
          </h2>
          <button
            onClick={() => modals.openProductModal()}
            className="flex flex-col items-center text-sm text-[#333333] cursor-pointer hover:bg-gray-200 rounded-md transition-colors duration-200 px-4 py-2"
          >
            <SquarePlus size={20} className="mb-1" />
            <span>Add product</span>
          </button>
        </div>

        <DataGrid
          rows={products}
          columns={columns}
          rowHeight={80}
          pageSizeOptions={[5, 10, 25]}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          sx={{
            height: 500,
            ".MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
            },
            ".MuiDataGrid-row": {
              alignItems: "center",
              "&:hover": {
                backgroundColor: "transparent",
              },
            },
            ".MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
          disableRowSelectionOnClick
        />
      </div>

      <ProductModal
        open={modals.modalOpen}
        onClose={() => handleModalClose(modals.closeProductModal)}
        onSubmit={() => {}}
        mode={modals.modalMode}
        product={modals.selectedProduct}
      />

      <SubtractModal
        open={modals.subtractModalOpen}
        onClose={() => handleModalClose(modals.closeSubtractModal)}
        product={modals.selectedProduct}
      />

      <AdditionModal
        open={modals.additionModalOpen}
        onClose={() => handleModalClose(modals.closeAdditionModal)}
        product={modals.selectedProduct}
      />

      <TransferModal
        open={modals.transferModalOpen}
        onClose={() => handleModalClose(modals.closeTransferModal)}
        product={modals.selectedProduct}
      />

      <ConfirmDeleteModal
        open={modals.confirmDeleteOpen}
        onClose={modals.closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={modals.isDeleting}
        title="Delete Product"
        message="Are you sure you want to delete this product? This will remove it from all locations and cannot be undone."
        itemName={modals.deletingProduct?.name}
        confirmText="Delete Product"
      />
    </div>
  );
}