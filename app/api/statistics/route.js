import { PrismaClient } from '@prisma/client';
import moment from 'moment';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    
    const totalUsers = await prisma.user.count({
      where: { deleted: false }
    });

    
    const activeInventories = await prisma.product.count({
      where: {
        deleted: false,
        quantity: { gt: 0 }
      }
    });

    
    const mostStockedProducts = await prisma.product.findMany({
      where: { deleted: false },
      orderBy: { quantity: 'desc' },
      take: 3,
      select: {
        name: true,
        quantity: true
      }
    });

    
    const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
    const today = moment().endOf('day').toDate();

    
    const userRegistrationData = await prisma.user.findMany({
      where: {
        deleted: false,
        createdAt: {
          gte: thirtyDaysAgo,
          lte: today
        }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    
    const productCreationData = await prisma.product.findMany({
      where: {
        deleted: false,
        createdAt: {
          gte: thirtyDaysAgo,
          lte: today
        }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    
    const userChartData = processChartDataWithMoment(userRegistrationData);
    const inventoryChartData = processChartDataWithMoment(productCreationData);

    return Response.json({
      userCount: totalUsers,
      activeInventories,
      mostStockedProducts: mostStockedProducts.map(product => product.name),
      lineData: {
        series: [
          {
            data: inventoryChartData.values,
            label: 'Products Created'
          }
        ],
        xAxis: [
          {
            scaleType: 'point',
            data: inventoryChartData.labels
          }
        ]
      },
      userLineData: {
        series: [
          {
            data: userChartData.values,
            label: 'Users Registered'
          }
        ],
        xAxis: [
          {
            scaleType: 'point',
            data: userChartData.labels
          }
        ]
      }
    });

  } catch (error) {
    console.error('Statistics API Error:', error);
    return Response.json(
      { 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function processChartDataWithMoment(data) {
  if (!data || data.length === 0) {
    
    const labels = [];
    const values = [];
    
    for (let i = 6; i >= 0; i--) {
      labels.push(moment().subtract(i, 'days').format('MMM DD'));
      values.push(0);
    }
    
    return { labels, values };
  }

  
  const dateCountMap = new Map();
  
  
  for (let i = 29; i >= 0; i--) {
    const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
    dateCountMap.set(date, 0);
  }
  
  
  data.forEach(item => {
    const date = moment(item.createdAt).format('YYYY-MM-DD');
    if (dateCountMap.has(date)) {
      dateCountMap.set(date, dateCountMap.get(date) + 1);
    }
  });

  
  const sortedEntries = Array.from(dateCountMap.entries()).sort((a, b) => {
    return moment(a[0]).valueOf() - moment(b[0]).valueOf();
  });

  
  const recentEntries = sortedEntries.slice(-14);
  
  const labels = recentEntries.map(([date]) => {
    return moment(date).format('MMM DD');
  });

  const values = recentEntries.map(([, count]) => count);

  return {
    labels,
    values
  };
}