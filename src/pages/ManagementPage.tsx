import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VehicleList from '../components/VehicleList';

const URL_PROD = import.meta.env.VITE_URL_PROD; 


interface Vehicle {
  id: string;
  brand: string;
  description: string;
  model: string;
  year: number;
  price: number;
  imgSrc: string;
  link: string;
 
  isFavorite: boolean;
  comment?: string;
  contactCel: string;
  nuevo?: boolean;
  isContacted: boolean;
}



interface ManagedVehicle extends Vehicle {
  isContacted: boolean;
  isFavorite: boolean;
}

export default function ManagementPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
    const [isContacted, setIsContacted] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [deleteVehicle, setDeleteVehicle] = useState<boolean>(false);

  useEffect(() => {
    const fetchManagedVehicles = async () => {
      try {
        const response = await fetch(URL_PROD + '/management/vehicles/get');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data fetchManagedVehicles", data);
        
        setVehicles(data.cars);
        setDeleteVehicle(false);
      } catch (error) {
        console.error('Error al obtener los vehículos gestionados:', error);
        setError('No se pudieron cargar los vehículos. Por favor, intente más tarde.');
      }
    };

    fetchManagedVehicles();
  }, [isContacted, isFavorite, deleteVehicle]);

  const handleToggleContacted = async (vehicleId: string) => {
    try {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (!vehicle) return;

      const response = await fetch(URL_PROD + `/management/vehicles/update/${vehicleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isContacted: !vehicle.isContacted,
          isFavorite: vehicle.isFavorite,
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar el estado del vehículo');

      setVehicles(prev =>
        prev.map(v =>
          v.id === vehicleId
            ? { ...v, isContacted: !v.isContacted }
            : v
        )
      );
      setIsContacted(!isContacted);
    } catch (error) {
      console.error('Error al actualizar el estado de contacto:', error);
    }
  };

  const handleToggleFavorite = async (vehicleId: string) => {
    try {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (!vehicle) return;

      const response = await fetch(URL_PROD +`/management/vehicles/update/${vehicleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFavorite: !vehicle.isFavorite,
          isContacted: vehicle.isContacted,
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar el estado del vehículo');

      setVehicles(prev =>
        prev.map(v =>
          v.id === vehicleId
            ? { ...v, isFavorite: !v.isFavorite }
            : v
        )
      );
        setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error al actualizar el estado de favorito:', error);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    try {
      const response = await fetch(URL_PROD +`/management/vehicles/delete/${vehicleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el vehículo');

      setVehicles(prev => prev.filter(v => v.id !== vehicleId));
      setDeleteVehicle(true);
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
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

  const managementData = vehicles.reduce((acc, vehicle) => ({
    ...acc,
    [vehicle.id]: {
      isContacted: vehicle.isContacted,
      isFavorite: vehicle.isFavorite,
    },
  }), {});

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Buscador
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Mi Gestión</h1>
        </div>

        <VehicleList
          vehicles={vehicles}
          showManagementButtons={true}
          onToggleContacted={handleToggleContacted}
          onToggleFavorite={handleToggleFavorite}
          onDeleted={handleDelete}
          managementData={managementData}
        />
      </div>
    </div>
  );
}