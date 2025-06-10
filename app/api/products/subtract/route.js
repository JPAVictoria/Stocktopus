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
      
      const productLocation = await tx.productLocation.findUnique({
        where: {
          productId_locationId: { productId, locationId },
        },
      });

      if (!productLocation || productLocation.deleted) {
        throw new Error('Product not found at this location');
      }

      
      const quantityToSubtract = parseFloat(quantity);
      const currentQuantity = parseFloat(productLocation.quantity);
      
      
      if (!Number.isFinite(quantityToSubtract) || quantityToSubtract <= 0) {
        throw new Error('Invalid quantity value');
      }
      
      
      if (quantityToSubtract.toString().split('.')[1]?.length > 2) {
        throw new Error('Quantity cannot have more than 2 decimal places');
      }
      
      if (currentQuantity < quantityToSubtract) {
        throw new Error(`Cannot subtract ${quantityToSubtract} items. Only ${currentQuantity} available.`);
      }

      
      const newQuantity = currentQuantity - quantityToSubtract;
      
      
      await tx.productLocation.update({
        where: {
          productId_locationId: { productId, locationId },
        },
        data: {
          quantity: newQuantity,
        },
      });

      
      const totalQuantityResult = await tx.productLocation.aggregate({
        where: { productId, deleted: false },
        _sum: { quantity: true },
      });

      const totalQuantity = parseFloat(totalQuantityResult._sum.quantity) || 0;

      await tx.product.update({
        where: { id: productId },
        data: { quantity: totalQuantity },
      });

      
      const location = await tx.location.findUnique({
        where: { id: locationId },
        select: { name: true },
      });

      return {
        locationName: location?.name,
        subtractedQuantity: quantityToSubtract,
        newLocationQuantity: newQuantity,
        newTotalQuantity: totalQuantity
      };
    });

    return NextResponse.json({
      success: true,
      message: `Successfully subtracted ${result.subtractedQuantity} units from ${result.locationName}`,
      data: {
        subtractedQuantity: result.subtractedQuantity,
        newLocationQuantity: result.newLocationQuantity,
        newTotalQuantity: result.newTotalQuantity
      }
    });

  } catch (error) {
    console.error("Error subtracting product quantity:", error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    if (error.message.includes('Cannot subtract') || 
        error.message.includes('not found') || 
        error.message.includes('Invalid quantity') ||
        error.message.includes('decimal places')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to subtract product quantity" }, { status: 500 });
  }
}