import ProductImage from '@/app/components/ProductImage';
import ActionButtons from '@/app/components/ProductActionButtons';
import { formatNumberWithCommas } from '@/app/utils/helpers';

export const createColumns = (handlers) => [
  {
    field: "product",
    headerName: "Product",
    width: 300,
    renderCell: (params) => (
      <ProductImage
        imageUrl={params.row.imageUrl}
        name={params.row.name}
        onClick={() => handlers.onProductNameClick(params.row)}
      />
    ),
  },
  {
    field: "totalQuantity",
    headerName: "Total Quantity",
    headerAlign: "center",
    align: "center",
    flex: 0.5,
    renderCell: (params) => (
      <div className="text-[#333333] flex items-center h-full">
        {formatNumberWithCommas(params.value)}
      </div>
    ),
  },
  {
    field: "location",
    headerName: "Inventory Location",
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: (params) => {
      
      let locations = [];
      
      if (Array.isArray(params.value)) {
        
        locations = params.value;
      } else if (typeof params.value === 'string') {
        
        locations = params.value.split(',').map(loc => loc.trim());
      } else if (params.row.locations && Array.isArray(params.row.locations)) {
        
        locations = params.row.locations;
      } else {
        
        locations = [params.value || 'No location'];
      }

      return (
        <div className="text-[#333333] flex flex-col items-center justify-center h-full py-2">
          {locations.map((location, index) => (
            <div key={index} className="text-sm leading-tight mb-2">
              {location}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    field: "srp",
    headerName: "SRP",
    headerAlign: "center",
    align: "center",
    width: 50,
    flex: 0.8,
    renderCell: (params) => (
      <div className="text-[#333333] flex items-center h-full">
        ₱{formatNumberWithCommas(parseFloat(params.value))}
      </div>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    sortable: false,
    renderCell: (params) => (
      <ActionButtons
        product={params.row}
        onAdd={handlers.onAdd}
        onSubtract={handlers.onSubtract}
        onTransfer={handlers.onTransfer}
        onDelete={handlers.onDelete}
      />
    ),
  },
];