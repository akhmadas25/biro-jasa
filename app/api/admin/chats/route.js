import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mendapatkan list order yang memiliki pesan, urutkan berdasarkan pesan terbaru
    const orders = await prisma.order.findMany({
      where: {
        messages: { some: {} } // Hanya order yang ada pesannya
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        service: { select: { name: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { user: { select: { name: true } } }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Admin chats API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
