import ProductImage from '@/app/components/ProductImage';
import ActionButtons from '@/app/components/ProductActionButtons';
import { formatNumberWithCommas } from '@/app/utils/helpers';
import { Chip } from '@mui/material';

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
      
      const locationData = params.row.originalData?.locations || [];
      
      if (locationData.length === 0) {
        return (
          <div className="text-[#333333] flex items-center justify-center h-full">
            <span className="text-gray-500 text-sm">No location</span>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center gap-1 py-3">
          {locationData.map((locationInfo, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm">{locationInfo.location.name}</span>
              <Chip
                label={locationInfo.quantity}
                size="small"
                sx={{
                  backgroundColor: "rgba(34,197,94,0.2)",
                  color: "rgb(34, 197, 94)",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  height: "20px",
                }}
              />
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