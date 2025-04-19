import { NextResponse } from 'next/server';


import prisma from '@/lib/db';

export async function GET() {
  try {
    const setting = await prisma.setting.findFirst();

    if (!setting) {
      return NextResponse.json({ error: 'setting not found' }, { status: 404 });
    }

    return NextResponse.json({ setting });
  } catch (error) {
    console.error('Failed to fetch setting:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}


// POST - Tambah setting baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, multiplierR, multiplierS, multiplierT, divider, persen } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const setting = await prisma.setting.create({
      data: { name, multiplierR, multiplierS, multiplierT, divider, persen }
    });

    return NextResponse.json({ setting });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create setting' }, { status: 500 });
  }
}