import CarImageModel from "@/app/models/carimage";
import { NextRequest, NextResponse } from "next/server";

// GET GALLERY IMAGES
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ uuid: string }> }
) {
  const params = await props.params;
  console.log(params.uuid);

  try {
    const images = await CarImageModel.find({ carID: params.uuid }).sort({createdAt: -1});
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_GET_GALLERY_IMAGES" }, { status: 400 });
  }
}


