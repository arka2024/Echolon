import { NextResponse } from 'next/server';

type CropStage = 'seedling' | 'vegetative' | 'flowering' | 'harvest';

type FarmingPlace = {
  name: string;
  state: string;
  lat: number;
  lon: number;
  soilType: string;
};

type ClimateSettings = {
  zone: string;
  typicalTempBandC: string;
  rainfallPattern: string;
  sowingWindowHint: string;
};

type WeatherSummary = {
  source: 'open-meteo' | 'unavailable';
  current: {
    temperatureC: number | null;
    humidity: number | null;
    precipitationMm: number | null;
    windSpeedKmph: number | null;
    condition: string;
  };
  forecast: Array<{
    date: string;
    dayLabel: string;
    maxC: number;
    minC: number;
    rainChance: number;
    condition: string;
  }>;
};

type LandParamsRequest = {
  lat?: number;
  lon?: number;
  cropStage?: CropStage;
  searchPlace?: string;
};

const FALLBACK_FARMING_PLACES: FarmingPlace[] = [
  { name: 'Ludhiana', state: 'Punjab', lat: 30.901, lon: 75.8573, soilType: 'Alluvial Loam' },
  { name: 'Hisar', state: 'Haryana', lat: 29.1492, lon: 75.7217, soilType: 'Sandy Loam' },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882, soilType: 'Black Cotton Soil' },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, soilType: 'Black Soil' },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, soilType: 'Red Loam' },
  { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lon: 76.6394, soilType: 'Laterite Soil' },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, soilType: 'Alluvial Clay' },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lon: 85.1376, soilType: 'Gangetic Alluvial' },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lon: 91.7362, soilType: 'Acidic Alluvial' },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, soilType: 'Sandy Soil' },
];

const fertilizerBySoilAndStage: Record<string, Partial<Record<CropStage, string>>> = {
  'Alluvial Loam': {
    seedling: 'Apply DAP 50 kg/ha + Zinc Sulphate 10 kg/ha for root establishment.',
    vegetative: 'Use NPK 20-20-0 at 80 kg/ha and split urea doses weekly.',
    flowering: 'Apply NPK 12-32-16 at 60 kg/ha with Boron spray 0.2%.',
    harvest: 'Use Potash-rich mix (MOP 40 kg/ha) to improve grain/fruit filling.',
  },
  'Black Cotton Soil': {
    seedling: 'Apply SSP 80 kg/ha with compost 2 tons/ha to improve phosphorus uptake.',
    vegetative: 'Use Urea 60 kg/ha + MOP 25 kg/ha in two split applications.',
    flowering: 'Spray 1% KNO3 and apply NPK 10-26-26 at 50 kg/ha.',
    harvest: 'Reduce nitrogen and maintain potash support with MOP 30 kg/ha.',
  },
  'Red Loam': {
    seedling: 'Apply farmyard manure 3 tons/ha + NPK starter 12-32-16 at 40 kg/ha.',
    vegetative: 'Use Urea 50 kg/ha + SSP 50 kg/ha and maintain moisture.',
    flowering: 'Apply NPK 19-19-19 foliar spray + Boron 0.1%.',
    harvest: 'Use SOP-based potassium supplement for quality and shelf life.',
  },
  default: {
    seedling: 'Use balanced NPK 12-32-16 at 40-50 kg/ha with organic compost.',
    vegetative: 'Use NPK 20-20-0 at 60-80 kg/ha in split doses.',
    flowering: 'Increase phosphorus and potassium using NPK 10-26-26 at 50-60 kg/ha.',
    harvest: 'Reduce nitrogen, maintain potassium and micronutrients for quality output.',
  },
};

