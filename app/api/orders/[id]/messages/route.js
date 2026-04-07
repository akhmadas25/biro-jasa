import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // order ID
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    // Verify order exists and user has access
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (session.user.role === "USER" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        orderId: id,
        userId: session.user.id,
      },
      include: { user: true }
    });
    
    // Automatic status update if Negotiating
    if (order.status === "WAITING_ESTIMATE") {
      await prisma.order.update({ where: { id }, data: { status: "NEGOTIATING" }})
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("New message error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
