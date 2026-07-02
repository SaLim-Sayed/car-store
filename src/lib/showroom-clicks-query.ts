import mongoose from "mongoose";

export function buildShowroomClicksMatchQuery(
  showroomId?: string,
  startDate?: string,
  endDate?: string,
): Record<string, unknown> {
  const matchQuery: Record<string, unknown> = { type: "showroom_contact" };

  if (showroomId && showroomId !== "all") {
    matchQuery.targetId = new mongoose.Types.ObjectId(showroomId);
  }

  if (startDate || endDate) {
    matchQuery.createdAt = {};
    if (startDate) {
      (matchQuery.createdAt as { $gte?: Date }).$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      (matchQuery.createdAt as { $lte?: Date }).$lte = end;
    }
  }

  return matchQuery;
}
