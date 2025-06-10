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

export async function POST(req) {
  try {
    
    await requireAuth();

    const body = await req.json();
    const { productId, quantity, fromLocationId, toLocationId } = body;

    
    if (!productId || !quantity || !fromLocationId || !toLocationId) {
      return NextResponse.json(
        { error: "Missing required fields: productId, quantity, fromLocationId, toLocationId" },
        { status: 400 }
      );
    }

    
    const quantityValue = parseFloat(quantity);
    if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a valid positive number" },
        { status: 400 }
      );
    }

    
    if (quantityValue.toString().split('.')[1]?.length > 2) {
      return NextResponse.json(
        { error: "Quantity cannot have more than 2 decimal places" },
        { status: 400 }
      );
    }

    if (fromLocationId === toLocationId) {
      return NextResponse.json(
        { error: "Source and destination locations cannot be the same" },
        { status: 400 }
      );
    }

    
    const product = await prisma.product.findFirst({
      where: { 
        id: productId, 
        deleted: false 
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    
    const [fromLocation, toLocation] = await Promise.all([
      prisma.location.findFirst({
        where: { id: fromLocationId, deleted: false }
      }),
      prisma.location.findFirst({
        where: { id: toLocationId, deleted: false }
      })
    ]);

    if (!fromLocation) {
      return NextResponse.json(
        { error: "Source location not found" },
        { status: 404 }
      );
    }

    if (!toLocation) {
      return NextResponse.json(
        { error: "Destination location not found" },
        { status: 404 }
      );
    }

    
    const [fromProductLocation, toProductLocation] = await Promise.all([
      prisma.productLocation.findFirst({
        where: {
          productId,
          locationId: fromLocationId,
          deleted: false
        }
      }),
      prisma.productLocation.findFirst({
        where: {
          productId,
          locationId: toLocationId,
          deleted: false
        }
      })
    ]);

    const fromQuantity = parseFloat(fromProductLocation?.quantity) || 0;
    const toQuantity = parseFloat(toProductLocation?.quantity) || 0;

    
    if (fromQuantity < quantityValue) {
      return NextResponse.json(
        { 
          error: `Insufficient quantity at source location. Available: ${fromQuantity}, Requested: ${quantityValue}` 
        },
        { status: 400 }
      );
    }

    
    const result = await prisma.$transaction(async (prisma) => {
      
      if (fromProductLocation) {
        const newFromQuantity = fromQuantity - quantityValue;
        await prisma.productLocation.update({
          where: { id: fromProductLocation.id },
          data: { quantity: newFromQuantity }
        });
      }

      
      if (toProductLocation) {
        const newToQuantity = toQuantity + quantityValue;
        await prisma.productLocation.update({
          where: { id: toProductLocation.id },
          data: { quantity: newToQuantity }
        });
      } else {
        await prisma.productLocation.create({
          data: {
            productId,
            locationId: toLocationId,
            quantity: quantityValue
          }
        });
      }

      
      const totalQuantityResult = await prisma.productLocation.aggregate({
        where: { productId, deleted: false },
        _sum: { quantity: true },
      });

      const totalQuantity = parseFloat(totalQuantityResult._sum.quantity) || 0;

      await prisma.product.update({
        where: { id: productId },
        data: { quantity: totalQuantity },
      });

      
      const updatedProduct = await prisma.product.findFirst({
        where: { id: productId },
        include: {
          locations: {
            where: { deleted: false },
            include: {
              location: true
            }
          }
        }
      });

      return updatedProduct;
    });

    return NextResponse.json({
      message: "Transfer completed successfully",
      product: result,
      transfer: {
        productId,
        quantity: quantityValue,
        fromLocation: fromLocation.name,
        toLocation: toLocation.name,
        fromLocationId,
        toLocationId,
        newFromQuantity: fromQuantity - quantityValue,
        newToQuantity: toQuantity + quantityValue
      }
    });

  } catch (error) {
    console.error("Transfer error:", error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    
    if (error.message.includes('Insufficient quantity') || 
        error.message.includes('decimal places') ||
        error.message.includes('positive number')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to transfer product quantity" },
      { status: 500 }
    );
  }
}