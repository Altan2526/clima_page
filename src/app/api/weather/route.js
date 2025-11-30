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
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
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

    const weatherData = {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      visibility: data.visibility / 1000,
      clouds: data.clouds.all,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al obtener el clima" },
      { status: 500 }
    );
  }
}
