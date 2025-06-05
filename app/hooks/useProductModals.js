import { useState } from 'react';

export const useModals = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [subtractModalOpen, setSubtractModalOpen] = useState(false);
  const [additionModalOpen, setAdditionModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openProductModal = (product = null, mode = 'create') => {
    setSelectedProduct(product);
    setModalMode(mode);
    setModalOpen(true);
  };

  const closeProductModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setModalMode('create');
  };

  const openSubtractModal = (product) => {
    setSelectedProduct(product);
    setSubtractModalOpen(true);
  };

  const closeSubtractModal = () => {
    setSubtractModalOpen(false);
    setSelectedProduct(null);
  };

  const openAdditionModal = (product) => {
    setSelectedProduct(product);
    setAdditionModalOpen(true);
  };

  const closeAdditionModal = () => {
    setAdditionModalOpen(false);
    setSelectedProduct(null);
  };

  const openTransferModal = (product) => {
    setSelectedProduct(product);
    setTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setTransferModalOpen(false);
    setSelectedProduct(null);
  };

  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setConfirmDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setConfirmDeleteOpen(false);
    setDeletingProduct(null);
  };

  return {
    
    modalOpen,
    subtractModalOpen,
    additionModalOpen,
    transferModalOpen,
    confirmDeleteOpen,
    selectedProduct,
    modalMode,
    deletingProduct,
    isDeleting,
    setIsDeleting,
    
    openProductModal,
    closeProductModal,
    openSubtractModal,
    closeSubtractModal,
    openAdditionModal,
    closeAdditionModal,
    openTransferModal,
    closeTransferModal,
    openDeleteModal,
    closeDeleteModal,
  };
};