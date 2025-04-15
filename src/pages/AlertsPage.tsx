import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BellOff,
  ChevronRight,
  ArrowLeft,
  Trash2,
  X,
} from "lucide-react";


type AlertDelete = {
  message: string;
  alert_name: string;
};

interface DeleteModalProps {
  alertName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

interface Alert {
  id: string;
  nombreAlerta: string;
  modelo: string;
  minutos: string;
  hora: string;
  marca: string;
  yearDesde: string;
  yearHasta: string;
  precioDesde: string;
  precioHasta: string;
  yearRange: { from: number; to: number };
  priceRange: { from: number; to: number };
  searchTime: string;
  activa: boolean;
  vehicles: Array<{
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    imageUrl: string;
    listingUrl: string;
  }>;
}

const URL_PROD = import.meta.env.VITE_API_URL;

function DeleteConfirmationModal({
  alertName,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Confirmar Eliminación
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          ¿Estás seguro que deseas eliminar la alerta "{alertName}"? Esta acción
          no se puede deshacer.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [thereCars, setThereCars] = useState(true);

  const [newCars, setNewCars] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);

  const [error, setError] = useState<string | null>(null);
  // Me traigo los autos nuevos

  const fetchAlertDetails = async (id: string) => {
    try {
      const response = await fetch(
        URL_PROD + `/alerts/get-alerts-cars/${id}?alertPage=${true}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, the server didn't return JSON!");
      }
      const data = await response.json();
      console.log("data fetchAlertDetails");

      console.log(data.cars);
      if(!data.cars || data.cars.cars.length === 0){
        setThereCars(false);
        return;
      }else{
        const cars = data.cars.cars;
        const onlyNewCars = cars.filter((car: any) => car.nuevo === true);
        setThereCars(true)
        setNewCars(onlyNewCars);

      }
    } catch (error) {
      console.error("Error al obtener los detalles de la alerta:", error);
      setError(
        "No se pudieron cargar los detalles de la alerta. Por favor, intente más tarde."
      );
    }
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${URL_PROD}/alerts/get-alerts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, the server didn't return JSON!");
        }
        const data = await response.json();
        console.log("data fetchAlerts", data);

        setAlerts(data.alerts);
        if (data.alerts.length > 0) {
          // setSelectedAlert(data.alerts);
        }
      } catch (error) {
        console.error("Error al obtener las alertas:", error);
        setError(
          "No se pudieron cargar las alertas. Por favor, intente más tarde."
        );
      }
    };

    fetchAlerts();
  }, []);

  useEffect(() => {
    console.log("selectedAlert", selectedAlert);
    if (!selectedAlert) return;
    console.log("selectedAlert.id", selectedAlert.id);
    
    fetchAlertDetails(selectedAlert?.id);
  }, [selectedAlert]);

  const handleDeleteClick = (alert: Alert) => {
    console.log("handleDeleteClick", alert);

    setAlertToDelete(alert);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAlertToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!alertToDelete) return;
    try {
      const response = await fetch(
        `${URL_PROD}/alerts/delete-alert/${alertToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error al eliminar alerta`);
      }
      // const alert_delete = await response.json();
      // const { alert_name } = alert_delete;

      setAlerts((prev) =>
        prev.filter((alert) => alert.id !== alertToDelete.id)
      );
      if (selectedAlert?.id === alertToDelete.id) {
        setSelectedAlert(
          alerts.find((alert) => alert.id !== alertToDelete.id) || null
        );
      }
      setShowDeleteModal(false);
      setAlertToDelete(null);
      // console.log(alert_name);
    } catch (error) {
      console.error("Error al eliminar la alerta:", error);
      setError("No se pudo eliminar la alerta. Por favor, intente más tarde.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-center text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Buscador
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Mis Alertas</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Alertas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    selectedAlert?.id === alert.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {alert.activa ? (
                        <Bell className="w-5 h-5 text-blue-600" />
                      ) : (
                        <BellOff className="w-5 h-5 text-gray-400" />
                      )}
                      <button
                      onClick={() => handleDeleteClick(alert)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Eliminar Alerta"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {alert.nombreAlerta}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Alerta se ejecuta a la hora: {alert.hora}:
                          {alert.minutos}
                        </p>
                        <p className="text-sm text-gray-500">
                          modelo: {alert.modelo}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rango de precio: {alert.precioDesde} a{" "}
                          {alert.precioHasta}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detalles de la Alerta y Vehículos */}
          <div className="lg:col-span-2">
            {selectedAlert && thereCars ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedAlert.nombreAlerta}
                    </h2>
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedAlert.activa
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedAlert.activa ? "Activa" : "Inactiva"}
                    </div>
                    <button
                      onClick={() => handleDeleteClick(selectedAlert)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Eliminar Alerta"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Marca</p>
                      <p className="font-medium">
                        {selectedAlert.marca || "Cualquiera"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Modelo</p>
                      <p className="font-medium">
                        {selectedAlert.modelo || "Cualquiera"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rango de Años</p>
                      <p className="font-medium">
                        {selectedAlert.yearDesde} - {selectedAlert.yearHasta}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rango de Precios</p>
                      <p className="font-medium">
                        ${selectedAlert.precioDesde} - $
                        {selectedAlert.precioHasta}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => navigate(`/alerts/${selectedAlert.id}`)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      Ver todos los vehículos
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Últimos Vehículos Encontrados
                  </h3>

                  {newCars.length > 0 && (
                    <>
                      <div className="text-sm text-gray-600  mb-4">
                        Se encontraron {newCars.length} vehículos nuevos.
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {newCars.map((vehicle) => (
                          <div
                            key={vehicle.id}
                            className="border rounded-lg overflow-hidden"
                          >
                            <img
                              src={vehicle.imgSrc}
                              alt={`${vehicle.brand} ${vehicle.model}`}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                              <h4 className="font-medium">
                                {vehicle.brand} {vehicle.model}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Año: {vehicle.year}
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                ${vehicle.price.toLocaleString()}
                              </p>
                              <a
                                href={vehicle.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block text-center text-sm text-blue-600 hover:text-blue-800"
                              >
                                Ver Publicación
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {newCars.length === 0 && (
                    <div className="text-sm text-gray-600 mb-4">
                      No se encontraron vehículos nuevos.
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAlert.vehicles &&
                      selectedAlert.vehicles.slice(0, 4).map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <img
                            src={vehicle.imageUrl}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="font-medium">
                              {vehicle.brand} {vehicle.model}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Año: {vehicle.year}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              ${vehicle.price.toLocaleString()}
                            </p>
                            <a
                              href={vehicle.listingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 block text-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              Ver Publicación
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
                Selecciona una alerta para ver sus detalles
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteModal && alertToDelete && (
        <DeleteConfirmationModal
          alertName={alertToDelete.nombreAlerta}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}
