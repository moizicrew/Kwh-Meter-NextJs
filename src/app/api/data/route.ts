import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Hitung waktu mulai dan akhir hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set ke awal hari (00:00:00)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Besok awal hari

    // Query data hari ini
    const todaysData = await prisma.mqttData.findMany({
      where: {
        timestamp: {
          gte: today,    // Greater than or equal to today 00:00:00
          lt: tomorrow   // Less than tomorrow 00:00:00
        }
      },
      orderBy: {
        timestamp: 'asc' // Urutkan dari data paling awal
      }
    });

    if (todaysData.length === 0) {
      return NextResponse.json(
        { message: "No data found for today", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({
      date: today.toISOString().split('T')[0], // Format YYYY-MM-DD
      count: todaysData.length,
      data: todaysData
    });

  } catch (error) {
    console.error('Error fetching today\'s data:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}