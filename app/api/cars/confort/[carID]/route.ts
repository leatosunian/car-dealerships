
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import CarConfortSecurityModel from "@/app/models/confortsecurity";

// GET ALL DOCUMENTS BY carID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ carID: string }> }
) {
  await connectDB();
  const { carID } = await context.params;

  try {
    const items = await CarConfortSecurityModel.find({ carID }).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error("ERROR_GET_CARCONFORTSECURITY", error);
    return NextResponse.json({ msg: "ERROR_GET_CARCONFORTSECURITY" }, { status: 500 });
  }
}

