import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Trash2, ChevronLeft, ChevronRight} from 'lucide-react';
import {useCarsContext } from '../context/CarsContext';


interface DeleteModalProps {
  vehicleName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

interface Vehicle {
    id: string;
    brand: string;
    model: string;
    description: string;
    year: number;
    price: number;
    imgSrc: string;
    listingUrl: string;
    isContacted: boolean;
    isFavorite: boolean;
    comment?: string;
      contactCel: string;
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

  const URL_PROD = import.meta.env.VITE_URL_PROD; 


export default function VehicleListPage() {
  const { id, brand } = useParams<{ id: string , brand:string}>();
  const navigate = useNavigate();
  const { setFilterVehicles } = useCarsContext();
  const [alerts, setAlerts] = useState<Alert[]>([]);
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchAlertDetails = async () => {
        console.log("fetchAlertDetails", id);
        
      try {
        const response = await fetch(
          URL_PROD + `/alerts/get-alerts-cars/${id}`
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

        setVehicles(data.cars.cars);
        setLoading(false);
        setTotalPages(Math.ceil(data.cars.cars.length / itemsPerPage))
        // setVehicles((prev) => [...prev, {alertId:id , vehicles: data.cars.cars}]);
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

  const tieneCamposCompletos = (vehicle:Vehicle) => {
    return vehicle.isContacted || vehicle.isFavorite || (vehicle.comment && vehicle.comment.trim() !== '');
  };

  const vehiculosFiltrados = vehicles.filter(tieneCamposCompletos);

 useEffect(() => {
  if(vehiculosFiltrados.length === 0) return
  setTotalPages(Math.ceil(vehiculosFiltrados.length / itemsPerPage))
 },[vehiculosFiltrados])

  const handleDeleteClick = (vehicle: Vehicle) => {
    console.log("handleDeleteClick", vehicle);
    
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setVehicleToDelete(null);
  };

  // Verificar esta funcion todo 09-04 23:31
  const handleDeleteConfirm = async () => {
    if(!vehicleToDelete) return;
    try {
      const response = await fetch(URL_PROD + `/management/vehicles/delete/${vehicleToDelete.id}?alertId=${id}`, {
        method: 'DELETE',
        
      });

      if (!response.ok){
        toast.error("Error al eliminar el vehículo");
       throw new Error('Error al eliminar el vehículo');
      }
      toast.success("Vehículo eliminado con éxito");
      setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
      setShowDeleteModal(false);
      setVehicleToDelete(null);
      // setDeleteVehicle(true);
    } catch (error) {
      toast.error("Error al eliminar el vehículo");

      console.error('Error al eliminar el vehículo:', error);
    }
  };

    // Get current page items
    const getCurrentPageItems = () => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return vehiculosFiltrados.slice(startIndex, endIndex);
    };
    // Generate page numbers
    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
  
      return pageNumbers;
    };
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onClick={() => navigate('/vehicles')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Mis Vehículos
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Vehículos {brand}</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripcion
                  </th>
                  
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observaciones
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enlace
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Eliminar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No hay vehículos registrados para esta marca
                    </td>
                  </tr>
                ) : (
                  getCurrentPageItems().map((vehicle:Vehicle) => (
                    
                    <tr key={vehicle.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={`${vehicle.imgSrc}`} alt="" className='w-18 h-16'/>
                        <div className="text-sm font-medium text-gray-900">{vehicle.description}</div>
                      </td>
                     
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${vehicle.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{vehicle.contactCel ?? "-"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vehicle.isContacted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {vehicle.isContacted ? 'Contactado' : 'Sin Contactar'}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vehicle.isFavorite ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {vehicle.isFavorite ? 'Favorito' : 'No Favorito'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">
                          {vehicle.comment || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={vehicle.listingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver Publicación
                        </a>
                      </td>
                      <td>
                      <button
                      onClick={() => handleDeleteClick(vehicle)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Eliminar Vehiculo"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                      </td>
                    
                    </tr>
                    
                  ))
                )}
                  {showDeleteModal && vehicleToDelete && (
                        <DeleteConfirmationModal
                          vehicleName={vehicleToDelete.description}
                          onConfirm={handleDeleteConfirm}
                          onCancel={handleDeleteCancel}
                        />
                      )}
              </tbody>
            </table>
             {/* Pagination */}
           {!loading && vehiculosFiltrados.length > itemsPerPage && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-center sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {/* First page */}
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <span className="sr-only">Primera página</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {/* Previous page */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <span className="sr-only">Página anterior</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {/* Page numbers */}
                    {getPageNumbers().map((number) => (
                      <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number}
                      </button>
                    ))}

                    {/* Next page */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <span className="sr-only">Página siguiente</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    {/* Last page */}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <span className="sr-only">Última página</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}


function DeleteConfirmationModal({ vehicleName, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Confirmar Eliminación</h3>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          ¿Estás seguro que deseas eliminar este vehiculo <strong>{vehicleName}</strong>? Esta acción no se puede deshacer.
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