import { useState, useEffect } from 'react';
import axios from 'axios';
import { isValidUrl } from '../utils/helpers';


export const useProducts = (openSnackbar) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/products", {
        withCredentials: true,
      });

      const transformedData = response.data.map((product) => {
        const totalQuantity = product.locations.reduce(
          (sum, loc) => sum + loc.quantity,
          0
        );
        const locationNames = product.locations
          .map((loc) => loc.location.name)
          .join(", ");

        let validImageUrl = "/octopus.png";
        if (product.imageUrl) {
          const trimmedUrl = product.imageUrl.trim();
          if (isValidUrl(trimmedUrl)) {
            validImageUrl = trimmedUrl;
          }
        }

        return {
          id: product.id,
          name: product.name,
          imageUrl: validImageUrl,
          totalQuantity: totalQuantity,
          location: locationNames || "No location",
          srp: product.price.toFixed(2),
          originalData: product,
        };
      });

      setProducts(transformedData);
    } catch (err) {
      console.error("Error fetching products:", err);
      
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    await axios.put("/api/products", {
      id: productId,
      softDelete: true,
    });
    
    setProducts((prevProducts) => 
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    deleteProduct
  };
};