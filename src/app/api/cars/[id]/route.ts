import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
import { handleApiError } from '@/lib/api-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    
    const resolvedParams = await params;
    const car = await Car.findById(resolvedParams.id);
    
    if (!car) {
      return NextResponse.json(
        { success: false, error: 'السيارة غير موجودة' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: car
    });
  } catch (error) {
    return handleApiError(error, 'فشل في جلب السيارة');
  }
}

export async function DELETE_CAR(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    
    const resolvedParams = await params;
    const car = await Car.findByIdAndDelete(resolvedParams.id);
    
    if (!car) {
      return NextResponse.json(
        { success: false, error: 'السيارة غير موجودة' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم حذف السيارة بنجاح'
    });
  } catch (error) {
    return handleApiError(error, 'فشل في حذف السيارة');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    
    const body = await request.json();
    const resolvedParams = await params;
    
    const car = await Car.findByIdAndUpdate(
      resolvedParams.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!car) {
      return NextResponse.json(
        { success: false, error: 'السيارة غير موجودة' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: car,
      message: 'تم تحديث السيارة بنجاح'
    });
  } catch (error) {
    return handleApiError(error, 'فشل في تحديث السيارة');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();
    
    const car = await Car.findByIdAndDelete(params.id);
    
    if (!car) {
      return NextResponse.json(
        { success: false, error: 'السيارة غير موجودة' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم حذف السيارة بنجاح'
    });
  } catch (error) {
    return handleApiError(error, 'فشل في حذف السيارة');
  }
}
