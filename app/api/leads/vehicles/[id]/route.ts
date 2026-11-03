import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import LeadVehiclesModel from "@/app/models/leadvehicles";
import connectDB from "@/lib/db";
import crypto from "crypto";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await connectDB();
  try {
    const data = await request.formData();
    const leadVehicleImage = data.getAll("leadVehicleImage") as File[];
    cloudinary.config({
      cloud_name: 'dn48eveti',
      api_key: '661585856545528',
      api_secret: process.env.CLOUDINARY_SECRET,
    });


    if (leadVehicleImage.length === 0) {
      return NextResponse.json({ msg: "NO_FILES_PROVIDED" }, { status: 400 });
    }

    // upload lead vehicle thumbnail in cloudinary
    if (leadVehicleImage[0]) {
      const bytes = await leadVehicleImage[0].arrayBuffer();
      const buffer = Buffer.from(bytes);
      try {
        const cloudinaryResponse: any = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({}, (error, result) => {
              if (error) {
                reject(error);
              }
              resolve(result);
            })
            .end(buffer);
        });

        const updateLeadVehicleImage = await LeadVehiclesModel.findOneAndUpdate(
          { leadID: params.id },
          { leadVehicleImage: cloudinaryResponse.secure_url },
          { new: true }
        );
        return NextResponse.json({
          msg: "IMAGE_UPDATED",
          updateLeadVehicleImage,
        });
      } catch (error) {
        return NextResponse.json({ msg: "LEAD_VEHICLE_UPLOAD_THUMB_ERROR" });
      }
    }

    return NextResponse.json({ msg: "THUMBNAIL_UPLOADED" });
  } catch (error) {
    return NextResponse.json({ msg: "NO_FILE_PROVIDED" }, { status: 400 });
  }
}
