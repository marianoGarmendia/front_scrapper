import { ExternalLink, Check, Save } from "lucide-react";
import { useState } from "react";
import ContactEditor from "./ContactEditor";
// import { useEffect } from 'react';

interface VehicleList {
  id: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  imgSrc: string;
  link: string;
  comment?: string;
  contactCel: string;
  nuevo?: boolean;
  isContacted: boolean;
  isFavorite: boolean;
}

interface VehicleListProps {
  vehicles: VehicleList[];
  selectedVehicles?: string[];
  onVehicleSelect?: (id: string) => void;
  showManagementButtons?: boolean;
  onToggleContacted?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onDeleted?: (id: string) => void;
  onComments?: (vehicleId: string, comments: string) => void;

  onCommentChange?: (e: any) => void;
  onContactCel?: (id: string, contactCel: string) => Promise<void>;
  comments?: string;
  managementData?: {
    [key: string]: {
      isContacted: boolean;
      isFavorite: boolean;
      isContactCel: string;
      comments: string;
    };
  };
}

export default function VehicleList({
  vehicles,
  selectedVehicles = [],
  onVehicleSelect,
  showManagementButtons = true,
  onToggleContacted,
  onToggleFavorite,
  onDeleted,
  onCommentChange,
  onContactCel,
  onComments,
  comments,
  managementData = {},
}: VehicleListProps) {
  if (!vehicles.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
        No se encontraron vehículos con los criterios seleccionados
      </div>
    );
  }
 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              vehicle.nuevo
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {vehicle.nuevo && "Nueva Publicación"}
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={vehicle.imgSrc}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h3>
            <div className="mt-2 space-y-2">
              <p className="text-lg font-bold text-blue-600">
                {vehicle.description}
              </p>
              <p className="text-gray-600">Año: {vehicle.year}</p>
              <p className="text-lg font-bold text-blue-600">
                {vehicle.price.toLocaleString()}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <a
                href={`https://www.chileautos.cl${vehicle.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ver Publicación
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* {onVehicleSelect && (
                <button
                  onClick={() => onVehicleSelect(vehicle.id)}
                  className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg transition-colors ${
                    selectedVehicles.includes(vehicle.id)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {selectedVehicles.includes(vehicle.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      Seleccionado
                    </>
                  ) : (
                    "Seleccionar"
                  )}
                </button>
              )} */}

              {showManagementButtons && managementData[vehicle.id] && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contactado</span>
                    <button
                      onClick={() => onToggleContacted?.(vehicle.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        managementData[vehicle.id].isContacted
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          managementData[vehicle.id].isContacted
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Favorito</span>
                    <button
                      onClick={() => onToggleFavorite?.(vehicle.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        managementData[vehicle.id].isFavorite
                          ? "bg-yellow-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          managementData[vehicle.id].isFavorite
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <ObservationSection
                        vehicle={vehicle}
                        onComments={onComments}
                      />
                      {/* Otros detalles del vehículo */}
                      {/* <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                          Observación:
                        </h2>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Añadir una observación..."
                          value={managementData[vehicle.id]?.comments || ""}
                          onChange={onCommentChange}
                        />
                        <button
                          onClick={() =>
                            onComments?.(
                              vehicle.id,
                              managementData[vehicle.id]?.comments || ""
                            )
                          }
                          className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Save className="w-5 h-5" />
                          Guardar Observación
                        </button>
                      </div> */}
                    </div>
                  </div>
                  <ContactEditor
                    initialContactCel={vehicle.contactCel}
                    handleContactCel={(
                      vehicleId: string,
                      newContactCel: string
                    ) => onContactCel?.(vehicleId, newContactCel)}
                    vehicleId={vehicle.id}
                  />

                  <button
                    onClick={() => onDeleted?.(vehicle.id)}
                    className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ObservationSection({ vehicle, onComments }:{vehicle: VehicleList, onComments?: (vehicleId: string, comments: string) => void}) {
  // Estado local para el comentario actual
  const [currentComment, setCurrentComment] = useState(vehicle.comment || '');

  // Maneja el cambio en el textarea
  const handleCommentChange = (event:any) => {
    setCurrentComment(event.target.value);
  };

  // Envía el comentario actualizado
  const handleSaveComment = () => {
    onComments?.(vehicle.id, currentComment);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Observación:</h2>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Añadir una observación..."
        value={currentComment}
        onChange={handleCommentChange}
      />
      <button
        onClick={handleSaveComment}
        className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Save className="w-5 h-5" />
        Guardar Observación
      </button>
    </div>
  );
}

