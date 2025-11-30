import { NextResponse } from "next/server";

// Lista extensa de ciudades por país usando los códigos ISO de OpenWeather
const citiesByCountry = {
  AR: [ // Argentina
    "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "San Miguel de Tucumán", 
    "Mar del Plata", "Salta", "Santa Fe", "San Juan", "Resistencia", "Neuquén", 
    "Santiago del Estero", "Corrientes", "Bahía Blanca", "San Salvador de Jujuy", 
    "Posadas", "Paraná", "Formosa", "San Luis", "Catamarca", "La Rioja", "Río Gallegos",
    "Ushuaia", "Rawson", "Viedma", "San Rafael", "Tandil", "Olavarría", "Pergamino",
    "Junín", "Villa María", "Río Cuarto", "San Nicolás de los Arroyos", "Concordia",
    "Gualeguaychú", "Rafaela", "Venado Tuerto", "San Francisco", "Villa Carlos Paz"
  ],
  BO: [ // Bolivia
    "La Paz", "Santa Cruz de la Sierra", "Cochabamba", "Sucre", "Oruro", "Tarija", 
    "Potosí", "Trinidad", "Cobija", "Riberalta", "Yacuiba", "Montero", "Quillacollo",
    "Sacaba", "Warnes", "Viacha", "Camiri", "Tupiza", "Villazón", "Uyuni"
  ],
  BR: [ // Brasil
    "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte",
    "Manaus", "Curitiba", "Recife", "Porto Alegre", "Belém", "Goiânia", "Guarulhos",
    "Campinas", "São Luís", "São Gonçalo", "Maceió", "Duque de Caxias", "Natal",
    "Teresina", "São Bernardo do Campo", "Campo Grande", "Nova Iguaçu", "João Pessoa",
    "Santo André", "São José dos Campos", "Jaboatão dos Guararapes", "Osasco",
    "Ribeirão Preto", "Uberlândia", "Contagem", "Sorocaba", "Aracaju", "Feira de Santana",
    "Cuiabá", "Joinville", "Juiz de Fora", "Londrina", "Niterói", "Ananindeua",
    "Florianópolis", "Vitória", "Santos", "Maringá", "Blumenau", "Petrópolis"
  ],
  CL: [ // Chile
    "Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco",
    "Rancagua", "Talca", "Arica", "Iquique", "Puerto Montt", "Punta Arenas",
    "Coquimbo", "Talcahuano", "Chillán", "Osorno", "Los Ángeles", "Valdivia",
    "Calama", "Copiapó", "Curicó", "Quilpué", "Villa Alemana", "Viña del Mar",
    "San Bernardo", "Puente Alto", "Maipú", "Las Condes", "Providencia", "Ñuñoa",
    "La Florida", "Peñalolén", "Pudahuel", "Cerrillos", "Linares", "San Fernando",
    "Ovalle", "San Antonio", "Melipilla", "Colina", "Buin", "Paine"
  ],
  CO: [ // Colombia
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga",
    "Pereira", "Santa Marta", "Ibagué", "Pasto", "Manizales", "Neiva", "Villavicencio",
    "Armenia", "Valledupar", "Montería", "Sincelejo", "Popayán", "Florencia",
    "Riohacha", "Quibdó", "Tunja", "Yopal", "Mocoa", "Leticia", "San Andrés",
    "Palmira", "Buenaventura", "Bello", "Itagüí", "Envigado", "Dosquebradas",
    "Soledad", "Maicao", "Sogamoso", "Duitama", "Tuluá", "Cartago", "Girardot"
  ],
  CR: [ // Costa Rica
    "San José", "Alajuela", "Cartago", "Heredia", "Liberia", "Puntarenas", "Limón",
    "San Francisco", "Desamparados", "San Vicente", "Cinco Esquinas", "San Rafael",
    "Curridabat", "San Juan", "Paraíso", "Turrialba", "San Isidro", "Nicoya",
    "Quepos", "Jacó", "Guápiles", "Ciudad Quesada", "Grecia", "Atenas"
  ],
  CU: [ // Cuba
    "La Habana", "Santiago de Cuba", "Camagüey", "Holguín", "Santa Clara", "Guantánamo",
    "Bayamo", "Las Tunas", "Cienfuegos", "Pinar del Río", "Matanzas", "Ciego de Ávila",
    "Sancti Spíritus", "Manzanillo", "Cárdenas", "Palma Soriano", "Morón", "Nuevitas",
    "Sagua la Grande", "Trinidad", "Artemisa", "Mayarí", "Contramaestre"
  ],
  EC: [ // Ecuador
    "Quito", "Guayaquil", "Cuenca", "Santo Domingo", "Machala", "Manta", "Portoviejo",
    "Ambato", "Riobamba", "Loja", "Esmeraldas", "Ibarra", "Latacunga", "Quevedo",
    "Milagro", "Babahoyo", "Tulcán", "Azogues", "Pasaje", "Santa Rosa", "Huaquillas",
    "Nueva Loja", "Puyo", "Tena", "Macas", "Zamora", "Coca", "Salinas", "Playas"
  ],
  SV: [ // El Salvador
    "San Salvador", "Santa Ana", "San Miguel", "Mejicanos", "Soyapango", "Apopa",
    "Santa Tecla", "Delgado", "San Marcos", "Ilopango", "Ahuachapán", "Usulután",
    "Cojutepeque", "Zacatecoluca", "San Vicente", "Chalatenango", "Sensuntepeque",
    "La Unión", "Metapán", "Sonsonate", "Quezaltepeque", "Chalchuapa"
  ],
  ES: [ // España
    "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia",
    "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo",
    "Gijón", "Hospitalet de Llobregat", "A Coruña", "Vitoria-Gasteiz", "Granada",
    "Elche", "Oviedo", "Badalona", "Cartagena", "Terrassa", "Jerez de la Frontera",
    "Sabadell", "Santa Cruz de Tenerife", "Móstoles", "Alcalá de Henares", "Pamplona",
    "Fuenlabrada", "Almería", "Leganés", "San Sebastián", "Santander", "Burgos",
    "Castellón", "Albacete", "Getafe", "Alcorcón", "Logroño", "San Cristóbal de La Laguna",
    "Badajoz", "Salamanca", "Huelva", "Lleida", "Marbella", "Tarragona", "León",
    "Cádiz", "Jaén", "Ourense", "Lugo", "Santiago de Compostela", "Cáceres", "Melilla",
    "Ceuta", "Toledo", "Girona", "Pontevedra", "Guadalajara", "Palencia", "Segovia"
  ],
  US: [ // Estados Unidos
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
    "Fort Worth", "Columbus", "San Francisco", "Charlotte", "Indianapolis", "Seattle",
    "Denver", "Washington", "Boston", "El Paso", "Detroit", "Nashville", "Portland",
    "Memphis", "Oklahoma City", "Las Vegas", "Louisville", "Baltimore", "Milwaukee",
    "Albuquerque", "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta",
    "Long Beach", "Colorado Springs", "Raleigh", "Miami", "Virginia Beach", "Omaha",
    "Oakland", "Minneapolis", "Tulsa", "Arlington", "Tampa", "New Orleans", "Wichita",
    "Cleveland", "Bakersfield", "Aurora", "Anaheim", "Honolulu", "Santa Ana", "Riverside",
    "Corpus Christi", "Lexington", "Stockton", "Henderson", "Saint Paul", "St. Louis",
    "Cincinnati", "Pittsburgh", "Greensboro", "Anchorage", "Plano", "Lincoln", "Orlando",
    "Irvine", "Newark", "Toledo", "Durham", "Chula Vista", "Fort Wayne", "Jersey City",
    "St. Petersburg", "Laredo", "Madison", "Chandler", "Buffalo", "Lubbock", "Scottsdale"
  ],
  GT: [ // Guatemala
    "Ciudad de Guatemala", "Mixco", "Villa Nueva", "Quetzaltenango", "San Miguel Petapa",
    "Escuintla", "Chinautla", "Villa Canales", "Petapa", "Amatitlán", "Santa Catarina Pinula",
    "San Juan Sacatepéquez", "Cobán", "Huehuetenango", "Chimaltenango", "Antigua Guatemala",
    "Puerto Barrios", "Mazatenango", "Retalhuleu", "Zacapa", "Jalapa", "Jutiapa",
    "Santa Cruz del Quiché", "Sololá", "Totonicapán", "San Marcos", "Flores"
  ],
  HN: [ // Honduras
    "Tegucigalpa", "San Pedro Sula", "Choloma", "La Ceiba", "El Progreso", "Comayagua",
    "Puerto Cortés", "Choluteca", "Juticalpa", "Villanueva", "Danlí", "Siguatepeque",
    "Tocoa", "Olanchito", "Santa Rosa de Copán", "La Lima", "Catacamas", "Tela",
    "Cofradía", "Santa Bárbara", "Potrerillos", "La Entrada", "San Lorenzo"
  ],
  MX: [ // México
    "Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León",
    "Ciudad Juárez", "Zapopan", "Mérida", "Cancún", "Querétaro", "San Luis Potosí",
    "Aguascalientes", "Hermosillo", "Saltillo", "Mexicali", "Culiacán", "Chihuahua",
    "Acapulco", "Morelia", "Veracruz", "Torreón", "Tlalnepantla", "Toluca",
    "Centro", "Naucalpan", "Durango", "Tuxtla Gutiérrez", "Tlaquepaque", "San Nicolás de los Garza",
    "Reynosa", "Mazatlán", "Irapuato", "Celaya", "Nuevo Laredo", "Matamoros",
    "Cuernavaca", "Tampico", "Ensenada", "Xalapa", "Villahermosa", "Ciudad Obregón",
    "Los Mochis", "Oaxaca", "Pachuca", "Campeche", "La Paz", "Chetumal", "Colima",
    "Tepic", "Zacatecas", "Guanajuato", "San Cristóbal de las Casas", "Playa del Carmen",
    "Puerto Vallarta", "Cabo San Lucas", "San Miguel de Allende", "Taxco", "Cozumel"
  ],
  NI: [ // Nicaragua
    "Managua", "León", "Masaya", "Matagalpa", "Chinandega", "Granada", "Estelí",
    "Tipitapa", "Ciudad Sandino", "Jinotega", "El Viejo", "Nueva Guinea", "Juigalpa",
    "Jalapa", "Bluefields", "Diriamba", "Ocotal", "Rivas", "Jinotepe", "Somoto",
    "Boaco", "San Carlos", "Bilwi", "Chichigalpa", "Corinto"
  ],
  PA: [ // Panamá
    "Ciudad de Panamá", "San Miguelito", "Tocumen", "David", "Colón", "La Chorrera",
    "Pacora", "Santiago", "Chitré", "Aguadulce", "Penonomé", "Changuinola", "La Concepción",
    "Arraiján", "Vista Alegre", "Chepo", "Las Tablas", "Bocas del Toro", "Portobelo"
  ],
  PY: [ // Paraguay
    "Asunción", "Ciudad del Este", "San Lorenzo", "Luque", "Capiatá", "Lambaré",
    "Fernando de la Mora", "Limpio", "Ñemby", "Encarnación", "Mariano Roque Alonso",
    "Pedro Juan Caballero", "Caaguazú", "Coronel Oviedo", "Presidente Franco",
    "Itauguá", "Villarrica", "Caacupé", "Pilar", "Concepción", "Hernandarias"
  ],
  PE: [ // Perú
    "Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos", "Cusco", "Huancayo",
    "Tacna", "Chimbote", "Pucallpa", "Juliaca", "Ica", "Ayacucho", "Cajamarca",
    "Sullana", "Tarapoto", "Huánuco", "Puno", "Tumbes", "Talara", "Paita", "Chincha Alta",
    "Huaraz", "Jaén", "Puerto Maldonado", "Moyobamba", "Cerro de Pasco", "Abancay",
    "Moquegua", "Huacho", "Barranca", "Chulucanas", "Ferreñafe", "Lambayeque"
  ],
  PR: [ // Puerto Rico
    "San Juan", "Bayamón", "Carolina", "Ponce", "Caguas", "Guaynabo", "Mayagüez",
    "Trujillo Alto", "Arecibo", "Fajardo", "Vega Baja", "Humacao", "Aguadilla",
    "Cayey", "Toa Baja", "Manatí", "Yauco", "Coamo", "Isabela", "San Germán"
  ],
  DO: [ // República Dominicana
    "Santo Domingo", "Santiago de los Caballeros", "Santo Domingo Este", "Santo Domingo Norte",
    "San Pedro de Macorís", "La Romana", "Los Alcarrizos", "San Cristóbal", "Puerto Plata",
    "San Francisco de Macorís", "Higüey", "La Vega", "Moca", "Bonao", "Baní", "Azua",
    "Mao", "San Juan de la Maguana", "Cotuí", "Barahona", "Nagua", "Esperanza"
  ],
  UY: [ // Uruguay
    "Montevideo", "Salto", "Ciudad de la Costa", "Paysandú", "Las Piedras", "Rivera",
    "Maldonado", "Tacuarembó", "Melo", "Mercedes", "Artigas", "Minas", "San José de Mayo",
    "Durazno", "Florida", "Treinta y Tres", "Rocha", "Colonia del Sacramento",
    "Punta del Este", "Carmelo", "Fray Bentos", "Trinidad", "Canelones"
  ],
  VE: [ // Venezuela
    "Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana",
    "Barcelona", "Maturín", "San Cristóbal", "Ciudad Bolívar", "Barinas", "Cumaná",
    "Mérida", "Puerto La Cruz", "Petare", "Turmero", "Los Teques", "Punto Fijo",
    "Guarenas", "Guatire", "Acarigua", "Cabimas", "Coro", "Los Guayos", "Puerto Cabello",
    "Valera", "San Felipe", "El Tigre", "La Victoria", "Guacara", "Carúpano"
  ],
  DE: [ // Alemania
    "Berlín", "Hamburgo", "Múnich", "Colonia", "Frankfurt", "Stuttgart", "Düsseldorf",
    "Leipzig", "Dortmund", "Essen", "Bremen", "Dresde", "Hanover", "Núremberg",
    "Duisburgo", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Mannheim",
    "Karlsruhe", "Augsburgo", "Wiesbaden", "Mönchengladbach", "Gelsenkirchen", "Aquisgrán",
    "Braunschweig", "Kiel", "Chemnitz", "Halle", "Magdeburgo", "Freiburg", "Krefeld",
    "Mainz", "Lübeck", "Erfurt", "Oberhausen", "Rostock", "Kassel", "Hagen", "Potsdam"
  ],
  FR: [ // Francia
    "París", "Marsella", "Lyon", "Toulouse", "Niza", "Nantes", "Estrasburgo", "Montpellier",
    "Burdeos", "Lille", "Rennes", "Reims", "Saint-Étienne", "Toulon", "Le Havre",
    "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Aix-en-Provence", "Clermont-Ferrand",
    "Le Mans", "Brest", "Tours", "Amiens", "Limoges", "Annecy", "Perpiñán", "Besanzón",
    "Orleans", "Metz", "Rouen", "Mulhouse", "Caen", "Nancy", "Aviñón", "Cannes", "Antibes"
  ],
  GB: [ // Reino Unido
    "Londres", "Birmingham", "Leeds", "Glasgow", "Sheffield", "Bradford", "Manchester",
    "Liverpool", "Bristol", "Wakefield", "Cardiff", "Coventry", "Nottingham", "Leicester",
    "Sunderland", "Belfast", "Brighton", "Hull", "Plymouth", "Stoke-on-Trent", "Wolverhampton",
    "Derby", "Southampton", "Newcastle", "Portsmouth", "York", "Oxford", "Cambridge",
    "Edimburgo", "Aberdeen", "Dundee", "Inverness", "Swansea", "Newport", "Bath"
  ],
  IT: [ // Italia
    "Roma", "Milán", "Nápoles", "Turín", "Palermo", "Génova", "Bolonia", "Florencia",
    "Bari", "Catania", "Venecia", "Verona", "Mesina", "Padua", "Trieste", "Brescia",
    "Taranto", "Parma", "Prato", "Módena", "Reggio Calabria", "Reggio Emilia", "Perugia",
    "Livorno", "Rávena", "Cagliari", "Foggia", "Rímini", "Salerno", "Ferrara", "Sassari",
    "Siracusa", "Pescara", "Monza", "Bérgamo", "Forlì", "Vicenza", "Trento", "Terni"
  ],
  PT: [ // Portugal
    "Lisboa", "Oporto", "Amadora", "Braga", "Setúbal", "Coímbra", "Queluz", "Funchal",
    "Cacém", "Vila Nova de Gaia", "Loures", "Almada", "Guimarães", "Odivelas", "Seixal",
    "Évora", "Faro", "Aveiro", "Viseu", "Leiria", "Santarém", "Beja", "Castelo Branco",
    "Viana do Castelo", "Bragança", "Portalegre", "Guarda", "Vila Real", "Ponta Delgada"
  ],
  JP: [ // Japón
    "Tokio", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kioto",
    "Kawasaki", "Saitama", "Hiroshima", "Sendai", "Chiba", "Kitakyushu", "Sakai",
    "Niigata", "Hamamatsu", "Shizuoka", "Sagamihara", "Okayama", "Kumamoto", "Kagoshima",
    "Funabashi", "Hachioji", "Matsuyama", "Higashiosaka", "Kawaguchi", "Himeji"
  ],
  CN: [ // China
    "Shanghái", "Pekín", "Cantón", "Shenzhen", "Tianjin", "Wuhan", "Dongguan", "Chengdu",
    "Foshan", "Chongqing", "Nanjing", "Shenyang", "Hangzhou", "Xi'an", "Harbin",
    "Suzhou", "Qingdao", "Dalian", "Zhengzhou", "Jinan", "Changsha", "Kunming",
    "Taiyuan", "Xiamen", "Nanchang", "Hefei", "Shijiazhuang", "Fuzhou", "Changchun",
    "Ürümqi", "Nanning", "Guiyang", "Lanzhou", "Ningbo", "Wuxi", "Wenzhou"
  ],
  KR: [ // Corea del Sur
    "Seúl", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Ulsan", "Suwon",
    "Changwon", "Seongnam", "Goyang", "Yongin", "Bucheon", "Ansan", "Anyang",
    "Cheongju", "Jeonju", "Cheonan", "Namyangju", "Hwaseong", "Jeju"
  ],
  IN: [ // India
    "Bombay", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Calcuta",
    "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
    "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra",
    "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad"
  ],
  AU: [ // Australia
    "Sídney", "Melbourne", "Brisbane", "Perth", "Adelaida", "Gold Coast", "Newcastle",
    "Canberra", "Sunshine Coast", "Wollongong", "Hobart", "Geelong", "Townsville",
    "Cairns", "Darwin", "Toowoomba", "Ballarat", "Bendigo", "Albury", "Launceston"
  ],
  CA: [ // Canadá
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg",
    "Mississauga", "Quebec", "Hamilton", "Brampton", "Surrey", "Laval", "Halifax",
    "London", "Markham", "Vaughan", "Gatineau", "Saskatoon", "Longueuil", "Kitchener",
    "Burnaby", "Windsor", "Regina", "Richmond", "Richmond Hill", "Oakville", "Burlington"
  ],
  RU: [ // Rusia
    "Moscú", "San Petersburgo", "Novosibirsk", "Ekaterimburgo", "Kazán", "Nizhni Nóvgorod",
    "Cheliábinsk", "Samara", "Omsk", "Rostov del Don", "Ufá", "Krasnoyarsk", "Perm",
    "Vorónezh", "Volgogrado", "Krasnodar", "Saratov", "Tiumen", "Tolyatti", "Izhevsk",
    "Barnaul", "Uliánovsk", "Irkutsk", "Jabárovsk", "Yaroslavl", "Vladivostok", "Majachkalá"
  ],
  ZA: [ // Sudáfrica
    "Johannesburgo", "Ciudad del Cabo", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein",
    "East London", "Vereeniging", "Pietermaritzburg", "Polokwane", "Nelspruit", "Kimberley",
    "Rustenburg", "George", "Stellenbosch", "Worcester", "Welkom", "Klerksdorp"
  ]
};

