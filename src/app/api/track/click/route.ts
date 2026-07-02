import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import ClickTrack from "@/lib/models/ClickTrack";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, targetId, metadata } = body;

    if (!type || !targetId) {
      return NextResponse.json(
        { error: "Missing required fields: type, targetId" },
        { status: 400 }
      );
    }

    await connectDB();

    const newClick = new ClickTrack({
      type,
      targetId,
      metadata: metadata || {},
    });

    await newClick.save();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error tracking click:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
