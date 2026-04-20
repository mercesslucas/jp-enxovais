import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

const defaultSettings = {
  heroImage: '/hero-bg.jpg',
  whatsappNumber: '5511999999999',
  instagramHandle: 'jpenxovais'
};

function getSettings() {
  if (!fs.existsSync(settingsPath)) {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
    return defaultSettings;
  }
  return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(request: Request) {
  try {
    const newSettings = await request.json();
    const currentSettings = getSettings();
    const updated = { ...currentSettings, ...newSettings };
    fs.writeFileSync(settingsPath, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao salvar configurações' }, { status: 500 });
  }
}
