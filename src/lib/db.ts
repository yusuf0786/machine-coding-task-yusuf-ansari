// import type { Lead, LeadStatus, LeadSource, PaginatedResponse } from '@/types';
import type { Lead, PaginatedResponse } from '@/types';

function createSeedLeads(): Lead[] {
  const now = Date.now();
  const day = 86400000;

  const leads: Lead[] = [
    {
      id: 'LD-0001',
      name: 'Sarah Chen',
      email: 'sarah.chen@techcorp.com',
      phone: '+1-415-555-0101',
      company: 'TechCorp Industries',
      status: 'Converted',
      source: 'Website',
      createdDate: new Date(now - 28 * day).toISOString(),
      timeline: [
        { date: new Date(now - 28 * day).toISOString(), label: 'Lead created via Website' },
        { date: new Date(now - 25 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now - 18 * day).toISOString(), label: 'Status changed to Qualified' },
        { date: new Date(now - 5 * day).toISOString(), label: 'Status changed to Converted' },
      ],
    },
    {
      id: 'LD-0002',
      name: 'Marcus Johnson',
      email: 'marcus.j@innovate.io',
      phone: '+1-212-555-0102',
      company: 'Innovate Solutions',
      status: 'Qualified',
      source: 'LinkedIn',
      createdDate: new Date(now - 26 * day).toISOString(),
      timeline: [
        { date: new Date(now - 26 * day).toISOString(), label: 'Lead created via LinkedIn' },
        { date: new Date(now - 22 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now - 14 * day).toISOString(), label: 'Status changed to Qualified' },
      ],
    },
    {
      id: 'LD-0003',
      name: 'Elena Rodriguez',
      email: 'elena.r@globalfin.com',
      phone: '+1-305-555-0103',
      company: 'GlobalFin Partners',
      status: 'Contacted',
      source: 'Referral',
      createdDate: new Date(now - 24 * day).toISOString(),
      timeline: [
        { date: new Date(now - 24 * day).toISOString(), label: 'Lead created via Referral' },
        { date: new Date(now - 20 * day).toISOString(), label: 'Status changed to Contacted' },
      ],
    },
    {
      id: 'LD-0004',
      name: 'David Kim',
      email: 'dkim@startuplab.co',
      phone: '+1-650-555-0104',
      company: 'StartupLab',
      status: 'New',
      source: 'Cold Call',
      createdDate: new Date(now - 22 * day).toISOString(),
      timeline: [
        { date: new Date(now - 22 * day).toISOString(), label: 'Lead created via Cold Call' },
      ],
    },
    {
      id: 'LD-0005',
      name: 'Priya Patel',
      email: 'priya@cloudnine.dev',
      phone: '+1-408-555-0105',
      company: 'CloudNine Technologies',
      status: 'Converted',
      source: 'Email Campaign',
      createdDate: new Date(now - 21 * day).toISOString(),
      timeline: [
        { date: new Date(now - 21 * day).toISOString(), label: 'Lead created via Email Campaign' },
        { date: new Date(now - 18 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now - 12 * day).toISOString(), label: 'Status changed to Qualified' },
        { date: new Date(now - 3 * day).toISOString(), label: 'Status changed to Converted' },
      ],
    },
    {
      id: 'LD-0006',
      name: 'James Wilson',
      email: 'jwilson@megacorp.com',
      phone: '+1-312-555-0106',
      company: 'MegaCorp LLC',
      status: 'Lost',
      source: 'Trade Show',
      createdDate: new Date(now - 20 * day).toISOString(),
      timeline: [
        { date: new Date(now - 20 * day).toISOString(), label: 'Lead created via Trade Show' },
        { date: new Date(now - 16 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now - 8 * day).toISOString(), label: 'Status changed to Lost' },
      ],
    },
    {
      id: 'LD-0007',
      name: 'Aisha Mohammed',
      email: 'aisha.m@dataprime.ai',
      phone: '+1-646-555-0107',
      company: 'DataPrime AI',
      status: 'Qualified',
      source: 'Website',
      createdDate: new Date(now - 18 * day).toISOString(),
      timeline: [
        { date: new Date(now - 18 * day).toISOString(), label: 'Lead created via Website' },
        { date: new Date(now - 14 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now - 7 * day).toISOString(), label: 'Status changed to Qualified' },
      ],
    },
    {
      id: 'LD-0008',
      name: 'Tom Bradley',
      email: 'tbradley@nexgen.co',
      phone: '+1-503-555-0108',
      company: 'NexGen Systems',
      status: 'Contacted',
      source: 'LinkedIn',
      createdDate: new Date(now - 17 * day).toISOString(),
      timeline: [
        { date: new Date(now - 17 * day).toISOString(), label: 'Lead created via LinkedIn' },
        { date: new Date(now - 13 * day).toISOString(), label: 'Status changed to Contacted' },
      ],
    },
    {
      id: 'LD-0009',
      name: 'Lisa Chang',
      email: 'lchang@brightpath.io',
      phone: '+1-206-555-0109',
      company: 'BrightPath Analytics',
      status: 'New',
      source: 'Website',
      createdDate: new Date(now - 15 * day).toISOString(),
      timeline: [
        { date: new Date(now - 15 * day).toISOString(), label: 'Lead created via Website' },
      ],
    },
    {
      id: 'LD-0010',
      name: 'Robert Garcia',
      email: 'rgarcia@finwise.com',
      phone: '+1-713-555-0110',
      company: 'FinWise Capital',
      status: 'Qualified',
      source: 'Referral',
      createdDate: new Date(now - 14 * day).toISOString(),
      timeline: [
        { date: new Date(now - 14 * day).toISOString(), label: 'Lead created via Referral' },
        { date: new Date(now - 10 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now - 4 * day).toISOString(), label: 'Status changed to Qualified' },
      ],
    },
    {
      id: 'LD-0011',
      name: 'Hannah Baker',
      email: 'hbaker@ecoware.green',
      phone: '+1-303-555-0111',
      company: 'EcoWare Solutions',
      status: 'Contacted',
      source: 'Email Campaign',
      createdDate: new Date(now - 13 * day).toISOString(),
      timeline: [
        { date: new Date(now - 13 * day).toISOString(), label: 'Lead created via Email Campaign' },
        { date: new Date(now - 9 * day).toISOString(), label: 'Status changed to Contacted' },
      ],
    },
    {
      id: 'LD-0012',
      name: 'Vikram Singh',
      email: 'vsingh@apexlogic.in',
      phone: '+1-510-555-0112',
      company: 'ApexLogic',
      status: 'New',
      source: 'Cold Call',
      createdDate: new Date(now - 11 * day).toISOString(),
      timeline: [
        { date: new Date(now - 11 * day).toISOString(), label: 'Lead created via Cold Call' },
      ],
    },
    {
      id: 'LD-0013',
      name: 'Catherine Dubois',
      email: 'cdubois@luxemark.fr',
      phone: '+1-917-555-0113',
      company: 'LuxeMark International',
      status: 'Converted',
      source: 'Trade Show',
      createdDate: new Date(now - 10 * day).toISOString(),
      timeline: [
        { date: new Date(now - 10 * day).toISOString(), label: 'Lead created via Trade Show' },
        { date: new Date(now - 8 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now - 5 * day).toISOString(), label: 'Status changed to Qualified' },
        { date: new Date(now - 2 * day).toISOString(), label: 'Status changed to Converted' },
      ],
    },
    {
      id: 'LD-0014',
      name: 'Alex Turner',
      email: 'aturner@bytecraft.dev',
      phone: '+1-512-555-0114',
      company: 'ByteCraft Studios',
      status: 'Lost',
      source: 'LinkedIn',
      createdDate: new Date(now - 9 * day).toISOString(),
      timeline: [
        { date: new Date(now - 9 * day).toISOString(), label: 'Lead created via LinkedIn' },
        { date: new Date(now - 6 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now - 2 * day).toISOString(), label: 'Status changed to Lost' },
      ],
    },
    {
      id: 'LD-0015',
      name: 'Maria Santos',
      email: 'msantos@healthtrak.io',
      phone: '+1-786-555-0115',
      company: 'HealthTrak Systems',
      status: 'Contacted',
      source: 'Website',
      createdDate: new Date(now - 8 * day).toISOString(),
      timeline: [
        { date: new Date(now - 8 * day).toISOString(), label: 'Lead created via Website' },
        { date: new Date(now - 5 * day).toISOString(), label: 'Status changed to Contacted' },
      ],
    },
    {
      id: 'LD-0016',
      name: 'Chen Wei',
      email: 'cwei@quantumleap.tech',
      phone: '+1-408-555-0116',
      company: 'QuantumLeap Tech',
      status: 'New',
      source: 'Referral',
      createdDate: new Date(now - 7 * day).toISOString(),
      timeline: [
        { date: new Date(now - 7 * day).toISOString(), label: 'Lead created via Referral' },
      ],
    },
    {
      id: 'LD-0017',
      name: 'Jordan Peters',
      email: 'jpeters@scalefirst.com',
      phone: '+1-202-555-0117',
      company: 'ScaleFirst Inc.',
      status: 'Qualified',
      source: 'Email Campaign',
      createdDate: new Date(now - 6 * day).toISOString(),
      timeline: [
        { date: new Date(now - 6 * day).toISOString(), label: 'Lead created via Email Campaign' },
        { date: new Date(now - 4 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now - 1 * day).toISOString(), label: 'Status changed to Qualified' },
      ],
    },
    {
      id: 'LD-0018',
      name: 'Fatima Al-Rashid',
      email: 'falrashid@meridiangroup.ae',
      phone: '+1-469-555-0118',
      company: 'Meridian Group',
      status: 'Lost',
      source: 'Cold Call',
      createdDate: new Date(now - 5 * day).toISOString(),
      timeline: [
        { date: new Date(now - 5 * day).toISOString(), label: 'Lead created via Cold Call' },
        { date: new Date(now - 3 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now - 1 * day).toISOString(), label: 'Status changed to Lost' },
      ],
    },
    {
      id: 'LD-0019',
      name: 'Nathan Brooks',
      email: 'nbrooks@crestview.co',
      phone: '+1-720-555-0119',
      company: 'Crestview Ventures',
      status: 'New',
      source: 'Trade Show',
      createdDate: new Date(now - 4 * day).toISOString(),
      timeline: [
        { date: new Date(now - 4 * day).toISOString(), label: 'Lead created via Trade Show' },
      ],
    },
    {
      id: 'LD-0020',
      name: 'Olivia Mitchell',
      email: 'omitchell@pulse.digital',
      phone: '+1-415-555-0120',
      company: 'Pulse Digital',
      status: 'Contacted',
      source: 'Website',
      createdDate: new Date(now - 3 * day).toISOString(),
      timeline: [
        { date: new Date(now - 3 * day).toISOString(), label: 'Lead created via Website' },
        { date: new Date(now - 1 * day).toISOString(), label: 'Status changed to Contacted' },
      ],
    },
    {
      id: 'LD-0021',
      name: 'Ryan Nakamura',
      email: 'rnakamura@zenithlab.jp',
      phone: '+1-310-555-0121',
      company: 'Zenith Lab',
      status: 'New',
      source: 'LinkedIn',
      createdDate: new Date(now - 2 * day).toISOString(),
      timeline: [
        { date: new Date(now - 2 * day).toISOString(), label: 'Lead created via LinkedIn' },
      ],
    },
    {
      id: 'LD-0022',
      name: 'Emma Watson',
      email: 'ewatson@brightedge.ai',
      phone: '+1-617-555-0122',
      company: 'BrightEdge AI',
      status: 'Converted',
      source: 'Referral',
      createdDate: new Date(now - 1 * day).toISOString(),
      timeline: [
        { date: new Date(now - 1 * day).toISOString(), label: 'Lead created via Referral' },
        { date: new Date(now - 1 * day).toISOString(), label: 'Status changed to Contacted' },
        { date: new Date(now).toISOString(), label: 'Status changed to Qualified' },
        { date: new Date(now).toISOString(), label: 'Status changed to Converted' },
      ],
    },
    {
      id: 'LD-0023',
      name: 'Miguel Fernandez',
      email: 'mfernandez@codeblaze.io',
      phone: '+1-512-555-0123',
      company: 'CodeBlaze',
      status: 'New',
      source: 'Email Campaign',
      createdDate: new Date(now).toISOString(),
      timeline: [
        { date: new Date(now).toISOString(), label: 'Lead created via Email Campaign' },
      ],
    },
  ];

  return leads;
}

