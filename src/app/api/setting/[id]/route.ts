import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// PUT - Update setting berdasarkan ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();
  const { name, divider, multiplierR, multiplierS, multiplierT, persen } = body;

  try {
    const updated = await prisma.setting.update({
      where: { id },
      data: { name ,divider, multiplierR, multiplierS, multiplierT, persen},
    });

    return NextResponse.json({ setting: updated });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

// DELETE - Hapus setting berdasarkan ID
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    await prisma.setting.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 });
  }
}
