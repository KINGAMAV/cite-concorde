import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Typage sécurisé des variables d'environnement
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY as string;
const PORT = Number(process.env.PORT) || 4000;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const AnnouncementSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  target_role: z.enum(['all', 'resident', 'livreur', 'prestataire', 'syndic', 'boutique']).default('all'),
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/announcements', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

app.post('/api/announcements', async (req: Request, res: Response) => {
  try {
    const validation = AnnouncementSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }

    const { data, error } = await supabase.from('announcements').insert(validation.data);
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));