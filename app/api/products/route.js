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


export async function GET(request) {
  try {
    const user = await requireAuth();

    const products = await prisma.product.findMany({
      where: {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth();

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

    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        deleted: false,
      },
    });

    if (existingProduct) {
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
      const product = await tx.product.create({
        data: {
          name: name.trim(),
          imageUrl: imageUrl.trim(),
          quantity: parseInt(quantity),
          price: parseFloat(price),
          createdById: user.id,
        },
      });

      const productLocation = await tx.productLocation.create({
        data: {
          productId: product.id,
          locationId: locationId,
          quantity: parseInt(quantity),
        },
      });

      return {
        ...product,
        location: location.name,
        productLocationId: productLocation.id,
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { id, softDelete } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (softDelete) {
      await prisma.$transaction(async (tx) => {
        const existingProduct = await tx.product.findUnique({
          where: { id }
        });

        if (!existingProduct) {
          throw new Error('Product not found');
        }

        await tx.productLocation.updateMany({
          where: { productId: id, deleted: false },
          data: { deleted: true },
        });

        await tx.product.update({
          where: { id },
          data: { deleted: true },
        });
      });

      return NextResponse.json({ message: "Product deleted successfully" });
    }

    return NextResponse.json(
      { error: "Invalid operation" },
      { status: 400 }
    );
  } catch (error) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (error.message === 'Product not found') {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
