import React, { useState } from 'react';
import { X } from 'lucide-react';

interface YearRangeModalProps {
  yearRange: { from: number; to: number };
  onSave: (range: { from: number; to: number }) => void;
  onClose: () => void;
}

export default function YearRangeModal({ yearRange, onSave, onClose }: YearRangeModalProps) {
  const [from, setFrom] = useState(yearRange.from);
  const [to, setTo] = useState(yearRange.to);
  const currentYear = new Date().getFullYear();

  const handleSave = () => {
    onSave({ from, to });
    console.log("rango de año: " , from , to);
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Seleccionar Rango de Años</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde el Año</label>
            <select
              value={from}
              onChange={(e) => setFrom(Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta el Año</label>
            <select
              value={to}
              onChange={(e) => setTo(Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Array.from({ length: currentYear - from + 1 }, (_, i) => currentYear - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
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