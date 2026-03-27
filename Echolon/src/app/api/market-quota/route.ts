import { NextResponse } from 'next/server';
import partnersData from '@/data/logistics-partners.json';

type LogisticsPartner = {
  id: string;
  name: string;
  partnerType: 'Agency' | 'NGO';
  lat: number;
  lon: number;
  coverageStates: string[];
};

type QuotaRequest = {
  companyId: string;
  companyName: string;
  quantityTons: number;
  farmerName?: string;
  pickupState?: string;
  pickupLat?: number;
  pickupLon?: number;
};

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

function isPartner(item: unknown): item is LogisticsPartner {
  if (!item || typeof item !== 'object') {
    return false;
  }

  const partner = item as Record<string, unknown>;
  return (
    typeof partner.id === 'string' &&
    typeof partner.name === 'string' &&
    (partner.partnerType === 'Agency' || partner.partnerType === 'NGO') &&
    typeof partner.lat === 'number' &&
    typeof partner.lon === 'number' &&
    Array.isArray(partner.coverageStates)
  );
}

function getPartners(): LogisticsPartner[] {
  return (partnersData.partners as unknown[]).filter(isPartner);
}

function pickNearestPartner(partners: LogisticsPartner[], state: string | undefined, lat: number, lon: number): LogisticsPartner {
  const stateScoped = state
    ? partners.filter((partner) => partner.coverageStates.some((covered) => covered.toLowerCase() === state.toLowerCase()))
    : [];

  const pool = stateScoped.length > 0 ? stateScoped : partners;
  let nearest = pool[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const partner of pool) {
    const distance = haversineKm(lat, lon, partner.lat, partner.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = partner;
    }
  }

  return nearest;
}

function buildMilestones(quantityTons: number): Array<{ step: string; progress: number; etaHours: number }> {
  const heavyOrder = quantityTons >= 100;
  return [
    { step: 'Company Request Submitted', progress: 20, etaHours: 1 },
    { step: 'Nearest Agency/NGO Assigned', progress: 40, etaHours: 3 },
    { step: heavyOrder ? 'Heavy Fleet Route Planning' : 'Route Planning', progress: 60, etaHours: heavyOrder ? 8 : 5 },
    { step: 'Pickup & Consolidation', progress: 80, etaHours: heavyOrder ? 20 : 14 },
    { step: 'Dispatch to Company Processor', progress: 100, etaHours: heavyOrder ? 36 : 26 },
  ];
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as QuotaRequest;

  if (!body.companyId || !body.companyName || !Number.isFinite(body.quantityTons) || body.quantityTons <= 0) {
    return NextResponse.json({ error: 'Invalid quota request payload.' }, { status: 400 });
  }

  const partners = getPartners();
  if (partners.length === 0) {
    return NextResponse.json({ error: 'No logistics partners configured.' }, { status: 500 });
  }

  const pickupLat = Number.isFinite(body.pickupLat) ? Number(body.pickupLat) : 22.9734;
  const pickupLon = Number.isFinite(body.pickupLon) ? Number(body.pickupLon) : 78.6569;

  const assigned = pickNearestPartner(partners, body.pickupState, pickupLat, pickupLon);
  const distanceKm = Math.round(haversineKm(pickupLat, pickupLon, assigned.lat, assigned.lon));
  const milestones = buildMilestones(body.quantityTons);
  const ticketId = `Q-${Date.now().toString().slice(-7)}`;

  return NextResponse.json({
    ticketId,
    status: 'REQUESTED',
    company: {
      id: body.companyId,
      name: body.companyName,
    },
    quantityTons: body.quantityTons,
    farmerName: body.farmerName ?? 'Anonymous Farmer',
    assignedPartner: {
      id: assigned.id,
      name: assigned.name,
      partnerType: assigned.partnerType,
      distanceKm,
    },
    milestones,
    processingProgress: milestones[2].progress,
    etaToDispatchHours: milestones[milestones.length - 1].etaHours,
    message: `Quota request sent to ${body.companyName}. ${assigned.name} (${assigned.partnerType}) assigned for pickup and drop logistics.`,
  });
}