const climateByState: Record<string, ClimateSettings> = {
  Punjab: {
    zone: 'Sub-tropical Continental',
    typicalTempBandC: '7C to 42C',
    rainfallPattern: 'Monsoon-dominant (Jul-Sep), dry winters',
    sowingWindowHint: 'Kharif sowing around Jun-Jul after first effective rainfall',
  },
  Haryana: {
    zone: 'Semi-arid to Sub-tropical',
    typicalTempBandC: '6C to 43C',
    rainfallPattern: 'Monsoon concentrated with high inter-annual variability',
    sowingWindowHint: 'Use rainfall onset and soil moisture before broadcast',
  },
  Maharashtra: {
    zone: 'Tropical Wet and Dry',
    typicalTempBandC: '15C to 40C',
    rainfallPattern: 'Strong SW monsoon, long dry spells in rain-shadow belts',
    sowingWindowHint: 'Prefer short-duration varieties in low-rainfall districts',
  },
  'Madhya Pradesh': {
    zone: 'Sub-humid Monsoonal',
    typicalTempBandC: '10C to 41C',
    rainfallPattern: 'Moderate monsoon with occasional late withdrawal',
    sowingWindowHint: 'Synchronize sowing with 2-3 consecutive rainy days',
  },
  'Tamil Nadu': {
    zone: 'Tropical Maritime',
    typicalTempBandC: '20C to 38C',
    rainfallPattern: 'NE monsoon significant (Oct-Dec), plus SW monsoon influence',
    sowingWindowHint: 'Use local monsoon calendar; Rabi planning can be NE-monsoon led',
  },
  Karnataka: {
    zone: 'Tropical Savanna',
    typicalTempBandC: '16C to 37C',
    rainfallPattern: 'Dual monsoon influence, uneven distribution',
    sowingWindowHint: 'Plan irrigation buffer for intra-season dry spells',
  },
  'West Bengal': {
    zone: 'Humid Sub-tropical',
    typicalTempBandC: '12C to 38C',
    rainfallPattern: 'High monsoon rainfall and humidity',
    sowingWindowHint: 'Focus on drainage and fungal risk control in peak monsoon',
  },
  Bihar: {
    zone: 'Humid Sub-tropical Alluvial Plains',
    typicalTempBandC: '10C to 40C',
    rainfallPattern: 'High monsoon dependence with flood pockets',
    sowingWindowHint: 'Use flood-tolerant or short-duration varieties in vulnerable blocks',
  },
  Assam: {
    zone: 'Humid Tropical',
    typicalTempBandC: '12C to 34C',
    rainfallPattern: 'Very high rainfall and long wet season',
    sowingWindowHint: 'Prioritize drainage and split nutrient applications',
  },
  Rajasthan: {
    zone: 'Arid to Semi-arid',
    typicalTempBandC: '5C to 45C',
    rainfallPattern: 'Low and erratic rainfall',
    sowingWindowHint: 'Use drought-resilient varieties and moisture conservation',
  },
  default: {
    zone: 'Indian Monsoonal Mixed Zone',
    typicalTempBandC: '10C to 40C',
    rainfallPattern: 'Monsoon-led with seasonal dry period',
    sowingWindowHint: 'Align sowing with local rainfall onset and soil moisture',
  },
};

async function fetchGemmaGeneratedPlaces(): Promise<FarmingPlace[] | null> {
  const gemmaApiUrl = process.env.GEMMA_API_URL ?? 'http://localhost:11434/api/generate';
  const gemmaModel = process.env.GEMMA_MODEL ?? 'gemma3:4b';

  try {
    const prompt = [
      'Return only JSON (no markdown).',
      'Create an array called places with exactly 10 important farming places in India.',
      'For each place include fields: name, state, lat, lon, soilType.',
      'lat/lon must be numbers. soilType must be a realistic agricultural soil class.',
      'Output schema: {"places":[{"name":"...","state":"...","lat":0,"lon":0,"soilType":"..."}] }',
    ].join(' ');

    const response = await fetch(gemmaApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: gemmaModel,
        prompt,
        stream: false,
        format: 'json',
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { response?: string };
    if (!payload.response) {
      return null;
    }

    const parsed = JSON.parse(payload.response) as { places?: FarmingPlace[] };
    if (!Array.isArray(parsed.places) || parsed.places.length === 0) {
      return null;
    }

    const valid = parsed.places.filter((item) => (
      typeof item?.name === 'string' &&
      typeof item?.state === 'string' &&
      typeof item?.soilType === 'string' &&
      typeof item?.lat === 'number' &&
      typeof item?.lon === 'number'
    ));

    return valid.length > 0 ? valid : null;
  } catch {
    return null;
  }
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function pickNearestPlace(places: FarmingPlace[], lat?: number, lon?: number): FarmingPlace {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return places[0];
  }

  let nearest = places[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const place of places) {
    const distance = haversineKm(lat, lon, place.lat, place.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = place;
    }
  }

  return nearest;
}

function resolveFertilizer(soilType: string, cropStage: CropStage): string {
  const entry = fertilizerBySoilAndStage[soilType] ?? fertilizerBySoilAndStage.default;
  return entry[cropStage] ?? fertilizerBySoilAndStage.default[cropStage] ?? 'Use a balanced NPK blend as per local agronomy guidance.';
}

function resolveClimateSettings(state: string): ClimateSettings {
  return climateByState[state] ?? climateByState.default;
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

function pickPlaceFromSearch(places: FarmingPlace[], searchPlace?: string): FarmingPlace | null {
  if (!searchPlace) {
    return null;
  }

  const query = normalizeSearchValue(searchPlace);
  if (!query) {
    return null;
  }

  return places.find((place) => (
    place.name.toLowerCase() === query ||
    place.state.toLowerCase() === query ||
    `${place.name}, ${place.state}`.toLowerCase() === query ||
    place.name.toLowerCase().includes(query) ||
    place.state.toLowerCase().includes(query)
  )) ?? null;
}

async function geocodeIndianPlace(searchPlace: string, places: FarmingPlace[]): Promise<FarmingPlace | null> {
  const query = searchPlace.trim();
  if (!query) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      name: query,
      count: '1',
      language: 'en',
      countryCode: 'IN',
      format: 'json',
    });

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      results?: Array<{ name?: string; admin1?: string; latitude?: number; longitude?: number }>;
    };

    const best = payload.results?.[0];
    if (!best || typeof best.latitude !== 'number' || typeof best.longitude !== 'number') {
      return null;
    }

    const nearestKnown = pickNearestPlace(places, best.latitude, best.longitude);

    return {
      name: best.name ?? query,
      state: best.admin1 ?? nearestKnown.state,
      lat: best.latitude,
      lon: best.longitude,
      soilType: nearestKnown.soilType,
    };
  } catch {
    return null;
  }
}

