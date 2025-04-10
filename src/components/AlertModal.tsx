import React, { useState } from 'react';
import { X, Bell } from 'lucide-react';

interface AlertModalProps {
  searchParams: {
    brand: string;
    model: string;
    yearRange: { from: number; to: number };
    priceRange: { from: number; to: number };
  };
  onClose: () => void;
}

export default function AlertModal({ searchParams, onClose }: AlertModalProps) {
  const [alertName, setAlertName] = useState('');
  const [searchTime, setSearchTime] = useState('12:00');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('nombreAlerta', alertName);
      formData.append('horaBusqueda', searchTime);
      formData.append('activa', isActive.toString());
      formData.append('marca', searchParams.brand);
      formData.append('modelo', searchParams.model);
      formData.append('yearDesde', searchParams.yearRange.from.toString());
      formData.append('yearHasta', searchParams.yearRange.to.toString());
      formData.append('precioDesde', searchParams.priceRange.from.toString());
      formData.append('precioHasta', searchParams.priceRange.to.toString());
      formData.append('fechaInicio', new Date().toISOString());

      const response = await fetch('https://72jdmlb6-3000.brs.devtunnels.ms/alerts/schedule-alert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, the server didn't return JSON!");
      }

      const data = await response.json();
      console.log('Alerta creada:', data);
      onClose();
    } catch (error) {
      console.error('Error al crear la alerta:', error);
      setError('No se pudo crear la alerta. Por favor, intente más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold">Crear Alerta</h3>
          </div>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Alerta
            </label>
            <input
              type="text"
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
              placeholder="ej., Alerta Auto Soñado"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de Búsqueda
            </label>
            <input
              type="time"
              value={searchTime}
              onChange={(e) => setSearchTime(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Estado de la Alerta</label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              disabled={isSubmitting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div> */}

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-gray-900">Criterios de Búsqueda</h4>
            <p className="text-sm text-gray-600">
              Marca: {searchParams.brand || 'Cualquiera'}
            </p>
            <p className="text-sm text-gray-600">
              Modelo: {searchParams.model || 'Cualquiera'}
            </p>
            <p className="text-sm text-gray-600">
              Año: {searchParams.yearRange.from} - {searchParams.yearRange.to}
            </p>
            <p className="text-sm text-gray-600">
              Precio: ${searchParams.priceRange.from.toLocaleString()} - ${searchParams.priceRange.to.toLocaleString()}
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              {isSubmitting ? 'Creando...' : 'Crear Alerta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}