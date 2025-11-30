import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const features = [
    {
      icon: "🗺️",
      title: "Explorar por País",
      description: "Selecciona un país y ciudad de nuestra lista para ver el clima actual y pronóstico de 5 días.",
      link: "/explorar",
      color: "purple"
    },
    {
      icon: "📅",
      title: "Pronóstico 5 Días",
      description: "Busca cualquier ciudad y consulta el pronóstico detallado para los próximos 5 días.",
      link: "/multi-city",
      color: "green"
    },
    {
      icon: "⏱️",
      title: "Pronóstico por Hora",
      description: "Visualiza el clima hora por hora para planificar tu día con precisión.",
      link: "/multi-city",
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
            Busca ciudades con autocompletado inteligente y obtén pronósticos detallados.
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

      {/* How to use Section */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <h3>Busca tu ciudad</h3>
            <p>Usa el buscador del header con autocompletado inteligente</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <h3>Consulta el pronóstico</h3>
            <p>Visualiza el clima actual y pronóstico de 5 días</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <h3>Explora los detalles</h3>
            <p>Haz clic en cualquier día para ver el pronóstico por hora</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.info}>
        <h2 className={styles.sectionTitle}>Características</h2>
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🔍</span>
            <h3>Autocompletado</h3>
            <p>Búsqueda inteligente tolerante a tildes</p>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🌡️</span>
            <h3>Datos en tiempo real</h3>
            <p>Temperatura, humedad, viento y más</p>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>📅</span>
            <h3>Pronóstico 5 días</h3>
            <p>Planifica tu semana con anticipación</p>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🌐</span>
            <h3>Cobertura global</h3>
            <p>Ciudades de todo el mundo</p>
          </div>
        </div>
      </section>
    </div>
  );
}
