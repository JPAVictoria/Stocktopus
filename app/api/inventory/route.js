import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const locations = await prisma.location.findMany({
      where: { deleted: false },
      include: {
        products: {
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
    const { id } = body;

    if (!id) {
      return new Response("Missing location id", { status: 400 });
    }

    await prisma.location.update({
      where: { id },  
      data: { deleted: true },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response("Failed to soft delete location", { status: 500 });
  }
}


