import Link from "next/link";
import styles from "./page.module.css";
import CountryCitySelector from "@/components/CountryCitySelector";

export default function Home() {
  const features = [
    {
      icon: "🗺️",
      title: "Explorar por País",
      description: "Selecciona un país y ciudad de nuestra lista para ver el clima rápidamente.",
      link: "/explorar",
      color: "purple"
    },
    {
      icon: "📅",
      title: "Pronóstico 5 Días",
      description: "Consulta el pronóstico del tiempo para los próximos 5 días de cualquier ciudad.",
      link: "/multi-city",
      color: "green"
    },
    {
      icon: "🔍",
      title: "Búsqueda Rápida",
      description: "Usa el buscador del header para encontrar cualquier ciudad del mundo.",
      link: "#explore",
      color: "cyan"
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Bienvenido a <span className={styles.highlight}>Clima App</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Tu aplicación de clima favorita para consultar el tiempo en cualquier parte del mundo. 
            Información actualizada en tiempo real gracias a la API de OpenWeather.
          </p>
          <div className={styles.heroCTA}>
            <Link href="/explorar" className={styles.primaryButton}>
              🗺️ Explorar por País
            </Link>
            <Link href="/multi-city" className={styles.secondaryButton}>
              📅 Pronóstico 5 Días
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <span className={styles.weatherEmoji}>🌤️</span>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>¿Qué puedes hacer?</h2>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <Link href={feature.link} key={index} className={`${styles.featureCard} ${styles[feature.color]}`}>
              <span className={styles.featureIcon}>{feature.icon}</span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <span className={styles.featureArrow}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Country/City Explorer Section */}
      <section id="explore" className={styles.exploreSection}>
        <h2 className={styles.sectionTitle}>Explorar por País y Ciudad</h2>
        <p className={styles.exploreDescription}>
          Selecciona un país de la lista y luego elige una de sus principales ciudades para consultar el clima
        </p>
        <CountryCitySelector />
      </section>

      {/* Info Section */}
      <section className={styles.info}>
        <h2 className={styles.sectionTitle}>Información de la API</h2>
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>⚡</span>
            <h3>60 llamadas/min</h3>
            <p>Límite de solicitudes por minuto en el plan gratuito</p>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>📊</span>
            <h3>1,000,000/mes</h3>
            <p>Llamadas disponibles mensualmente sin costo</p>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🌡️</span>
            <h3>Datos en tiempo real</h3>
            <p>Temperatura, humedad, viento y más</p>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🌐</span>
            <h3>Cobertura global</h3>
            <p>Datos de ciudades de todo el mundo</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <h3>Elige una opción</h3>
            <p>Busca una ciudad individual o compara múltiples ciudades</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <h3>Ingresa la ciudad</h3>
            <p>Escribe el nombre de la ciudad que deseas consultar</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <h3>Obtén resultados</h3>
            <p>Visualiza información detallada del clima actual</p>
          </div>
        </div>
      </section>
    </div>
  );
}
