"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentCities, setRecentCities] = useState([]);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceTimer = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();

  const loadRecentCities = () => {
    const saved = localStorage.getItem("recentCities");
    if (saved) {
      setRecentCities(JSON.parse(saved));
    }
  };

  useEffect(() => {
    // Cargar ciudades recientes del localStorage
    loadRecentCities();

    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      loadRecentCities();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Cerrar dashboard al hacer clic fuera
    const handleClickOutside = (e) => {
      // No cerrar si se hace clic en el dashboard wrapper, menú móvil, botón del menú o panel del dashboard
      if (!e.target.closest(`.${styles.dashboardWrapper}`) && 
          !e.target.closest(`.${styles.mobileMenu}`) &&
          !e.target.closest(`.${styles.menuButton}`) &&
          !e.target.closest(`.${styles.dashboardPanel}`)) {
        setIsDashboardOpen(false);
      }
      // Cerrar sugerencias al hacer clic fuera del buscador
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Buscar sugerencias con debounce
  const searchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`/api/cities/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (response.ok && data.cities) {
        setSuggestions(data.cities.slice(0, 6));
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Error buscando ciudades:", err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Limpiar timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Establecer nuevo timer con 400ms de delay
    debounceTimer.current = setTimeout(() => {
      searchSuggestions(value);
    }, 400);
  };

  const handleSuggestionClick = (city) => {
    setSearchQuery(city.name);
    setShowSuggestions(false);
    setSuggestions([]);
    router.push(`/multi-city?city=${encodeURIComponent(city.name + "," + city.country)}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/multi-city?city=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleDashboard = (e) => {
    e.stopPropagation();
    setIsDashboardOpen(!isDashboardOpen);
  };

  const menuItems = [
    {
      icon: "🏠",
      title: "Inicio",
      description: "Página principal",
      link: "/",
      color: "teal"
    },
    {
      icon: "🗺️",
      title: "Explorar por País",
      description: "Selecciona país y ciudad",
      link: "/explorar",
      color: "cyan"
    },
    {
      icon: "📅",
      title: "Pronóstico 5 Días",
      description: "Consulta el clima de los próximos días",
      link: "/multi-city",
      color: "green"
    }
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>CLIMA<span className={styles.logoHighlight}>APP</span></span>
        </Link>

        {/* Barra de búsqueda */}
        <form className={styles.searchForm} onSubmit={handleSearch} ref={searchRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="El Tiempo en..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          
          {/* Dropdown de sugerencias */}
          {showSuggestions && (
            <div className={styles.suggestionsDropdown}>
              {isLoadingSuggestions ? (
                <div className={styles.suggestionLoading}>
                  <span className={styles.miniLoader}></span>
                  Buscando...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((city, index) => (
                  <div 
                    key={`${city.name}-${city.country}-${index}`}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(city)}
                  >
                    <span className={styles.suggestionCity}>{city.name}</span>
                    <span className={styles.suggestionCountry}>{city.countryName}</span>
                  </div>
                ))
              ) : searchQuery.length >= 2 ? (
                <div className={styles.noSuggestions}>
                  No se encontraron ciudades
                </div>
              ) : null}
            </div>
          )}
        </form>

        {/* Ciudades recientes */}
        <div className={styles.citiesBar}>
          {recentCities.length > 0 ? (
            recentCities.slice(0, 3).map((city, index) => (
              <Link
                key={index}
                href={`/multi-city?city=${encodeURIComponent(city.name)}`}
                className={styles.cityItem}
              >
                <span className={styles.cityIcon}>{city.icon || "🌤️"}</span>
                <div className={styles.cityInfo}>
                  <span className={styles.cityName}>{city.name}</span>
                  <span className={styles.cityRegion}>{city.region}</span>
                </div>
                <span className={styles.cityTemp}>{city.temp}°</span>
              </Link>
            ))
          ) : (
            <>
              <Link href="/multi-city?city=Santiago" className={styles.cityItem}>
                <span className={styles.cityIcon}>☀️</span>
                <div className={styles.cityInfo}>
                  <span className={styles.cityName}>Santiago</span>
                  <span className={styles.cityRegion}>Chile</span>
                </div>
                <span className={styles.cityTemp}>26°</span>
              </Link>
              <Link href="/multi-city?city=Temuco" className={styles.cityItem}>
                <span className={styles.cityIcon}>🌧️</span>
                <div className={styles.cityInfo}>
                  <span className={styles.cityName}>Temuco</span>
                  <span className={styles.cityRegion}>Araucanía</span>
                </div>
                <span className={styles.cityTemp}>15°</span>
              </Link>
            </>
          )}
        </div>

        {/* Dashboard Button & Panel */}
        <div className={styles.dashboardWrapper}>
          <button 
            className={`${styles.dashboardButton} ${isDashboardOpen ? styles.active : ""}`}
            onClick={toggleDashboard}
            aria-label="Abrir Dashboard"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.dashboardIcon}>
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span className={styles.dashboardLabel}>Dashboard</span>
          </button>

          {/* Dashboard Panel */}
          {isDashboardOpen && (
            <div className={styles.dashboardPanel}>
              <div className={styles.dashboardHeader}>
                <h3 className={styles.dashboardTitle}>📊 Dashboard</h3>
                <span className={styles.dashboardSubtitle}>Navegación rápida</span>
              </div>

              {/* Menu Items */}
              <div className={styles.menuGrid}>
                {menuItems.map((item, index) => (
                  <Link 
                    key={index} 
                    href={item.link} 
                    className={`${styles.menuItem} ${styles[item.color]}`}
                    onClick={() => setIsDashboardOpen(false)}
                  >
                    <span className={styles.menuIcon}>{item.icon}</span>
                    <div className={styles.menuContent}>
                      <span className={styles.menuTitle}>{item.title}</span>
                      <span className={styles.menuDescription}>{item.description}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Recent Cities in Dashboard */}
              {recentCities.length > 0 && (
                <div className={styles.recentSection}>
                  <h4 className={styles.recentTitle}>🕐 Búsquedas recientes</h4>
                  <div className={styles.recentList}>
                    {recentCities.slice(0, 5).map((city, index) => (
                      <Link
                        key={index}
                        href={`/multi-city?city=${encodeURIComponent(city.name)}`}
                        className={styles.recentItem}
                        onClick={() => setIsDashboardOpen(false)}
                      >
                        <span className={styles.recentIcon}>{city.icon || "🌤️"}</span>
                        <span className={styles.recentName}>{city.name}</span>
                        <span className={styles.recentTemp}>{city.temp}°</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menú móvil */}
        <div className={styles.mobileMenu}>
          <button className={styles.menuButton} onClick={toggleDashboard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