function weatherCodeToText(code: number): string {
  if (code === 0) return 'Clear';
  if ([1, 2].includes(code)) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
  if ([71, 73, 75, 77].includes(code)) return 'Snow';
  if ([80, 81, 82].includes(code)) return 'Rain showers';
  if ([85, 86].includes(code)) return 'Snow showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Variable';
}

async function fetchWeatherSummary(lat: number, lon: number): Promise<WeatherSummary> {
  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: '7',
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('weather fetch failed');
    }

    const data = (await response.json()) as {
      current?: {
        temperature_2m?: number;
        relative_humidity_2m?: number;
        precipitation?: number;
        wind_speed_10m?: number;
        weather_code?: number;
      };
      daily?: {
        time?: string[];
        weather_code?: number[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_probability_max?: number[];
      };
    };

    const forecast: WeatherSummary['forecast'] = (data.daily?.time ?? []).slice(0, 7).map((date, index) => {
      const day = new Date(date);
      const code = data.daily?.weather_code?.[index] ?? -1;

      return {
        date,
        dayLabel: day.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase(),
        maxC: Math.round(data.daily?.temperature_2m_max?.[index] ?? 0),
        minC: Math.round(data.daily?.temperature_2m_min?.[index] ?? 0),
        rainChance: Math.round(data.daily?.precipitation_probability_max?.[index] ?? 0),
        condition: weatherCodeToText(code),
      };
    });

    return {
      source: 'open-meteo',
      current: {
        temperatureC: data.current?.temperature_2m ?? null,
        humidity: data.current?.relative_humidity_2m ?? null,
        precipitationMm: data.current?.precipitation ?? null,
        windSpeedKmph: data.current?.wind_speed_10m ?? null,
        condition: weatherCodeToText(data.current?.weather_code ?? -1),
      },
      forecast,
    };
  } catch {
    return {
      source: 'unavailable',
      current: {
        temperatureC: null,
        humidity: null,
        precipitationMm: null,
        windSpeedKmph: null,
        condition: 'Unavailable',
      },
      forecast: [],
    };
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LandParamsRequest;
  const cropStage = (body.cropStage ?? 'vegetative') as CropStage;

  const generatedPlaces = await fetchGemmaGeneratedPlaces();
  const places = generatedPlaces ?? FALLBACK_FARMING_PLACES;

  const searched = pickPlaceFromSearch(places, body.searchPlace);
  const geocoded = searched ? null : (body.searchPlace ? await geocodeIndianPlace(body.searchPlace, places) : null);
  const nearest = searched ?? geocoded ?? pickNearestPlace(places, body.lat, body.lon);

  const placesForResponse = geocoded ? [...places, geocoded] : places;
  const fertilizer = resolveFertilizer(nearest.soilType, cropStage);
  const fertilizerBySoilType = Array.from(new Set(placesForResponse.map((place) => place.soilType))).reduce<Record<string, string>>(
    (acc, soil) => {
      acc[soil] = resolveFertilizer(soil, cropStage);
      return acc;
    },
    {}
  );
  const climate = resolveClimateSettings(nearest.state);
  const weather = await fetchWeatherSummary(nearest.lat, nearest.lon);

  return NextResponse.json({
    source: generatedPlaces ? 'gemma' : 'fallback',
    location: {
      nearestPlace: nearest.name,
      state: nearest.state,
      lat: nearest.lat,
      lon: nearest.lon,
      detectedLat: body.lat ?? null,
      detectedLon: body.lon ?? null,
      searchedPlace: body.searchPlace?.trim() || null,
      matchType: searched ? 'dataset' : (geocoded ? 'geocoded' : 'nearest'),
    },
    climate,
    weather,
    soilType: nearest.soilType,
    cropStage,
    fertilizerRecommendation: fertilizer,
    fertilizerBySoilType,
    places: placesForResponse,
  });
}
