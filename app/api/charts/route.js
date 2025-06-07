import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    
    const productsWithTotalValue = await prisma.product.findMany({
      where: {
        deleted: false
      },
      include: {
        locations: {
          where: {
            deleted: false
          },
          select: {
            quantity: true
          }
        }
      }
    });

    
    const productValues = productsWithTotalValue
      .map(product => {
        const totalQuantity = product.locations.reduce((sum, location) => sum + location.quantity, 0);
        const totalValue = product.price * totalQuantity;
        
        return {
          id: product.id,
          name: product.name,
          totalValue: totalValue,
          totalQuantity: totalQuantity,
          price: product.price
        };
      })
      .filter(product => product.totalValue > 0) 
      .sort((a, b) => b.totalValue - a.totalValue) 
      .slice(0, 10); 

    
    const pieData = productValues.map((product, index) => ({
      id: index,
      value: product.totalValue,
      label: product.name,
      color: generateColor(index), 
      
      productName: product.name,
      totalAmount: product.totalValue,
      quantity: product.totalQuantity,
      price: product.price
    }));

    return NextResponse.json({
      success: true,
      data: {
        topProductsByValue: pieData
      }
    });

  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch chart data' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


function generateColor(index) {
  const colors = [
    '#00BCD4', 
    '#9C27B0', 
    '#00ACC1', 
    '#FF9800', 
    '#4CAF50', 
    '#F44336', 
    '#2196F3', 
    '#FF5722', 
    '#795548', 
    '#607D8B'  
  ];
  
  return colors[index % colors.length];
}