import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'stocktopus';

async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token.value, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

async function requireAuth() {
  const user = await getUserFromToken();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    
    const resolvedParams = await params;
    const { id: productId } = resolvedParams;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        deleted: false,
      },
      include: {
        locations: {
          where: {
            deleted: false,
          },
          include: {
            location: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await requireAuth();
    
    const resolvedParams = await params;
    const { id: productId } = resolvedParams;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, imageUrl, quantity, price, locationId } = body;

    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!imageUrl || !imageUrl.trim()) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Valid quantity is required" },
        { status: 400 }
      );
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      );
    }

    if (!locationId) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
        deleted: false,
      },
      include: {
        locations: {
          where: {
            deleted: false,
          },
        },
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    
    const duplicateProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        deleted: false,
        id: {
          not: productId,
        },
      },
    });

    if (duplicateProduct) {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 409 }
      );
    }

    
    const location = await prisma.location.findUnique({
      where: {
        id: locationId,
        deleted: false,
      },
    });

    if (!location) {
      return NextResponse.json(
        { error: "Invalid location selected" },
        { status: 400 }
      );
    }

    
    const result = await prisma.$transaction(async (tx) => {
      
      const updatedProduct = await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          name: name.trim(),
          imageUrl: imageUrl.trim(),
          quantity: parseInt(quantity),
          price: parseFloat(price),
          updatedAt: new Date(),
        },
      });

      
      const existingLocation = existingProduct.locations.find(
        (loc) => loc.locationId === locationId
      );

      if (existingLocation) {
        
        await tx.productLocation.update({
          where: {
            id: existingLocation.id,
          },
          data: {
            quantity: parseInt(quantity),
          },
        });
      } else {
        
        await tx.productLocation.updateMany({
          where: {
            productId: productId,
            deleted: false,
          },
          data: {
            deleted: true,
          },
        });

        await tx.productLocation.create({
          data: {
            productId: productId,
            locationId: locationId,
            quantity: parseInt(quantity),
          },
        });
      }

      
      const productWithLocations = await tx.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          locations: {
            where: {
              deleted: false,
            },
            include: {
              location: true,
            },
          },
        },
      });

      return productWithLocations;
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
