import { NextResponse } from 'next/server';
import fallbackData from '@/data/market-buyers-fallback.json';

type Region = 'North' | 'South' | 'East' | 'West' | 'Central' | 'All';
type BuyerType = 'Refinery' | 'Bulk Trader' | 'FMCG' | 'Export' | 'All';

type MarketBuyer = {
  id: string;
  companyName: string;
  region: Exclude<Region, 'All'>;
  state: string;
  city: string;
  buyerType: Exclude<BuyerType, 'All'>;
  pricePerTonInr: number;
  trustIndex: number;
  rating: number;
  capacityTonsPerWeek: number;
  minimumOrderTons: number;
  preferredOilTypes: string[];
  qualityFocus: string;
  responseTimeHours: number;
  directContact: {
    enabled: boolean;
    minimumLargeQtyTons: number;
    phone: string;
    email: string;
    website: string;
  };
};

type MarketBuyersRequest = {
  region?: Region;
  buyerType?: BuyerType;
  bestOnly?: boolean;
  minTrustIndex?: number;
  quantityTons?: number;
};

function isMarketBuyer(item: unknown): item is MarketBuyer {
  if (!item || typeof item !== 'object') {
    return false;
  }

  const buyer = item as Record<string, unknown>;
  const directContact = buyer.directContact as Record<string, unknown> | undefined;

  return (
    typeof buyer.id === 'string' &&
    typeof buyer.companyName === 'string' &&
    typeof buyer.region === 'string' &&
    typeof buyer.state === 'string' &&
    typeof buyer.city === 'string' &&
    typeof buyer.buyerType === 'string' &&
    typeof buyer.pricePerTonInr === 'number' &&
    typeof buyer.trustIndex === 'number' &&
    typeof buyer.rating === 'number' &&
    typeof buyer.capacityTonsPerWeek === 'number' &&
    typeof buyer.minimumOrderTons === 'number' &&
    Array.isArray(buyer.preferredOilTypes) &&
    typeof buyer.qualityFocus === 'string' &&
    typeof buyer.responseTimeHours === 'number' &&
    !!directContact &&
    typeof directContact.enabled === 'boolean' &&
    typeof directContact.minimumLargeQtyTons === 'number' &&
    typeof directContact.phone === 'string' &&
    typeof directContact.email === 'string' &&
    typeof directContact.website === 'string'
  );
}

function validateBuyers(items: unknown[]): MarketBuyer[] {
  return items.filter(isMarketBuyer);
}

async function fetchGemmaGeneratedBuyers(): Promise<MarketBuyer[] | null> {
  const gemmaApiUrl = process.env.GEMMA_API_URL ?? 'http://localhost:11434/api/generate';
  const gemmaModel = process.env.GEMMA_MODEL_MARKET ?? 'gemma3:3b';

  const prompt = [
    'Return only JSON with no markdown.',
    'Generate exactly 8 top edible oil buying companies in India.',
    'Keep regions limited to North, South, East, West, Central.',
    'Keep buyerType limited to Refinery, Bulk Trader, FMCG, Export.',
    'Output schema: {"buyers":[{"id":"buyer-x","companyName":"...","region":"North|South|East|West|Central","state":"...","city":"...","buyerType":"Refinery|Bulk Trader|FMCG|Export","pricePerTonInr":0,"trustIndex":0,"rating":0,"capacityTonsPerWeek":0,"minimumOrderTons":0,"preferredOilTypes":["Palm"],"qualityFocus":"...","responseTimeHours":0,"directContact":{"enabled":true,"minimumLargeQtyTons":0,"phone":"...","email":"...","website":"https://..."}}]}',
    'Use realistic values for Indian edible oil procurement context.',
  ].join(' ');

  try {
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

    const parsed = JSON.parse(payload.response) as { buyers?: unknown[] };
    if (!Array.isArray(parsed.buyers)) {
      return null;
    }

    const buyers = validateBuyers(parsed.buyers);
    return buyers.length > 0 ? buyers : null;
  } catch {
    return null;
  }
}

function applyFilters(buyers: MarketBuyer[], filters: Required<MarketBuyersRequest>): MarketBuyer[] {
  const minimumTrust = filters.bestOnly ? Math.max(8.8, filters.minTrustIndex) : filters.minTrustIndex;

  return buyers
    .filter((buyer) => filters.region === 'All' || buyer.region === filters.region)
    .filter((buyer) => filters.buyerType === 'All' || buyer.buyerType === filters.buyerType)
    .filter((buyer) => buyer.trustIndex >= minimumTrust)
    .filter((buyer) => buyer.minimumOrderTons <= filters.quantityTons)
    .sort((a, b) => {
      const trustDiff = b.trustIndex - a.trustIndex;
      if (trustDiff !== 0) {
        return trustDiff;
      }
      return b.rating - a.rating;
    });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as MarketBuyersRequest;

  const filters: Required<MarketBuyersRequest> = {
    region: body.region ?? 'All',
    buyerType: body.buyerType ?? 'All',
    bestOnly: body.bestOnly ?? false,
    minTrustIndex: body.minTrustIndex ?? 7.5,
    quantityTons: body.quantityTons ?? 40,
  };

  const generated = await fetchGemmaGeneratedBuyers();
  const source = generated ? 'gemma' : 'fallback';
  const baseBuyers = generated ?? validateBuyers(fallbackData.buyers as unknown[]);
  const filtered = applyFilters(baseBuyers, filters);

  return NextResponse.json({
    source,
    filters,
    buyers: filtered,
    totalAvailable: baseBuyers.length,
    totalMatching: filtered.length,
  });
}
