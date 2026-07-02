import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import ClickTrack from "@/lib/models/ClickTrack";
import { getServerSession, handleApiError } from "@/lib/api-helpers";
import { buildShowroomClicksMatchQuery } from "@/lib/showroom-clicks-query";

function parseDeleteFilters(searchParams: URLSearchParams | Record<string, string | undefined>) {
  const get = (key: string) => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    }
    return searchParams[key] || undefined;
  };

  const showroomId = get("showroomId");
  const startDate = get("startDate");
  const endDate = get("endDate");

  return { showroomId, startDate, endDate };
}

function validateDateFilters(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) {
    return "يجب تحديد فترة زمنية قبل الحذف";
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return "تاريخ البداية يجب أن يكون قبل تاريخ النهاية";
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك بالقيام بهذا الإجراء" },
        { status: 403 },
      );
    }

    const { showroomId, startDate, endDate } = parseDeleteFilters(request.nextUrl.searchParams);
    const dateError = validateDateFilters(startDate, endDate);

    if (dateError) {
      return NextResponse.json({ success: true, count: 0 });
    }

    await connectDB();
    const matchQuery = buildShowroomClicksMatchQuery(showroomId, startDate, endDate);
    const count = await ClickTrack.countDocuments(matchQuery);

    return NextResponse.json({ success: true, count });
  } catch (error) {
    return handleApiError(error, "فشل في حساب عدد الاتصالات");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك بالقيام بهذا الإجراء" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { showroomId, startDate, endDate } = parseDeleteFilters(body);

    const dateError = validateDateFilters(startDate, endDate);
    if (dateError) {
      return NextResponse.json({ success: false, error: dateError }, { status: 400 });
    }

    await connectDB();

    const matchQuery = buildShowroomClicksMatchQuery(showroomId, startDate, endDate);
    const result = await ClickTrack.deleteMany(matchQuery);

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `تم حذف ${result.deletedCount.toLocaleString("ar-EG")} اتصالاً بنجاح`,
    });
  } catch (error) {
    return handleApiError(error, "فشل في حذف سجل الاتصالات");
  }
}
