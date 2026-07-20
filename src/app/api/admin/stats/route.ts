import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
import User from '@/lib/models/User';
import News from '@/lib/models/News';
import Showroom from '@/lib/models/Showroom';
import Equipment from '@/lib/models/Equipment';
import PageView from '@/lib/models/PageView';
import { handleApiError } from '@/lib/api-helpers';

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
 try {
 await connectDB();

 const todayStart = startOfDay();
 const yesterdayStart = startOfDay(new Date(Date.now() - 24 * 60 * 60 * 1000));
 const weekStart = startOfDay(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));

 const [
 totalCars,
 availableCars,
 soldCars,
 reservedCars,
 totalUsers,
 totalNews,
 totalShowrooms,
 totalEquipment,
 visitsToday,
 visitsYesterday,
 visitsThisWeek,
 visitsTotal,
 uniqueVisitorsTodayAgg,
 ] = await Promise.all([
 Car.countDocuments(),
 Car.countDocuments({ status: 'متاح' }),
 Car.countDocuments({ status: 'مباع' }),
 Car.countDocuments({ status: 'محجوز' }),
 User.countDocuments({ role: 'user' }),
 News.countDocuments(),
 Showroom.countDocuments(),
 Equipment.countDocuments(),
 PageView.countDocuments({ createdAt: { $gte: todayStart } }),
 PageView.countDocuments({
   createdAt: { $gte: yesterdayStart, $lt: todayStart },
 }),
 PageView.countDocuments({ createdAt: { $gte: weekStart } }),
 PageView.countDocuments(),
 PageView.aggregate([
   { $match: { createdAt: { $gte: todayStart } } },
   { $group: { _id: '$sessionId' } },
   { $count: 'count' },
 ]),
 ]);

 const revenueAgg = await Car.aggregate([
 { $match: { status: 'مباع' } },
 { $group: { _id: null, total: { $sum: '$price' } } },
 ]);
 const totalRevenue = revenueAgg[0]?.total ?? 0;
 const uniqueVisitorsToday = uniqueVisitorsTodayAgg[0]?.count ?? 0;

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
 visitsToday,
 visitsYesterday,
 visitsThisWeek,
 visitsTotal,
 uniqueVisitorsToday,
 },
 });
 } catch (error) {
 return handleApiError(error, 'فشل في جلب الإحصائيات');
 }
}
