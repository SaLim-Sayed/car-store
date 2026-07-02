import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import ClickTrack from "@/lib/models/ClickTrack";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    const clicks = await ClickTrack.find({ 
      type: "showroom_contact", 
      targetId: id 
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

    return NextResponse.json({ success: true, data: clicks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
