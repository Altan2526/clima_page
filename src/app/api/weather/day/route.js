import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const date = searchParams.get("date");

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
    // Obtener pronóstico de 5 días con datos cada 3 horas
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
      throw new Error("Error al obtener datos del clima");
    }

    const data = await response.json();

    // También obtener el clima actual para más detalles
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric&lang=es`
    );
    
    let currentData = null;
    if (currentResponse.ok) {
      currentData = await currentResponse.json();
    }

    // Filtrar datos del día específico o usar el día actual
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const hourlyData = data.list
      .filter((item) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDate;
      })
      .map((item) => {
        const dateTime = new Date(item.dt * 1000);
        return {
          time: dateTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          hour: dateTime.getHours(),
          temperature: Math.round(item.main.temp),
          feelsLike: Math.round(item.main.feels_like),
          humidity: item.main.humidity,
          pressure: item.main.pressure,
          windSpeed: item.wind.speed,
          windDeg: item.wind.deg,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          clouds: item.clouds.all,
          pop: Math.round((item.pop || 0) * 100), // Probabilidad de precipitación
          visibility: item.visibility ? Math.round(item.visibility / 1000) : 10
        };
      });

    // Calcular resumen del día
    const temps = hourlyData.map(h => h.temperature);
    const humidity = hourlyData.map(h => h.humidity);
    const winds = hourlyData.map(h => h.windSpeed);
    
    const daySummary = hourlyData.length > 0 ? {
      tempMax: Math.max(...temps),
      tempMin: Math.min(...temps),
      tempAvg: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
      humidityAvg: Math.round(humidity.reduce((a, b) => a + b, 0) / humidity.length),
      windAvg: (winds.reduce((a, b) => a + b, 0) / winds.length).toFixed(1),
      windMax: Math.max(...winds).toFixed(1)
    } : null;

    // Datos adicionales del clima actual (si es hoy)
    const currentDetails = currentData ? {
      visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : 10,
      clouds: currentData.clouds?.all || 0,
      sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      pressure: currentData.main.pressure,
      currentTemp: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon
    } : null;

    // Obtener el día de la semana
    const targetDateObj = new Date(targetDate);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDateObj.setHours(0, 0, 0, 0);
    
    let dayLabel;
    if (targetDateObj.getTime() === today.getTime()) {
      dayLabel = "Hoy";
    } else {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (targetDateObj.getTime() === tomorrow.getTime()) {
        dayLabel = "Mañana";
      } else {
        dayLabel = days[targetDateObj.getDay()];
      }
    }

    const weatherData = {
      city: data.city.name,
      country: data.city.country,
      date: targetDate,
      dayLabel: dayLabel,
      dayName: days[targetDateObj.getDay()],
      formattedDate: `${targetDateObj.getDate()} de ${months[targetDateObj.getMonth()]}`,
      hourlyForecast: hourlyData,
      summary: daySummary,
      current: currentDetails,
      isToday: dayLabel === "Hoy"
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Error fetching day detail:", error);
    return NextResponse.json(
      { error: "Error al obtener el detalle del día" },
      { status: 500 }
    );
  }
}
