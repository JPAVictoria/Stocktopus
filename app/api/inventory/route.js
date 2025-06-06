import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const locations = await prisma.location.findMany({
      where: { deleted: false },
      include: {
        products: {
          where: { 
            deleted: false,
            quantity: {
              gt: 0  
            }
          },
          include: {
            product: true,
          },
        },
      },
    });

    const formatted = locations.map((loc) => ({
      id: loc.id,
      location: loc.name,
      address: loc.address,
      createdDate: moment(loc.createdAt).format("MMMM D, YYYY h:mm:ss A"),
      products: loc.products.map((p) => p.product.name).join(", "),
      productCount: loc.products.length,
      productDetails: loc.products.map((p) => ({
        name: p.product.name,
        quantity: p.quantity
      }))
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error("GET error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { location, address } = body;

    if (!location) {
      return new Response("Location name is required", { status: 400 });
    }

    const newLocation = await prisma.location.create({
      data: {
        name: location,
        address,
      },
    });

    return Response.json(newLocation);
  } catch (error) {
    console.error("POST error:", error);
    return new Response("Failed to create location", { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, location, address, softDelete } = body;

    if (!id) {
      return new Response("Missing location id", { status: 400 });
    }

    if (softDelete) {
      await prisma.location.update({
        where: { id },
        data: { deleted: true },
      });

      return new Response(null, { status: 204 });
    }

    if (!location || !address) {
      return new Response("Missing location or address for update", { status: 400 });
    }

    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        name: location,
        address,
      },
    });

    return Response.json(updatedLocation);
  } catch (error) {
    console.error("PUT error:", error);
    return new Response("Failed to process request", { status: 500 });
  }
}