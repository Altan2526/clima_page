import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.title}>🌤️ Clima App</h3>
          <p className={styles.description}>
            Tu aplicación de clima favorita para consultar el tiempo en cualquier ciudad del mundo.
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.subtitle}>Navegación</h4>
          <nav className={styles.links}>
            <Link href="/">Inicio</Link>
            <Link href="/explorar">Explorar por País</Link>
            <Link href="/multi-city">Pronóstico 5 Días</Link>
          </nav>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} Clima App. Datos proporcionados por{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeather
          </a>
        </p>
        <p className={styles.developer}>
          Desarrollado por{" "}
          <a
            href="https://github.com/Altan2526"
            target="_blank"
            rel="noopener noreferrer"
          >
            Altan2526
          </a>
        </p>
      </div>
    </footer>
  );
}
