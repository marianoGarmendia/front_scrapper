import React, { useState } from 'react';
import { X } from 'lucide-react';


interface PriceRangeModalProps {
  priceRange: { from: number; to: number };
  onSave: (range: { from: number; to: number }) => void;
  onClose: () => void;
}

export default function PriceRangeModal({  onSave, onClose }: PriceRangeModalProps) {
  const generatePriceOptions = () => {
    const options = [];
    for (let price = 500000; price <= 20500000; price += 500000) {
      options.push(price);
    }
    return options;
  };
  
  
    const [minPrice, setMinPrice] = useState<number | 0>(0);
    const [maxPrice, setMaxPrice] = useState<number | 0>(0);
  
    const priceOptions = generatePriceOptions();
  
    const formatPrice = (value: number) =>
      `$${value.toLocaleString('es-CL')}`;
  
    const handleMinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMinPrice(Number(e.target.value));
    };
  
    const handleMaxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMaxPrice(Number(e.target.value));
    };

  const handleSave = () => {
    onSave({ from:minPrice, to:maxPrice });
    console.log("rango de precio: " , minPrice , maxPrice);
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Seleccionar Rango de Precios</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Desde ($)</label>
            <input
              type="number"
              value={from}
              onChange={(e) => setFrom(Number(e.target.value))}
              min="500000"
              step="1000"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Hasta ($)</label>
            <input
              type="number"
              value={to}
              onChange={(e) => setTo(Number(e.target.value))}
              min={from}
              step="1000"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div> */}

<div className="flex gap-4">
      <div>
        <label>Precio mínimo:</label>
        <select value={minPrice ?? ''} onChange={handleMinChange}>
          <option value="">Seleccionar</option>
          {priceOptions.map((price) => (
            <option key={price} value={price}>
              {formatPrice(price)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Precio máximo:</label>
        <select value={maxPrice ?? ''} onChange={handleMaxChange}>
          <option value="">Seleccionar</option>
          {priceOptions.map((price) => (
            <option key={price} value={price}>
              {formatPrice(price)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p>Precio seleccionado:</p>
        <p>Min: {minPrice ?? '-'}</p>
        <p>Max: {maxPrice ?? '-'}</p>
      </div>
    </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}