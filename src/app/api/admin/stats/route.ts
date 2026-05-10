import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
import User from '@/lib/models/User';
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
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ status: 'متاح' }),
      Car.countDocuments({ status: 'مباع' }),
      Car.countDocuments({ status: 'محجوز' }),
      User.countDocuments({ role: 'user' }),
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
      },
    });
  } catch (error) {
    return handleApiError(error, 'فشل في جلب الإحصائيات');
  }
}
