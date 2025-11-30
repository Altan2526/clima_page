import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "Se requiere el nombre de la ciudad" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key no configurada" },
      { status: 500 }
    );
  }

  try {
    // Usar la API de pronóstico de 5 días
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric&lang=es`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Ciudad no encontrada" },
          { status: 404 }
        );
      }
      throw new Error("Error al obtener datos del pronóstico");
    }

    const data = await response.json();

    // Procesar los datos para obtener un pronóstico por día
    // La API devuelve datos cada 3 horas, necesitamos agrupar por día
    const dailyForecasts = {};
    
    // Obtener la fecha de hoy en formato YYYY-MM-DD (zona local)
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // Solo incluir días desde hoy en adelante
      if (dateKey < todayString) return;
      
      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date: dateKey,
          temps: [],
          humidity: [],
          descriptions: [],
          icons: [],
          wind: []
        };
      }
      
      dailyForecasts[dateKey].temps.push(item.main.temp);
      dailyForecasts[dateKey].humidity.push(item.main.humidity);
      dailyForecasts[dateKey].descriptions.push(item.weather[0].description);
      dailyForecasts[dateKey].icons.push(item.weather[0].icon);
      dailyForecasts[dateKey].wind.push(item.wind.speed);
    });

    // Convertir a array y calcular promedios
    const forecast = Object.values(dailyForecasts)
      .slice(0, 5) // Solo 5 días
      .map((day) => {
        const avgTemp = Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length);
        const maxTemp = Math.round(Math.max(...day.temps));
        const minTemp = Math.round(Math.min(...day.temps));
        const avgHumidity = Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length);
        const avgWind = (day.wind.reduce((a, b) => a + b, 0) / day.wind.length).toFixed(1);
        
        // Obtener la descripción más común
        const descCounts = {};
        day.descriptions.forEach(desc => {
          descCounts[desc] = (descCounts[desc] || 0) + 1;
        });
        const mainDescription = Object.entries(descCounts)
          .sort((a, b) => b[1] - a[1])[0][0];
        
        // Obtener el icono más común (para el día, preferir iconos de día "d")
        const iconCounts = {};
        day.icons.forEach(icon => {
          const dayIcon = icon.replace('n', 'd'); // Convertir iconos de noche a día
          iconCounts[dayIcon] = (iconCounts[dayIcon] || 0) + 1;
        });
        const mainIcon = Object.entries(iconCounts)
          .sort((a, b) => b[1] - a[1])[0][0];

        return {
          date: day.date,
          dayName: getDayName(day.date),
          temperature: avgTemp,
          tempMax: maxTemp,
          tempMin: minTemp,
          humidity: avgHumidity,
          windSpeed: parseFloat(avgWind),
          description: mainDescription,
          icon: mainIcon
        };
      });

    const weatherData = {
      city: data.city.name,
      country: data.city.country,
      forecast: forecast
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Error fetching forecast:", error);
    return NextResponse.json(
      { error: "Error al obtener el pronóstico" },
      { status: 500 }
    );
  }
}

function getDayName(dateString) {
  // Parsear la fecha correctamente para evitar desfase de zona horaria
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateOnly = new Date(year, month - 1, day);
  dateOnly.setHours(0, 0, 0, 0);
  
  if (dateOnly.getTime() === today.getTime()) {
    return 'Hoy';
  } else if (dateOnly.getTime() === tomorrow.getTime()) {
    return 'Mañana';
  }
  
  return days[date.getDay()];
}
