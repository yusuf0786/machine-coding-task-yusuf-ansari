// src/lib/mongo.ts
import { MongoClient, Db } from 'mongodb';
import type { Lead, PaginatedResponse } from '@/types';

const uri: string = process.env.MONGODB_URI || '';
if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set. Add it to .env.local');
}
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
};

let client: MongoClient | null = null;
let db: Db | null = null;

async function connectDB(): Promise<Db> {
  if (!db) {
    if (!client) {
      client = new MongoClient(uri!, options);
      await client.connect();
    }
    db = client.db('crm-lead-management');
  }
  return db;
}

export async function initDB() {
  const database = await connectDB();
  const collection = database.collection<Lead>('leads');

  // Create indexes for better query performance
  await collection.createIndex({ id: 1 }, { unique: true });
  await collection.createIndex({ createdDate: -1 });
  await collection.createIndex({ status: 1 });
  await collection.createIndex({ source: 1 });
  await collection.createIndex({ name: 'text', email: 'text', company: 'text' });

  // Seed initial data if collection is empty
  const count = await collection.countDocuments();
  if (count === 0) {
    const now = Date.now();
    const day = 86400000;

    const seedLeads: Lead[] = [
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

    await collection.insertMany(seedLeads);
    console.log('✓ Seeded 23 leads to MongoDB');
  }

  return database;
}

export async function getLeads(params?: {
  search?: string;
  status?: string;
  source?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<Lead>> {
  const database = await connectDB();
  const collection = database.collection<Lead>('leads');

  const filter: Record<string, unknown> = {};

  if (params?.search) {
    const q = params.search;
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { company: { $regex: q, $options: 'i' } },
    ];
  }

  if (params?.status) filter.status = params.status;
  if (params?.source) filter.source = params.source;

  const sortDir = params?.sortDir ?? 'desc';
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 8;

  const [data, total] = await Promise.all([
    collection
      .find(filter)
      .sort({ createdDate: sortDir === 'asc' ? 1 : -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  return { data, total, page, pageSize };
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const database = await connectDB();
  const collection = database.collection<Lead>('leads');
  return await collection.findOne({ id });
}

export async function createLead(
  data: Omit<Lead, 'id' | 'createdDate' | 'timeline'>
): Promise<Lead> {
  const database = await connectDB();
  const collection = database.collection<Lead>('leads');

  // Get the highest ID to generate the next one
  const lastLead = await collection.find().sort({ id: -1 }).limit(1).toArray();
  const lastId = lastLead[0]?.id || 'LD-0000';
  const num = parseInt(lastId.replace('LD-', ''), 10) + 1;
  const id = `LD-${num.toString().padStart(4, '0')}`;

  const now = new Date().toISOString();
  const lead: Lead = {
    ...data,
    id,
    createdDate: now,
    timeline: [{ date: now, label: `Lead created via ${data.source}` }],
  };

  await collection.insertOne(lead);
  return lead;
}

export async function updateLead(
  id: string,
  data: Partial<Lead>
): Promise<Lead | null> {
  const database = await connectDB();
  const collection = database.collection<Lead>('leads');

  const existing = await collection.findOne({ id });
  if (!existing) return null;

  const updated = { ...existing, ...data };

  // Add timeline event if status changed
  if (data.status && data.status !== existing.status) {
    updated.timeline = [
      ...existing.timeline,
      { date: new Date().toISOString(), label: `Status changed to ${data.status}` },
    ];
  }

  await collection.updateOne({ id }, { $set: updated });
  return updated;
}

export async function deleteLead(id: string): Promise<boolean> {
  const database = await connectDB();
  const collection = database.collection<Lead>('leads');
  const result = await collection.deleteOne({ id });
  return result.deletedCount === 1;
}

export async function getAllLeads(): Promise<Lead[]> {
  const database = await connectDB();
  const collection = database.collection<Lead>('leads');
  return await collection.find({}).toArray();
}
