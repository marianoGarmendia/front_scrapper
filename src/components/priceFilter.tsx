import React, { useState } from 'react';

const generatePriceOptions = () => {
  const options = [];
  for (let price = 500000; price <= 20500000; price += 500000) {
    options.push(price);
  }
  return options;
};

const PriceFilter = () => {
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const priceOptions = generatePriceOptions();

  const formatPrice = (value: number) =>
    `$${value.toLocaleString('es-CL')}`;

  const handleMinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMinPrice(Number(e.target.value));
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxPrice(Number(e.target.value));
  };

  return (
    <div className="flex gap-4">
      <div>
        <label>Precio mínimo:</label>
        <select value={minPrice ?? ''} onChange={handleMinChange}>
          <option value="">Seleccionar</option>
          {priceOptions.map((price) => (
            <option key={price} value={price}>
              {formatPrice(price)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Precio máximo:</label>
        <select value={maxPrice ?? ''} onChange={handleMaxChange}>
          <option value="">Seleccionar</option>
          {priceOptions.map((price) => (
            <option key={price} value={price}>
              {formatPrice(price)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p>Precio seleccionado:</p>
        <p>Min: {minPrice ?? '-'}</p>
        <p>Max: {maxPrice ?? '-'}</p>
      </div>
    </div>
  );
};

export default PriceFilter;
