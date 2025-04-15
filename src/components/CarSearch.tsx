import React, { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  DollarSign,
  Bell,
  ListFilter,
  ClipboardList,
  Car,
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

import { useNavigate } from "react-router-dom";
import YearRangeModal from "./YearRangeModal";
import PriceRangeModal from "./PriceRangeModal";

import AlertModal from "./AlertModal";
import VehicleList from "./VehicleList";
import LogoutButton from './LogoutButton';
import * as models from "../utils/models.ts";

const URL_PROD = import.meta.env.VITE_URL_PROD; 

export const carBrands = [
  { id: 1, name: "Chevrolet" },
  { id: 2, name: "Ford" },
  { id: 3, name: "Hyundai" },
  { id: 4, name: "Kia" },
  { id: 5, name: "Mazda" },
  { id: 6, name: "Nissan" },
  { id: 7, name: "Peugeot" },
  { id: 8, name: "Suzuki" },
  { id: 9, name: "Toyota" },
  { id: 10, name: "Volkswagen" },
  { id: 11, name: "Abarth" },
  { id: 12, name: "Acadian" },
  { id: 13, name: "Acura" },
  { id: 14, name: "Alfa Romeo" },
  { id: 15, name: "Aston Martin" },
  { id: 16, name: "Audi" },
  { id: 17, name: "Austin" },
  { id: 18, name: "Autorrad" },
  { id: 19, name: "Aveling-Barford" },
  { id: 20, name: "Baic" },
  { id: 21, name: "Bentley" },
  { id: 22, name: "BMW" },
  { id: 23, name: "Borgward" },
  { id: 24, name: "Brilliance" },
  { id: 25, name: "Buick" },
  { id: 26, name: "Byd" },
  { id: 27, name: "Cadillac" },
  { id: 28, name: "Can-Am" },
  { id: 29, name: "Changan" },
  { id: 30, name: "Changhe" },
  { id: 31, name: "Chery" },
  { id: 32, name: "Chrysler" },
  { id: 33, name: "Citroën" },
  { id: 34, name: "Cupra" },
  { id: 35, name: "Daewoo" },
  { id: 36, name: "Daihatsu" },
  { id: 37, name: "Datsun" },
  { id: 38, name: "Dfm" },
  { id: 39, name: "Dfsk" },
  { id: 40, name: "Dodge" },
  { id: 41, name: "Dongfeng" },
  { id: 42, name: "Ds" },
  { id: 43, name: "Exeed" },
  { id: 44, name: "Faw" },
  { id: 45, name: "Ferrari" },
  { id: 46, name: "Fiat" },
  { id: 47, name: "Foton" },
  { id: 48, name: "Gac" },
  { id: 49, name: "Gac Gonow" },
  { id: 50, name: "Gac Motor" },
  { id: 51, name: "Geely" },
  { id: 52, name: "Gmc" },
  { id: 53, name: "Great Wall" },
  { id: 54, name: "Hafei" },
  { id: 55, name: "Haima" },
  { id: 56, name: "Haval" },
  { id: 57, name: "Honda" },
  { id: 58, name: "Huanghai - Sg" },
  { id: 59, name: "Hudson" },
  { id: 60, name: "Hummer" },
  { id: 61, name: "INFINITI" },
  { id: 62, name: "International" },
  { id: 63, name: "Isuzu" },
  { id: 64, name: "Iveco" },
  { id: 65, name: "Jac" },
  { id: 66, name: "Jaecoo" },
  { id: 67, name: "Jaguar" },
  { id: 68, name: "Jeep" },
  { id: 69, name: "Jetour" },
  { id: 70, name: "Jim" },
  { id: 71, name: "Jinbei" },
  { id: 72, name: "Jmc" },
  { id: 73, name: "Kaiyi" },
  { id: 74, name: "Karry" },
  { id: 75, name: "Kawasaki" },
  { id: 76, name: "Kenbo" },
  { id: 77, name: "Kyc" },
  { id: 78, name: "Lada" },
  { id: 79, name: "Lamborghini" },
  { id: 80, name: "Lancia" },
  { id: 81, name: "Land Rover" },
  { id: 82, name: "Landking" },
  { id: 83, name: "Leapmotor" },
  { id: 84, name: "Lexus" },
  { id: 85, name: "Lifan" },
  { id: 86, name: "Lincoln" },
  { id: 87, name: "Livan" },
  { id: 88, name: "Lotus" },
  { id: 89, name: "Mahindra" },
  { id: 90, name: "Maple" },
  { id: 91, name: "Maserati" },
  { id: 92, name: "Maxus" },
  { id: 93, name: "Mclaren" },
  { id: 94, name: "Mercedes-Benz" },
  { id: 95, name: "Mercury" },
  { id: 96, name: "MG" },
  { id: 97, name: "MINI" },
  { id: 98, name: "Mitsubishi" },
  { id: 99, name: "Mitsubishi-Fuso" },
  { id: 100, name: "Morgan" },
  { id: 101, name: "Oldsmobile" },
  { id: 102, name: "Omoda" },
  { id: 103, name: "Opel" },
  { id: 104, name: "Otra Marca" },
  { id: 105, name: "Packard" },
  { id: 106, name: "Piaggio" },
  { id: 107, name: "Plymouth" },
  { id: 108, name: "Polaris" },
  { id: 109, name: "Pontiac" },
  { id: 110, name: "Porsche" },
  { id: 111, name: "Proton" },
  { id: 112, name: "Ram" },
  { id: 113, name: "Range Rover" },
  { id: 114, name: "Renault" },
  { id: 115, name: "Riddara" },
  { id: 116, name: "Rover" },
  { id: 117, name: "Saab" },
  { id: 118, name: "Samsung" },
  { id: 119, name: "Saturn" },
  { id: 120, name: "Seat" },
  { id: 121, name: "Shineray" },
  { id: 122, name: "Simca" },
  { id: 123, name: "SKODA" },
  { id: 124, name: "Smart" },
  { id: 125, name: "SsangYong" },
  { id: 126, name: "Subaru" },
  { id: 127, name: "Swm" },
  { id: 128, name: "Tata" },
  { id: 129, name: "Tesla" },
  { id: 130, name: "Triumph" },
  { id: 131, name: "Uaz" },
  { id: 132, name: "Voltera" },
  { id: 133, name: "Volvo" },
  { id: 134, name: "Willys" },
  { id: 135, name: "Yamaha" },
  { id: 136, name: "Zna" },
  { id: 137, name: "Zotye" },
  { id: 138, name: "Zxauto" },
];

interface Vehicle {
  id: string;
  brand: string;
  description: string;
  model: string;
  year: number;
  price: number;
  imgSrc: string;
  link: string;
  comments?: string;
    contactCel: string;
}

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


const carModels = {
  Toyota: models["Toyota"],
  Honda: models["Honda"],
  Ford: models["Ford"],
  BMW: models["BMW"],
  "Mercedes-Benz": models["Mercedes_Benz"],
  Chevrolet:models["Chevrolet"],
  Hyundai: models["Hyundai"],
  Nissan: models["Nissan"],
  Peugeot: models["Peugeot"],
  Kia: models["Kia"],
  Volkswagen: models["Volkswagen"],
  Mazda: models["Mazda"],
  Suzuki: models["Suzuki"],
  Audi: models["Audi"],
  Citroen: models["Citroen"],
  Alfa_romeo: models["Alfa_Romeo"],

};

export default function CarSearch() {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [yearRange, setYearRange] = useState({ from: 2000, to: 2024 });
  const [priceRange, setPriceRange] = useState({ from: 500000, to: 20500000 });
  const [showYearModal, setShowYearModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [searchResults, setSearchResults] = useState<VehicleList[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  console.log("selectedVehicles: ", selectedVehicles);
  
  // const handleSearch = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("marca", selectedBrand);
  //   formData.append("modelo", selectedModel);
  //   formData.append("añoDesde", yearRange.from.toString());
  //   formData.append("añoHasta", yearRange.to.toString());
  //   formData.append("precioDesde", priceRange.from.toString());
  //   formData.append("precioHasta", priceRange.to.toString());

  //   console.log(
  //     yearRange.from,
  //     yearRange.to,
  //     priceRange.from,
  //     priceRange.to,
  //     selectedBrand
  //   );

  //   try {
  //     const response = await fetch(
  //       `https://72jdmlb6-3000.brs.devtunnels.ms/cars?minPrice=${priceRange.from}&maxPrice=${priceRange.to}&marca=${selectedBrand}&startYear=${yearRange.from}&endYear=${yearRange.to}&modelo=${selectedModel}`,
  //       {
  //         method: "GET",
  //       }
  //     );
  //     const data = await response.json();
  //     setSearchResults(data);
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Error al buscar vehículos:", error);
  //   }
  // };

  const handleSetAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedBrand) {
toast.error("Por favor, selecciona una marca");      
      return;
    }
    if(!selectedModel) {  
      toast.error("Por favor, selecciona un modelo");
      return;
    }
    if(!yearRange.from || !yearRange.to) {
toast.error("Por favor, selecciona un rango de años");
      return;
    }
    if(!priceRange.from || !priceRange.to) {
      toast.error("Por favor, selecciona un rango de precios");
      return;
    }
    setShowAlertModal(true)
  }

  // Usar este effect para cuando se ejecute una alarma creada

  useEffect(() => {})

  const handleSaveSelection = async () => {
    try {
      const selectedVehiclesData = searchResults.filter((vehicle: Vehicle) =>
        selectedVehicles.includes(vehicle.id)
      );

      console.log("selectedVehiclesData: ", selectedVehiclesData);
      

      await fetch(URL_PROD + "/management/vehicles/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicles: selectedVehiclesData.map((vehicle) => ({
            ...vehicle,
            isContacted: false,
            isFavorite: false,
          })),
        }),
      });

      setSelectedVehicles([]);
      navigate("/management");
    } catch (error) {
      console.error("Error al guardar los vehículos seleccionados:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Encuentra tu Vehículo Ideal
            </h2>
            <div className="flex gap-4">
            <button
                onClick={() => navigate('/vehicles')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Car className="w-5 h-5" />
                Mis Vehículos
              </button>
              <button
                onClick={() => navigate("/alerts")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ListFilter className="w-5 h-5" />
                Mis Alertas
              </button>
              <LogoutButton />
              {/* <button
                onClick={() => setShowAlertModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                Crear Alerta
              </button> */}
            </div>
          </div>

          {selectedVehicles.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
              <p className="text-blue-700">
                {selectedVehicles.length} vehículo(s) seleccionado(s)
              </p>
              <button
                onClick={handleSaveSelection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Selección
              </button>
            </div>
          )}

          <form  onSubmit={handleSetAlert} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setSelectedModel("");
                  }}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccionar Marca</option>
                  {carBrands.map((brand) => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccionar Modelo</option>
                  {selectedBrand &&
                    carModels[selectedBrand as keyof typeof carModels].map(
                      (model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      )
                    )}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowYearModal(true)}
                className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Año: {yearRange.from} - {yearRange.to}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowPriceModal(true)}
                className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Precio: ${priceRange.from.toLocaleString()} - $
                    {priceRange.to.toLocaleString()}
                  </span>
                </span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Bell className="w-5 h-5" />
              Crear Alerta
            </button>
          </form>
        </div>

        <div className="mt-8">
          <VehicleList
            vehicles={searchResults}
            selectedVehicles={selectedVehicles}
            onVehicleSelect={(vehicleId) => {
              console.log("vehicle id: ", vehicleId);
              
              setSelectedVehicles((prev) =>
                prev.includes(vehicleId)
                  ? prev.filter((id) => id !== vehicleId)
                  : [...prev, vehicleId]
              );
            }}
          />
        </div>
      </div>

      {showYearModal && (
        <YearRangeModal
          yearRange={yearRange}
          onSave={setYearRange}
          onClose={() => setShowYearModal(false)}
        />
      )}

      {showPriceModal && (
        <PriceRangeModal
          priceRange={priceRange}
          onSave={setPriceRange}
          onClose={() => setShowPriceModal(false)}
        />
      )}

      {showAlertModal && (
        <AlertModal
          searchParams={{
            brand: selectedBrand,
            model: selectedModel,
            yearRange,
            priceRange,
          }}
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </div>
  );
}
