import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        serviceId: true,
        formDetails: true,
        status: true,
        estimatedPrice: true,
        estimatedBreakdown: true,
        agreedPrice: true,
        fixedPrice: true,
        fixedBreakdown: true,
        paymentProofUrl: true,
        paymentStatus: true,
        paymentInstructions: true,
        deliveryMethod: true,
        deliveryAddress: true,
        documentUrls: true, // Wajib ada untuk lihat berkas di detail
        staffId: true,
        createdAt: true,
        updatedAt: true,
        service: true,
        user: { select: { id: true, name: true, email: true, role: true } },
        staff: { select: { id: true, name: true, email: true } },
        messages: {
          include: { user: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' }
        }
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Role-based access check
    if (session.user.role === "USER" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (session.user.role === "STAFF" && order.staffId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Only allowing a subset of fields depending on role can be added here
    // For MVP we allow a general update payload
    const order = await prisma.order.update({
      where: { id },
      data: body,
      include: {
        service: true,
        user: true,
        staff: true,
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
