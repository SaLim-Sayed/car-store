import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import PageView from "@/lib/models/PageView";

export const runtime = "nodejs";

const SKIP_PREFIXES = ["/admin", "/api", "/auth"];

function shouldTrackPath(path: string) {
  if (!path.startsWith("/")) return false;
  return !SKIP_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const path = typeof body?.path === "string" ? body.path.trim() : "";
    const sessionId =
      typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
    const referrer =
      typeof body?.referrer === "string" ? body.referrer.trim().slice(0, 500) : "";

    if (!path || !sessionId || sessionId.length < 8 || sessionId.length > 80) {
      return NextResponse.json(
        { success: false, error: "Invalid visit payload" },
        { status: 400 },
      );
    }

    if (!shouldTrackPath(path)) {
      return NextResponse.json({ success: true, skipped: true });
    }

    await connectDB();

    // Avoid duplicate spam for same session+path within 30 seconds
    const recent = await PageView.findOne({
      sessionId,
      path: path.slice(0, 500),
      createdAt: { $gte: new Date(Date.now() - 30_000) },
    })
      .select("_id")
      .lean();

    if (recent) {
      return NextResponse.json({ success: true, deduped: true });
    }

    await PageView.create({
      path: path.slice(0, 500),
      sessionId,
      referrer,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Visit track error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track visit" },
      { status: 500 },
    );
  }
}
