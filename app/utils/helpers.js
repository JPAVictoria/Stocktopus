export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
};

export const formatNumberWithCommas = (number) => {
  return number.toLocaleString();
};


 export const getRowHeight = (params) => {
    let locationCount = 1; 
    
    if (Array.isArray(params.model.location)) {
      locationCount = params.model.location.length;
    } else if (typeof params.model.location === 'string') {
      locationCount = params.model.location.split(',').length;
    } else if (params.model.locations && Array.isArray(params.model.locations)) {
      locationCount = params.model.locations.length;
    }
    
    const baseHeight = 80; 
    const heightPerLocation = 25; 
    const padding = 20; 
    
    return Math.max(baseHeight, baseHeight + (locationCount - 1) * heightPerLocation + padding);
  };

  export const getRowHeightProduct = (params) => {
  let productCount = 1;
  
  
  if (params.model.productDetails && Array.isArray(params.model.productDetails)) {
    productCount = params.model.productDetails.length;
  }
  
  else if (params.model.products && Array.isArray(params.model.products)) {
    productCount = params.model.products.length;
  }
  
  else {
    productCount = 1; 
  }
  
  const baseHeight = 80;
  const heightPerProduct = 35; 
  const padding = 20;
  
  return Math.max(baseHeight, baseHeight + (productCount - 1) * heightPerProduct + padding);
};