const leads: Lead[] = createSeedLeads();
let idCounter = 24;

export function getLeads(params?: {
  search?: string;
  status?: string;
  source?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}): PaginatedResponse<Lead> {
  let filtered = [...leads];

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q)
    );
  }

  if (params?.status) {
    filtered = filtered.filter((lead) => lead.status === params.status);
  }

  if (params?.source) {
    filtered = filtered.filter((lead) => lead.source === params.source);
  }

  const sortDir = params?.sortDir ?? 'desc';
  filtered.sort((a, b) => {
    const dateA = new Date(a.createdDate).getTime();
    const dateB = new Date(b.createdDate).getTime();
    return sortDir === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 8;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize };
}

export function getLeadById(id: string): Lead | undefined {
  return leads.find((lead) => lead.id === id);
}

export function createLead(
  data: Omit<Lead, 'id' | 'createdDate' | 'timeline'>
): Lead {
  const id = `LD-${idCounter.toString().padStart(4, '0')}`;
  idCounter++;

  const now = new Date().toISOString();
  const lead: Lead = {
    ...data,
    id,
    createdDate: now,
    timeline: [
      {
        date: now,
        label: `Lead created via ${data.source}`,
      },
    ],
  };

  leads.unshift(lead);
  return lead;
}

export function updateLead(
  id: string,
  data: Partial<Lead>
): Lead | undefined {
  const index = leads.findIndex((lead) => lead.id === id);
  if (index === -1) return undefined;

  const existing = leads[index];
  const updated = { ...existing, ...data };

  if (data.status && data.status !== existing.status) {
    updated.timeline = [
      ...existing.timeline,
      {
        date: new Date().toISOString(),
        label: `Status changed to ${data.status}`,
      },
    ];
  }

  leads[index] = updated;
  return updated;
}

export function deleteLead(id: string): boolean {
  const index = leads.findIndex((lead) => lead.id === id);
  if (index === -1) return false;

  leads.splice(index, 1);
  return true;
}

export function getAllLeads(): Lead[] {
  return [...leads];
}
