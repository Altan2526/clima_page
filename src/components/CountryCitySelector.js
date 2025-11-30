"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./CountryCitySelector.module.css";

export default function CountryCitySelector({ onSearch }) {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Cargar lista de países al montar el componente
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/cities");
        const data = await response.json();
        setCountries(data.countries || []);
      } catch (error) {
        console.error("Error al cargar países:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Cargar ciudades cuando se selecciona un país
  useEffect(() => {
    if (!selectedCountry) {
      setCities([]);
      setSelectedCity("");
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch(`/api/cities?country=${selectedCountry}`);
        const data = await response.json();
        setCities(data.cities || []);
        setSelectedCity("");
        setSearchTerm("");
      } catch (error) {
        console.error("Error al cargar ciudades:", error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedCountry]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSearchTerm("");
    
    // Buscar automáticamente al seleccionar una ciudad
    if (city && selectedCountry) {
      setIsSearching(true);
      const searchQuery = `${city},${selectedCountry}`;
      
      if (onSearch) {
        onSearch(searchQuery);
        setIsSearching(false);
      } else {
        router.push(`/explorar?city=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleSearch = () => {
    if (selectedCity) {
      setIsSearching(true);
      const searchQuery = `${selectedCity},${selectedCountry}`;
      
      if (onSearch) {
        // Si hay callback, usarlo (para la página /explorar)
        onSearch(searchQuery);
        setIsSearching(false);
      } else {
        // Si no, navegar a la página de explorar
        router.push(`/explorar?city=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  // Filtrar ciudades basándose en el término de búsqueda
  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🌎 Buscar por País y Ciudad</h2>
        <p className={styles.subtitle}>Selecciona un país y luego elige una ciudad de las disponibles</p>
      </div>

      <div className={styles.selectorsWrapper}>
        {/* Selector de País */}
        <div className={styles.selectorGroup}>
          <label className={styles.label}>
            <span className={styles.labelIcon}>🌍</span> País
          </label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={loadingCountries}
            >
              <option value="">
                {loadingCountries ? "Cargando países..." : "Seleccionar país..."}
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>▼</span>
          </div>
        </div>

        {/* Selector de Ciudad */}
        <div className={styles.selectorGroup}>
          <label className={styles.label}>
            <span className={styles.labelIcon}>🏙️</span> Ciudad
            {cities.length > 0 && (
              <span className={styles.cityCount}>({cities.length} disponibles)</span>
            )}
          </label>
          
          {/* Campo de búsqueda para filtrar ciudades */}
          {selectedCountry && cities.length > 15 && (
            <input
              type="text"
              className={styles.searchInput}
              placeholder="🔎 Filtrar ciudades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedCountry || loadingCities}
            >
              <option value="">
                {loadingCities 
                  ? "Cargando ciudades..." 
                  : !selectedCountry 
                    ? "Primero selecciona un país" 
                    : `Seleccionar ciudad...`
                }
              </option>
              {filteredCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>▼</span>
          </div>
          
          {searchTerm && filteredCities.length === 0 && (
            <p className={styles.noResults}>No se encontraron ciudades con "{searchTerm}"</p>
          )}
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={handleSearch}
          className={styles.searchButton}
          disabled={!selectedCity || isSearching}
        >
          {isSearching ? (
            <span className={styles.loader}></span>
          ) : (
            <>
              <span className={styles.buttonIcon}>🔍</span>
              Ver Clima
            </>
          )}
        </button>
      </div>

      {/* Información de selección actual */}
      {selectedCountry && selectedCity && (
        <div className={styles.selection}>
          <span className={styles.selectionText}>
            📍 {selectedCity}, {countries.find(c => c.code === selectedCountry)?.name}
          </span>
        </div>
      )}
    </div>
  );
}
