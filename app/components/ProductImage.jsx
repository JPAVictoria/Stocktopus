import { useState } from 'react';
import Image from 'next/image';
import { isValidUrl } from '@/app/utils/helpers';

const ProductImage = ({ imageUrl, name, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => {
    if (imageUrl && isValidUrl(imageUrl)) {
      return imageUrl;
    }
    return "/octopus.png";
  });

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