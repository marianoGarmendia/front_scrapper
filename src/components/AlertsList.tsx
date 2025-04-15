import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';

const URL_PROD = import.meta.env.URL_PROD; 
console.log("URL_PROD", URL_PROD);



interface Alert {
  id: string;
  nombreAlerta: string;
  modelo: string;
 hora:string,
  marca: string;
  yearRange: { from: number; to: number };
  priceRange: { from: number; to: number };
  searchTime: string;
  active: boolean;
}

interface AlertsListProps {
  onAlertSelect: (alert: Alert) => void;
}

export default function AlertsList({ onAlertSelect }: AlertsListProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch( URL_PROD + '/alerts/get-alerts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, the server didn't return JSON!");
        }
        const data = await response.json();
        setAlerts(data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener las alertas:', error);
        setError('No se pudieron cargar las alertas. Por favor, intente más tarde.');
        setAlerts([]);
      }
    };

    fetchAlerts();
  }, []);

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  if (!alerts.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-center text-gray-500">No hay alertas configuradas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Mis Alertas</h3>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <button
            key={alert.id}
            onClick={() => onAlertSelect(alert)}
            className="w-full text-left p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {alert.active ? (
                  <Bell className="w-5 h-5 text-blue-600" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">nombre: {alert.nombreAlerta}</h4>
                  <p className="text-sm text-gray-500">hora: {alert.hora}</p>
                  <p className="text-sm text-gray-500">año: {alert.yearRange.from - alert.yearRange.to}</p>
                  <p className="text-sm text-gray-500">precio: {alert.priceRange.from - alert.priceRange.to}</p>
                  <p className="text-sm text-gray-500">marca: {alert.marca}</p>
                  <p className="text-sm text-gray-500">modelo: {alert.modelo}</p>

                </div>
              </div>
              <div className={`h-2 w-2 rounded-full ${alert.active ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}