'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Sun, Droplet, Sprout, TriangleAlert, CloudRain, Snowflake, Leaf, Search } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

const AdvisoryScene = lazy(() => import('@/components/3d/AdvisoryScene').then(mod => ({ default: mod.AdvisoryScene })));

type CropStage = 'seedling' | 'vegetative' | 'flowering' | 'harvest';

type SupplierOption = {
  label: string;
  url: string;
};

type LandParamsResponse = {
  source: 'gemma' | 'fallback';
  location: {
    nearestPlace: string;
    state: string;
    lat: number;
    lon: number;
    searchedPlace: string | null;
    matchType: 'dataset' | 'geocoded' | 'nearest';
  };
  climate: {
    zone: string;
    typicalTempBandC: string;
    rainfallPattern: string;
    sowingWindowHint: string;
  };
  weather: {
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
  soilType: string;
  fertilizerRecommendation: string;
  fertilizerBySoilType: Record<string, string>;
  places: Array<{
    soilType: string;
  }>;
};

function iconForCondition(condition: string) {
  const value = condition.toLowerCase();
  if (value.includes('rain') || value.includes('drizzle') || value.includes('thunder')) {
    return CloudRain;
  }
  if (value.includes('snow')) {
    return Snowflake;
  }
  return Sun;
}

function getIrrigationPlan(
  soilType: string,
  cropStage: CropStage,
  weather: LandParamsResponse['weather'] | null
): {
  scheduleLabel: string;
  summary: string;
  recommendation: string;
} {
  const soil = soilType.toLowerCase();
  const currentTemp = weather?.current.temperatureC ?? 28;
  const humidity = weather?.current.humidity ?? 65;
  const precipitation = weather?.current.precipitationMm ?? 0;
  const forecast = weather?.forecast ?? [];

  const nextThreeDays = forecast.slice(0, 3);
  const maxRainChance = nextThreeDays.length > 0 ? Math.max(...nextThreeDays.map((item) => item.rainChance)) : 0;

  const stageBaseIntervalDays: Record<CropStage, number> = {
    seedling: 2,
    vegetative: 3,
    flowering: 2,
    harvest: 4,
  };

  let intervalDays = stageBaseIntervalDays[cropStage];
  let depth = 'moderate soak';

  if (soil.includes('sandy')) {
    intervalDays = Math.max(1, intervalDays - 1);
    depth = 'light and frequent irrigation';
  } else if (soil.includes('clay') || soil.includes('alluvial')) {
    intervalDays = intervalDays + 1;
    depth = 'deep soak with longer gap';
  } else if (soil.includes('black')) {
    depth = 'deep irrigation with drainage check';
  }

  if (maxRainChance >= 70 || precipitation >= 4) {
    intervalDays = Math.min(6, intervalDays + 2);
  } else if (currentTemp >= 34 && humidity < 55) {
    intervalDays = Math.max(1, intervalDays - 1);
  }

  const scheduledDay = forecast[intervalDays - 1]?.dayLabel ?? `Day ${intervalDays}`;
  const recommendation =
    maxRainChance >= 70
      ? `Rain probability is high (${maxRainChance}%) for the next 3 days. Hold irrigation and reassess on ${scheduledDay}.`
      : `Plan ${depth} on ${scheduledDay}, preferably between 5:30 AM and 7:30 AM to reduce evaporative loss.`;

  return {
    scheduleLabel: `Scheduled: ${scheduledDay}`,
    summary: `Soil: ${soilType} | Stage: ${cropStage}`,
    recommendation,
  };
}

function buildSupplierOptions(soilType: string, locationLabel: string): SupplierOption[] {
  const query = encodeURIComponent(`${soilType} fertilizer ${locationLabel} India`);

  return [
    { label: 'IFFCO eBazar', url: `https://www.iffcoebazar.in/search?q=${query}` },
    { label: 'BigHaat', url: `https://www.bighaat.com/search?q=${query}` },
    { label: 'AgriBegri', url: `https://agribegri.com/search?query=${query}` },
  ];
}

type AdvisoryText = {
  title: string;
  subtitle: string;
  healthySoil: string;
  highYield: string;
  landParameters: string;
  soilType: string;
  location: string;
  cropStage: string;
  searchPlace: string;
  searchLocation: string;
  seedling: string;
  vegetative: string;
  flowering: string;
  harvest: string;
  analyzing: string;
  dataSource: string;
  gemmaSource: string;
  fallbackSource: string;
  climateProfile: string;
  tempBand: string;
  rainPattern: string;
  weatherClimate: string;
  currentConditions: string;
  humidity: string;
  rain: string;
  wind: string;
  unavailable: string;
  forecastUnavailable: string;
  weatherSource: string;
  weatherSourceLive: string;
  stageModel: string;
  lifecycle: string;
  rendering: string;
  growthProgress: string;
  optimalIrrigation: string;
  fertilizerAlert: string;
  actionRequired: string;
  dismiss: string;
  chooseSupplier: string;
  orderSupplies: string;
};

function getAdvisoryText(language: string): AdvisoryText {
  if (language === 'hi') {
    return {
      title: 'सलाह डैशबोर्ड',
      subtitle: 'आपके फसल चक्र के लिए सटीक अंतर्दृष्टि।',
      healthySoil: 'स्वस्थ मिट्टी',
      highYield: 'उच्च उपज क्षमता',
      landParameters: 'भूमि पैरामीटर',
      soilType: 'मिट्टी का प्रकार',
      location: 'स्थान',
      cropStage: 'फसल चरण',
      searchPlace: 'भारत में स्थान खोजें',
      searchLocation: 'स्थान खोजें',
      seedling: 'अंकुर',
      vegetative: 'मध्य-विकास',
      flowering: 'फूल अवस्था',
      harvest: 'पूर्व-कटाई',
      analyzing: 'स्थानीय भूमि पैरामीटर का विश्लेषण हो रहा है...',
      dataSource: 'डेटा स्रोत',
      gemmaSource: 'Gemma-जनित स्थान जानकारी',
      fallbackSource: 'फॉलबैक क्षेत्रीय डेटासेट',
      climateProfile: 'भारत जलवायु प्रोफ़ाइल',
      tempBand: 'तापमान सीमा',
      rainPattern: 'वर्षा पैटर्न',
      weatherClimate: 'मौसम और जलवायु',
      currentConditions: 'वर्तमान स्थिति',
      humidity: 'आर्द्रता',
      rain: 'बारिश',
      wind: 'हवा',
      unavailable: 'उपलब्ध नहीं',
      forecastUnavailable: 'इस स्थान के लिए मौसम पूर्वानुमान उपलब्ध नहीं है।',
      weatherSource: 'मौसम स्रोत',
      weatherSourceLive: 'Open-Meteo लाइव API',
      stageModel: 'V4 चरण मॉडल',
      lifecycle: 'इंटरैक्टिव 3D लाइफसाइकिल प्रोजेक्शन',
      rendering: '3D दृश्य लोड हो रहा है...',
      growthProgress: 'विकास प्रगति',
      optimalIrrigation: 'उत्तम सिंचाई',
      fertilizerAlert: 'उर्वरक अलर्ट',
      actionRequired: 'कार्रवाई आवश्यक',
      dismiss: 'बंद करें',
      chooseSupplier: 'सप्लायर वेबसाइट चुनें',
      orderSupplies: 'सामग्री ऑर्डर करें',
    };
  }

  if (language === 'bn') {
    return {
      title: 'পরামর্শ ড্যাশবোর্ড',
      subtitle: 'আপনার ফসল চক্রের জন্য নির্ভুল ইনসাইট।',
      healthySoil: 'স্বাস্থ্যকর মাটি',
      highYield: 'উচ্চ ফলনের সম্ভাবনা',
      landParameters: 'ভূমির প্যারামিটার',
      soilType: 'মাটির ধরন',
      location: 'অবস্থান',
      cropStage: 'ফসলের ধাপ',
      searchPlace: 'ভারতে স্থান খুঁজুন',
      searchLocation: 'স্থান খুঁজুন',
      seedling: 'চারা',
      vegetative: 'মধ্য-উদ্ভিজ্জ',
      flowering: 'ফুল ধাপ',
      harvest: 'ফসল-পূর্ব',
      analyzing: 'স্থানীয় ভূমি প্যারামিটার বিশ্লেষণ হচ্ছে...',
      dataSource: 'ডেটা সোর্স',
      gemmaSource: 'Gemma-জেনারেটেড স্থান তথ্য',
      fallbackSource: 'ফলব্যাক আঞ্চলিক ডেটাসেট',
      climateProfile: 'ভারত জলবায়ু প্রোফাইল',
      tempBand: 'তাপমাত্রার সীমা',
      rainPattern: 'বৃষ্টির ধরণ',
      weatherClimate: 'আবহাওয়া ও জলবায়ু',
      currentConditions: 'বর্তমান অবস্থা',
      humidity: 'আর্দ্রতা',
      rain: 'বৃষ্টি',
      wind: 'বাতাস',
      unavailable: 'অনুপস্থিত',
      forecastUnavailable: 'এই স্থানের জন্য আবহাওয়ার পূর্বাভাস পাওয়া যায়নি।',
      weatherSource: 'আবহাওয়ার উৎস',
      weatherSourceLive: 'Open-Meteo লাইভ API',
      stageModel: 'V4 ধাপ মডেল',
      lifecycle: 'ইন্টারঅ্যাকটিভ 3D লাইফসাইকেল প্রজেকশন',
      rendering: '3D ভিজ্যুয়াল রেন্ডার হচ্ছে...',
      growthProgress: 'বৃদ্ধির অগ্রগতি',
      optimalIrrigation: 'উত্তম সেচ',
      fertilizerAlert: 'সার সতর্কতা',
      actionRequired: 'তাৎক্ষণিক পদক্ষেপ',
      dismiss: 'বন্ধ করুন',
      chooseSupplier: 'সাপ্লায়ার ওয়েবসাইট বাছাই করুন',
      orderSupplies: 'সরঞ্জাম অর্ডার করুন',
    };
  }

  return {
    title: 'Advisory Dashboard',
    subtitle: 'Precision insights for your harvest cycle.',
    healthySoil: 'Healthy Soil',
    highYield: 'High Yield Potential',
    landParameters: 'Land Parameters',
    soilType: 'Soil Type',
    location: 'Location',
    cropStage: 'Crop Stage',
    searchPlace: 'Search place in India',
    searchLocation: 'Search location',
    seedling: 'Seedling',
    vegetative: 'Mid-Vegetative',
    flowering: 'Flowering',
    harvest: 'Pre-Harvest',
    analyzing: 'Analyzing local land parameters...',
    dataSource: 'Data Source',
    gemmaSource: 'Gemma-generated place intelligence',
    fallbackSource: 'Fallback regional dataset',
    climateProfile: 'India Climate Profile',
    tempBand: 'Temp Band',
    rainPattern: 'Rain Pattern',
    weatherClimate: 'Weather and Climate',
    currentConditions: 'Current Conditions',
    humidity: 'Humidity',
    rain: 'Rain',
    wind: 'Wind',
    unavailable: 'Unavailable',
    forecastUnavailable: 'Weather forecast unavailable for this location.',
    weatherSource: 'Weather Source',
    weatherSourceLive: 'Open-Meteo live API',
    stageModel: 'V4 Stage Model',
    lifecycle: 'Interactive 3D Lifecycle Projection',
    rendering: 'Rendering Organics...',
    growthProgress: 'Growth Progress',
    optimalIrrigation: 'Optimal Irrigation',
    fertilizerAlert: 'Fertilizer Alert',
    actionRequired: 'Action Required',
    dismiss: 'Dismiss',
    chooseSupplier: 'Choose supplier website',
    orderSupplies: 'Order Supplies',
  };
}

export default function AdvisoryPage() {
  const { language } = useLanguage();
  const text = getAdvisoryText(language);
  const [cropStage, setCropStage] = useState<CropStage>('vegetative');
  const [soilType, setSoilType] = useState('Detecting...');
  const [locationLabel, setLocationLabel] = useState('Detecting current location...');
  const [fertilizerRecommendation, setFertilizerRecommendation] = useState('Loading fertilizer guidance...');
  const [soilOptions, setSoilOptions] = useState<string[]>(['Loamy Clay (Optimal)', 'Sandy Loam', 'Peat Soil']);
  const [fertilizerMap, setFertilizerMap] = useState<Record<string, string>>({});
  const [isLoadingLandData, setIsLoadingLandData] = useState(true);
  const [dataSource, setDataSource] = useState<'gemma' | 'fallback' | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [placeSearch, setPlaceSearch] = useState('');
  const [searchNonce, setSearchNonce] = useState(0);
  const [weatherData, setWeatherData] = useState<LandParamsResponse['weather'] | null>(null);
  const [climateData, setClimateData] = useState<LandParamsResponse['climate'] | null>(null);
  const [selectedSupplierUrl, setSelectedSupplierUrl] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLabel('Location unavailable on this browser');
      setIsLoadingLandData(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        setLocationLabel('Location permission denied (using India fallback data)');
        setCoords(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLandParameters = async () => {
      setIsLoadingLandData(true);

      try {
        const response = await fetch('/api/land-parameters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: coords?.lat,
            lon: coords?.lon,
            cropStage,
            searchPlace: placeSearch.trim() || undefined,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Unable to fetch land parameters');
        }

        const data = (await response.json()) as LandParamsResponse;
        setDataSource(data.source);
        setSoilType(data.soilType);
        setLocationLabel(`${data.location.nearestPlace}, ${data.location.state}`);
        setFertilizerRecommendation(data.fertilizerRecommendation);
        setFertilizerMap(data.fertilizerBySoilType ?? {});
        setWeatherData(data.weather ?? null);
        setClimateData(data.climate ?? null);

        const uniqueSoils = Array.from(new Set(data.places.map((place) => place.soilType)));
        if (uniqueSoils.length > 0) {
          setSoilOptions(uniqueSoils);
        }
      } catch {
        setLocationLabel('India region data (fallback mode)');
        setFertilizerRecommendation('Use balanced NPK in split doses and validate with a local soil test.');
        setWeatherData(null);
        setClimateData(null);
      } finally {
        setIsLoadingLandData(false);
      }
    };

    fetchLandParameters();

    return () => controller.abort();
  }, [coords, cropStage, searchNonce]);

  useEffect(() => {
    if (fertilizerMap[soilType]) {
      setFertilizerRecommendation(fertilizerMap[soilType]);
    }
  }, [soilType, fertilizerMap]);

  const forecastRows = weatherData?.forecast?.slice(0, 4) ?? [];
  const CurrentWeatherIcon = iconForCondition(weatherData?.current.condition ?? '');
  const humidity = weatherData?.current.humidity;
  const topRainChance = forecastRows.length > 0 ? Math.max(...forecastRows.map((item) => item.rainChance)) : 0;
  const weatherAlert = humidity && humidity >= 80
    ? language === 'hi'
      ? 'आपके चुने हुए स्थान में आर्द्रता अधिक है। फफूंद रोग जोखिम पर नज़र रखें और देर शाम सिंचाई से बचें।'
      : language === 'bn'
        ? 'আপনার নির্বাচিত স্থানে আর্দ্রতা বেশি। ছত্রাকজনিত ঝুঁকি নজরে রাখুন এবং সন্ধ্যায় সেচ এড়িয়ে চলুন।'
        : 'High humidity in your selected location. Monitor fungal disease pressure and avoid late-evening irrigation.'
    : topRainChance >= 70
      ? language === 'hi'
        ? 'आने वाले दिनों में अधिक वर्षा की संभावना है। पोषक तत्व हानि कम करने के लिए उर्वरक को विभाजित खुराक में दें।'
        : language === 'bn'
          ? 'আগামী দিনে বৃষ্টির সম্ভাবনা বেশি। পুষ্টি ক্ষতি কমাতে ভাগ করে সার প্রয়োগ করুন।'
          : 'High rainfall probability in the upcoming days. Plan fertilizer split applications to reduce nutrient loss.'
      : language === 'hi'
        ? 'मौसम जोखिम मध्यम है। नियमित निगरानी और सिंचाई अनुसूची बनाए रखें।'
        : language === 'bn'
          ? 'আবহাওয়ার ঝুঁকি মাঝারি। নিয়মিত নজরদারি ও সেচ সূচি বজায় রাখুন।'
          : 'Weather risk is moderate. Maintain regular scouting and irrigation schedule.';

  const irrigationPlan = getIrrigationPlan(soilType, cropStage, weatherData);
  const supplierOptions = buildSupplierOptions(soilType, locationLabel);
  const activeSupplierUrl = selectedSupplierUrl || supplierOptions[0]?.url || '#';
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full pb-4 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{text.title}</h1>
            <p className="text-muted-foreground mt-1">{text.subtitle}</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
              {text.healthySoil}
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
              {text.highYield}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Panel: Inputs & Metrics */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            
            {/* Input Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-primary" />
                <span>{text.landParameters}</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{text.soilType}</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full bg-secondary/50 border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
                  >
                    {Array.from(new Set([soilType, ...soilOptions])).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{text.location}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={placeSearch}
                        onChange={(e) => setPlaceSearch(e.target.value)}
                        placeholder={text.searchPlace}
                        className="w-full bg-secondary/50 border border-white/5 rounded-lg py-2.5 px-3 text-sm text-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setSearchNonce((prev) => prev + 1)}
                        className="inline-flex items-center justify-center rounded-lg px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        aria-label={text.searchLocation}
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                    <input type="text" value={locationLabel} className="mt-2 w-full bg-secondary/50 border border-white/5 rounded-lg py-2.5 px-3 text-sm text-foreground" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{text.cropStage}</label>
                    <select 
                      value={cropStage}
                      onChange={(e) => setCropStage(e.target.value as CropStage)}
                      className="w-full bg-secondary/50 border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    >
                      <option value="seedling">{text.seedling}</option>
                      <option value="vegetative">{text.vegetative}</option>
                      <option value="flowering">{text.flowering}</option>
                      <option value="harvest">{text.harvest}</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isLoadingLandData ? text.analyzing : `${text.dataSource}: ${dataSource === 'gemma' ? text.gemmaSource : text.fallbackSource}`}
                </p>
                {climateData && (
                  <div className="rounded-lg border border-white/10 bg-secondary/40 p-3">
                    <p className="text-xs font-semibold text-foreground">{text.climateProfile}: {climateData.zone}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{text.tempBand}: {climateData.typicalTempBandC}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{text.rainPattern}: {climateData.rainfallPattern}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Weather Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">{text.weatherClimate}</h3>
                <CurrentWeatherIcon className="w-5 h-5 text-amber-500" />
              </div>

              <div className="mb-4 rounded-xl border border-white/10 bg-secondary/40 p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{text.currentConditions}</p>
                <p className="mt-1 text-lg font-semibold">
                  {weatherData?.current.temperatureC !== null && weatherData?.current.temperatureC !== undefined
                    ? `${Math.round(weatherData.current.temperatureC)}C`
                    : text.unavailable}
                  <span className="ml-2 text-sm font-medium text-muted-foreground">{weatherData?.current.condition ?? text.unavailable}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {text.humidity}: {weatherData?.current.humidity ?? text.unavailable}% | {text.rain}: {weatherData?.current.precipitationMm ?? text.unavailable} mm | {text.wind}: {weatherData?.current.windSpeedKmph ?? text.unavailable} km/h
                </p>
              </div>
              
              <div className="flex justify-between items-center text-center">
                {forecastRows.length > 0 ? (
                  forecastRows.map((day, index) => {
                    const DayIcon = iconForCondition(day.condition);
                    return (
                      <div key={`${day.date}-${day.dayLabel}`} className={`flex flex-col items-center ${index === 1 ? 'bg-primary/10 rounded-xl px-4 py-2 ring-1 ring-primary/20' : ''}`}>
                        <span className={`mb-2 text-xs font-semibold ${index === 1 ? 'font-bold text-primary' : 'text-muted-foreground'}`}>{day.dayLabel}</span>
                        <DayIcon className={`mb-1 h-5 w-5 ${day.condition.toLowerCase().includes('rain') ? 'text-blue-400' : 'text-amber-500'}`} />
                        <span className={`text-sm font-bold ${index === 1 ? 'text-primary' : ''}`}>{day.maxC}C/{day.minC}C</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">{text.forecastUnavailable}</p>
                )}
              </div>

              <div className="mt-6 p-3 rounded-xl bg-destructive/10 flex items-start space-x-3">
                <TriangleAlert className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-destructive/90 font-medium italic">{weatherAlert}</p>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">{text.weatherSource}: {weatherData?.source === 'open-meteo' ? text.weatherSourceLive : text.unavailable}</p>
            </motion.div>
          </div>

          {/* Right Panel: Visualization & Actions */}
          <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6">
            
            {/* 3D Visualizer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-grow w-full h-[400px] lg:h-[450px] relative rounded-3xl overflow-hidden glass-panel border border-white/5"
            >
              {/* Overlay texts */}
              <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <h2 className="text-2xl font-bold drop-shadow-md">{text.stageModel}</h2>
                <p className="text-sm text-foreground/80 font-medium">{text.lifecycle}</p>
              </div>

              <div className="absolute top-6 right-6 z-10 flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-background/50 backdrop-blur border border-white/10 flex items-center justify-center cursor-pointer hover:bg-background/80 transition-colors">
                  <span className="text-xs font-bold leading-none select-none">3D</span>
                </div>
              </div>

              {/* Suspense Wrapper for 3D logic */}
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 absolute inset-0">
                  <div className="animate-pulse flex flex-col items-center text-primary/50">
                    <Sprout className="w-10 h-10 mb-4 animate-bounce" />
                    <span>{text.rendering}</span>
                  </div>
                </div>
              }>
                <AdvisoryScene cropStage={cropStage} />
              </Suspense>

              {/* Progress Bar Overlay */}
              <div className="absolute bottom-6 right-6 z-10 w-48 bg-background/60 backdrop-blur-md p-3 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{text.growthProgress}</span>
                  <span className="text-xs font-bold text-primary">64%</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[64%] rounded-full shadow-[0_0_10px_rgba(76,175,80,0.5)]" />
                </div>
              </div>
            </motion.div>

            {/* Recommendations Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-5 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-lg mb-1">{text.optimalIrrigation}</h4>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-3">{irrigationPlan.scheduleLabel}</p>
                  <p className="text-xs text-primary font-semibold mb-2">{irrigationPlan.summary}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{irrigationPlan.recommendation}</p>
                </div>
                <button className="mt-4 w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-semibold transition-colors">{text.dismiss}</button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-5 rounded-2xl border-l-[3px] border-amber-500 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-lg mb-1">{text.fertilizerAlert}</h4>
                  <p className="text-xs text-amber-600 dark:text-amber-500 uppercase font-bold tracking-wider mb-3">{text.actionRequired}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{fertilizerRecommendation}</p>
                </div>
                <div className="mt-4 space-y-2">
                  <select
                    value={selectedSupplierUrl}
                    onChange={(event) => setSelectedSupplierUrl(event.target.value)}
                    className="w-full bg-secondary/50 border border-white/5 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-foreground"
                  >
                    <option value="">{text.chooseSupplier}</option>
                    {supplierOptions.map((supplier) => (
                      <option key={supplier.label} value={supplier.url}>{supplier.label}</option>
                    ))}
                  </select>
                  <a
                    href={activeSupplierUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-center text-white shadow-lg shadow-amber-500/20 text-sm font-semibold transition-colors"
                  >
                    {text.orderSupplies}
                  </a>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
