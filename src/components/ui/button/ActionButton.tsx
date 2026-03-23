import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  texto?: string;
  icon?: React.ReactNode;
  disable?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  texto,
  icon,
  disable,
}) => {
  return (
    <div className="flex">
      <button
        disabled={disable}
        type="button"
        onClick={onClick}
        className="menu-item-active flex h-fit w-fit items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:text-base"
      >
        {icon ? icon : texto}
      </button>
    </div>
  );
};
export default ActionButton;
