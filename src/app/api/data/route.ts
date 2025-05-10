import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || '1D';

  const now = new Date();
  const from = new Date();

  if (range === '1D') from.setDate(now.getDate() - 1);
  else if (range === '1W') from.setDate(now.getDate() - 7);
  else if (range === '1M') from.setMonth(now.getMonth() - 1);

  const data = await prisma.mqttData.findMany({
    where: {
      timestamp: {
        gte: from,
      },
    },
    orderBy: {
      timestamp: 'asc',
    },
  });

  // Ubah ke format chart (candlestick) jika perlu
  const candles = data.map((item) => ({
    month: new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    topic: item.topic,
    desktop: item.value,
  }));

  return NextResponse.json(candles);
}
