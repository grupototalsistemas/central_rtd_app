import React from 'react';

interface ChartTabProps {
  value: 'semana' | 'mes' | 'ano';
  onChange: (value: 'semana' | 'mes' | 'ano') => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ value, onChange }) => {
  const getButtonClass = (option: 'semana' | 'mes' | 'ano') =>
    value === option
      ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
      : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => onChange('semana')}
        className={`text-theme-sm w-full rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          'semana'
        )}`}
      >
        Semana
      </button>

      <button
        onClick={() => onChange('mes')}
        className={`text-theme-sm w-full rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          'mes'
        )}`}
      >
        Mês
      </button>

      <button
        onClick={() => onChange('ano')}
        className={`text-theme-sm w-full rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          'ano'
        )}`}
      >
        Ano
      </button>
    </div>
  );
};

export default ChartTab;
