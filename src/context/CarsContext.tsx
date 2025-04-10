// import { createContext, useContext, useState, Dispatch, SetStateAction} from 'react';

// const CarContext = createContext<CarsContextType | undefined>(undefined);

// interface Vehicle {
//   id: string;
//   brand: string;
//   description: string;
//   model: string;
//   year: number;
//   price: number;
//   imgSrc: string;
//   link: string;
// }

// interface CarsContextType {
  
//     loading: boolean;
//     setCars: Dispatch<SetStateAction<Vehicle[]>>;
//     cars: Vehicle | null;
//     setLoading: Dispatch<SetStateAction<boolean>>;
//     status: { id: string; status: string } | null;
//     setSelectedVehicles: Dispatch<SetStateAction<string[]| null>>;
//     selectedVehicles: string[] | null;
//     searchResults: Vehicle[] | null;
// }



// interface Props {
//   children: React.ReactNode;
// }

// export function CarProvider({ children }:Props) {
//     const [cars, setCars] = useState<Vehicle[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handleSaveSelection = async ({ setSelectedVehicles, selectedVehicles, searchResults}:CarsContextType) => {
//         try {
//           const selectedVehiclesData = searchResults?.filter((vehicle) =>
//             selectedVehicles?.includes(vehicle.id)
//           );
    
//           console.log("selectedVehiclesData: ", selectedVehiclesData);
          
    
//           await fetch("https://72jdmlb6-3000.brs.devtunnels.ms/management/vehicles/save", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               vehicles: selectedVehiclesData?.map((vehicle) => ({
//                 ...vehicle,
//                 isContacted: false,
//                 isFavorite: false,
//               })),
//             }),
//           });

//           const updateVehicles = (newVehicles: Vehicle[]) => {
//             // setCars(); // Ahora estamos estableciendo un array de vehículos
//           };
//           updateVehicles(selectedVehiclesData || []); // Actualiza el estado de los vehículos con los seleccionados
//           setSelectedVehicles([]);
          
//         } catch (error) {
//           console.error("Error al guardar los vehículos seleccionados:", error);
//         }
//       };

//     return (
//         <CarContext.Provider value={{ cars, setCars, loading, setLoading, error, setError , handleSaveSelection}}>
//             {children}
//         </CarContext.Provider>
//     );
// }

// export function useCarsContent() {
//     const context = useContext(CarContext);
//     if (!context) {
//         throw new Error('useContent must be used within a ContextProvider');
//     }
//     return context;
// }