import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

// Definición de la interfaz para un vehículo
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
    comment?: string;
    contactCel: string;
}

// Definición de la interfaz para una alerta que contiene múltiples vehículos
interface Alert {
    alertId: string | undefined;
    vehicles: Vehicle[];
}

// Definición de la interfaz para el tipo de contexto
interface CarsContextType {
    vehicles: Alert[];
    setVehicles: Dispatch<SetStateAction<Alert[]>>;
    brands: string[];
    setBrands: Dispatch<SetStateAction<string[]>>;
    nombreAlerta: string;
    setNombreAlerta: Dispatch<SetStateAction<string>>;
    filterVehicles: number;
    setFilterVehicles: Dispatch<SetStateAction<number>>;
}

// Creación del contexto con un valor por defecto
const CarContext = createContext<CarsContextType | undefined>(undefined);

// Definición de las propiedades esperadas por el proveedor del contexto
interface Props {
    children: React.ReactNode;
}

// Implementación del proveedor del contexto
export const CarProvider: React.FC<Props> = ({ children }) => {
    const [vehicles, setVehicles] = useState<Alert[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [filterVehicles , setFilterVehicles] = useState<number>(0);
    const [nombreAlerta, setNombreAlerta] = useState<string>('');

    return (
        <CarContext.Provider value={{ vehicles, setVehicles, brands, setBrands, nombreAlerta, setNombreAlerta , filterVehicles, setFilterVehicles }}>
            {children}
        </CarContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useCarsContext = (): CarsContextType => {
    const context = useContext(CarContext);
    if (!context) {
        throw new Error('useCarsContext debe ser utilizado dentro de un CarProvider');
    }
    return context;
};
