import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, formDetails, documentUrls } = body;

    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        serviceId: serviceId,
        formDetails: formDetails || {},
        documentUrls: documentUrls || {},
        status: "WAITING_ESTIMATE",
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let orders;
    const orderSelect = {
      id: true,
      userId: true,
      serviceId: true,
      formDetails: true,
      estimatedPrice: true,
      agreedPrice: true,
      fixedPrice: true, // Tambahkan ini
      fixedBreakdown: true, // Tambahkan ini
      status: true,
      paymentProofUrl: true,
      paymentStatus: true,
      // NOT selecting documentUrls here to avoid huge payload/memory issues
      staffId: true,
      deliveryMethod: true,
      deliveryAddress: true,
      paymentInstructions: true,
      createdAt: true,
      updatedAt: true,
      user: true,
      service: true,
      staff: true
    };
    
    if (session.user.role === "SUPERADMIN") {
      orders = await prisma.order.findMany({
        select: orderSelect,
        orderBy: { createdAt: "desc" },
      });
    } else if (session.user.role === "STAFF") {
      orders = await prisma.order.findMany({
        where: { staffId: session.user.id },
        select: orderSelect,
        orderBy: { createdAt: "desc" },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        select: orderSelect,
        orderBy: { createdAt: "desc" },
      });
    }

    const safeOrders = orders.map(order => {
      if (order.formDetails && typeof order.formDetails === 'object' && order.formDetails.documents) {
        const { documents, ...restDetails } = order.formDetails;
        return { ...order, formDetails: restDetails };
      }
      return order;
    });

    return NextResponse.json(safeOrders);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
