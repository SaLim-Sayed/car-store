import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
import User from '@/lib/models/User';
import News from '@/lib/models/News';
import Showroom from '@/lib/models/Showroom';
import Equipment from '@/lib/models/Equipment';
import { handleApiError } from '@/lib/api-helpers';

export async function GET() {
  try {
    await connectDB();

    const [
      totalCars,
      availableCars,
      soldCars,
      reservedCars,
      totalUsers,
      totalNews,
      totalShowrooms,
      totalEquipment,
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ status: 'متاح' }),
      Car.countDocuments({ status: 'مباع' }),
      Car.countDocuments({ status: 'محجوز' }),
      User.countDocuments({ role: 'user' }),
      News.countDocuments(),
      Showroom.countDocuments(),
      Equipment.countDocuments(),
    ]);

    // Revenue: sum of prices of sold cars
    const revenueAgg = await Car.aggregate([
      { $match: { status: 'مباع' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total ?? 0;

    return NextResponse.json({
      success: true,
      data: {
        totalCars,
        availableCars,
        soldCars,
        reservedCars,
        totalUsers,
        totalRevenue,
        totalNews,
        totalShowrooms,
        totalEquipment,
      },
    });
  } catch (error) {
    return handleApiError(error, 'فشل في جلب الإحصائيات');
  }
}
