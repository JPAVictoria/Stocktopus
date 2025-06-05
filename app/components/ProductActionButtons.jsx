import { Plus, Minus, MoveRight, Trash2 } from "lucide-react";

const ActionButton = ({ onClick, icon: Icon, label, color, bgColor }) => {
  const iconWrapperStyle = {
    background: `radial-gradient(circle, ${bgColor} 0%, transparent 80%)`,
    borderRadius: "50%",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    userSelect: "none",
  };

  return (
    <div 
      className={`flex flex-col items-center cursor-pointer ${color}`}
      onClick={onClick}
    >
      <div style={iconWrapperStyle}>
        <Icon size={22} />
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );
};

const ActionButtons = ({ product, onAdd, onSubtract, onTransfer, onDelete }) => {
  const actions = [
    {
      onClick: () => onAdd(product),
      icon: Plus,
      label: "Add",
      color: "text-green-600",
      bgColor: "rgba(34,197,94,0.15)"
    },
    {
      onClick: () => onSubtract(product),
      icon: Minus,
      label: "Subtract",
      color: "text-red-600",
      bgColor: "rgba(220,38,38,0.15)"
    },
    {
      onClick: () => onTransfer(product),
      icon: MoveRight,
      label: "Transfer",
      color: "text-cyan-600",
      bgColor: "rgba(6,182,212,0.15)"
    },
    {
      onClick: () => onDelete(product),
      icon: Trash2,
      label: "Delete",
      color: "text-red-600 hover:text-red-700 transition-colors",
      bgColor: "rgba(239,68,68,0.15)"
    }
  ];

  return (
    <div className="flex items-center gap-8">
      {actions.map((action, index) => (
        <ActionButton key={index} {...action} />
      ))}
    </div>
  );
};

export default ActionButtons;