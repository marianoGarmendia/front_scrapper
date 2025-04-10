import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  listingUrl: string;
  isContacted: boolean;
  isFavorite: boolean;
}

interface CarAlert {
  id: string;
  name: string;
  brand: string;
  model: string;
  yearRange: { from: number; to: number };
  priceRange: { from: number; to: number };
  searchTime: string;
  price: number;
  imgSrc: string;
  link: string;
  year: number;
  nuevo: boolean;
  km: number;
  description: string;
  isContacted: boolean;
  isFavorite: boolean;
}

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carAlert, setCarAlert] = useState<CarAlert[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isContacted, setIsContacted] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [deleteVehicle, setDeleteVehicle] = useState<boolean>(false);
  
  console.log(id);

  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {
        const response = await fetch(
          `https://72jdmlb6-3000.brs.devtunnels.ms/alerts/get-alerts-cars/${id}`
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

        setCarAlert(data.cars.cars);
      } catch (error) {
        console.error("Error al obtener los detalles de la alerta:", error);
        setError(
          "No se pudieron cargar los detalles de la alerta. Por favor, intente más tarde."
        );
      }
    };

    if (id) {
      fetchAlertDetails();
    }
  }, [id]);

  useEffect(() => {
    console.log("carAlert", carAlert);
  }, [carAlert]);

  // const handleToggleContacted = async (vehicleId: string) => {
  //   try {
  //     const vehicle = carAlert?.find(v => v.id === vehicleId);
  //     if (!vehicle) return;

  //     const response = await fetch(`https://72jdmlb6-3000.brs.devtunnels.ms/management/vehicles/update/${vehicleId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         isContacted: !vehicle.isContacted,
  //         isFavorite: vehicle.isFavorite,
  //       }),
  //     });

  //     if (!response.ok) throw new Error('Error al actualizar el estado del vehículo');

  //     setCarAlert(prev =>
  //       prev.map(v =>
  //         v.id === vehicleId
  //           ? { ...v, isContacted: !v.isContacted }
  //           : v
  //       )
  //     );
  //     setIsContacted(!isContacted);
  //   } catch (error) {
  //     console.error('Error al actualizar el estado de contacto:', error);
  //   }
  // };

  // const handleToggleFavorite = async (vehicleId: string) => {
  //   try {
  //     const vehicle = vehicles.find(v => v.id === vehicleId);
  //     if (!vehicle) return;

  //     const response = await fetch(`https://72jdmlb6-3000.brs.devtunnels.ms/management/vehicles/update/${vehicleId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         isFavorite: !vehicle.isFavorite,
  //         isContacted: vehicle.isContacted,
  //       }),
  //     });

  //     if (!response.ok) throw new Error('Error al actualizar el estado del vehículo');

  //     setVehicles(prev =>
  //       prev.map(v =>
  //         v.id === vehicleId
  //           ? { ...v, isFavorite: !v.isFavorite }
  //           : v
  //       )
  //     );
  //       setIsFavorite(!isFavorite);
  //   } catch (error) {
  //     console.error('Error al actualizar el estado de favorito:', error);
  //   }
  // };

  // const handleDelete = async (vehicleId: string) => {
  //   try {
  //     const response = await fetch(`https://72jdmlb6-3000.brs.devtunnels.ms/management/vehicles/delete/${vehicleId}`, {
  //       method: 'DELETE',
  //     });

  //     if (!response.ok) throw new Error('Error al eliminar el vehículo');

  //     setVehicles(prev => prev.filter(v => v.id !== vehicleId));
  //     setDeleteVehicle(true);
  //   } catch (error) {
  //     console.error('Error al eliminar el vehículo:', error);
  //   }
  // };

  const managementData = carAlert?.reduce((acc, vehicle) => ({
    ...acc,
    [vehicle.id]: {
      isContacted: vehicle.isContacted,
      isFavorite: vehicle.isFavorite,
    },
  }), {});


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

  if (!carAlert) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-center text-gray-500">Cargando...</p>
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
            onClick={() => navigate("/alerts")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Mis Alertas
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{alert.name}</h1>
        </div>

        {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {carAlert.length > 0 &&
              carAlert.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {alert.description}{" "}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Precio: ${alert.price.toLocaleString()}
                  </p>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      alert.nuevo
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {alert.nuevo && "Nueva Publicación"}
                  </div>
                </div>
              ))}
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carAlert.length > 0 &&
            carAlert.map((vehicle) => (
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
                <img
                  src={vehicle.imgSrc}
                  alt={`${vehicle.id} `}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <p className="text-gray-600 mt-1">{vehicle.description}</p>
                  
                  <p className="text-xl font-bold text-blue-600 mt-2">
                    {vehicle.price.toLocaleString()}
                  </p>
                  <a
                    href={`https://www.chileautos.cl${vehicle.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ver Publicación
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
