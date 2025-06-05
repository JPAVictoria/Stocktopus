import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'stocktopus';

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const decoded = jwt.verify(token.value, JWT_SECRET);
  return decoded;
}

export async function POST(request) {
  try {
    await requireAuth();
    
    const { productId, locationId, quantity } = await request.json();

    if (!productId || !locationId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Product ID, location ID, and valid quantity are required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const productLocation = await tx.productLocation.upsert({
        where: {
          productId_locationId: {
            productId,
            locationId,
          },
        },
        update: {
          quantity: {
            increment: parseInt(quantity)
          },
          deleted: false,
        },
        create: {
          productId,
          locationId,
          quantity: parseInt(quantity),
        },
      });

      const totalQuantity = await tx.productLocation.aggregate({
        where: {
          productId,
          deleted: false,
        },
        _sum: { quantity: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: { quantity: totalQuantity._sum.quantity || 0 },
      });

      // Get location name for response
      const location = await tx.location.findUnique({
        where: { id: locationId },
        select: { name: true },
      });

      return { location: location?.name };
    });

    return NextResponse.json({
      success: true,
      message: `Successfully added ${quantity} units to ${result.location}`,
    });

  } catch (error) {
    console.error("Error adding product quantity:", error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    return NextResponse.json({ error: "Failed to add product quantity" }, { status: 500 });
  }
}