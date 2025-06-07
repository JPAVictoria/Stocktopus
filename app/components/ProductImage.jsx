import { useState, useEffect } from 'react';
import { isValidUrl } from '@/app/utils/helpers';
import Image from 'next/image';

const ProductImage = ({ imageUrl, name, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState("/octopus.png");

  
  useEffect(() => {
    setImageError(false); 
    
    if (imageUrl && isValidUrl(imageUrl)) {
      
      const newImageSrc = imageUrl.includes('?') 
        ? `${imageUrl}&t=${Date.now()}` 
        : `${imageUrl}?t=${Date.now()}`;
      setImageSrc(newImageSrc);
    } else {
      setImageSrc("/octopus.png");
    }
  }, [imageUrl]); 

  const handleImageError = () => {
    setImageError(true);
    setImageSrc("/octopus.png");
  };

  return (
    <div className="flex items-center gap-4">
      <Image
        src={imageSrc}
        alt={name || "Product"}
        width={60}
        height={60}
        className="rounded"
        onError={handleImageError}
        unoptimized={!imageSrc.startsWith("/")}
        
        key={imageSrc}
      />
      <span 
        className="text-sm font-medium text-[#333333] cursor-pointer hover:underline transition-all duration-200"
        onClick={onClick}
      >
        {name}
      </span>
    </div>
  );
};

export default ProductImage;