// Nombres de países por código
const countryNames = {
  AR: "Argentina", BO: "Bolivia", BR: "Brasil", CL: "Chile", CO: "Colombia",
  CR: "Costa Rica", CU: "Cuba", EC: "Ecuador", SV: "El Salvador", ES: "España",
  US: "Estados Unidos", GT: "Guatemala", HN: "Honduras", MX: "México", NI: "Nicaragua",
  PA: "Panamá", PY: "Paraguay", PE: "Perú", PR: "Puerto Rico", DO: "República Dominicana",
  UY: "Uruguay", VE: "Venezuela", DE: "Alemania", FR: "Francia", GB: "Reino Unido",
  IT: "Italia", PT: "Portugal", JP: "Japón", CN: "China", KR: "Corea del Sur",
  IN: "India", AU: "Australia", CA: "Canadá", RU: "Rusia", ZA: "Sudáfrica"
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get("country");

  if (!countryCode) {
    // Retornar lista de países disponibles
    const countries = Object.entries(countryNames).map(([code, name]) => ({
      code,
      name
    })).sort((a, b) => a.name.localeCompare(b.name));
    
    return NextResponse.json({ countries });
  }

  const cities = citiesByCountry[countryCode.toUpperCase()];
  
  if (!cities) {
    return NextResponse.json(
      { error: "País no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ 
    country: countryNames[countryCode.toUpperCase()],
    countryCode: countryCode.toUpperCase(),
    cities: cities.sort((a, b) => a.localeCompare(b))
  });
}
