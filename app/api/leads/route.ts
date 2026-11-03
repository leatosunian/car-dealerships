import LeadModel from "@/app/models/lead";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { SortOrder } from "mongoose";

export async function POST(request: NextRequest) {
  await connectDB();
  console.log("Conexión a DB exitosa");
  const data = await request.json();
  if (data.observations === "") {
    data.observations = "No hay descripcion.";
  }
  if (data.contactType === "") {
    data.contactType = "No especificado.";
  }
  if (data.interestedInName === "") {
    data.interestedInName = "No especificado.";
  }
  if (data.leadVehicleName === "") {
    data.leadVehicleName = "No especificado.";
  }
  try {
    console.log("Datos a guardar:", data);
    const newLead = await LeadModel.create(data);
    console.log('newlead:', newLead);
    return NextResponse.json({ msg: "LEAD_CREATED", newLead });
  } catch (error) {
    console.error("Error al crear lead:", error);
    return NextResponse.json({ msg: "LEAD_CREATION_ERROR" });
  }
}

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");
  const searchTerm = searchParams.get("searchTerm") || "";
  const sortDirection = searchParams.get("sortDirection") || "desc";

  const skip = (page - 1) * limit;

  // Construir filtro de búsqueda sensible a minúsculas:
  const searchRegex = new RegExp(searchTerm, "i"); // "i" para case-insensitive

  // Filtro OR en varios campos:
  const filter = searchTerm
    ? {
      $or: [
        { name: searchRegex },
        { surname: searchRegex },
        { interestedInName: searchRegex },
        { leadVehicleName: searchRegex },
      ],
    }
    : {};

  // Orden según sortDirection (asc o desc) por updatedAt:
  const sort: { updatedAt?: SortOrder } = {
    updatedAt: sortDirection === "asc" ? 1 : -1,
  };
  try {
    const total = await LeadModel.countDocuments(filter);
    const leads = await LeadModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ msg: "LEAD_GET", leads, total });
  } catch (error) {
    return NextResponse.json({ msg: "GET_LEAD_ERROR", error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);

  try {
    const editedLead = await LeadModel.findByIdAndUpdate(
      { _id: data._id },
      data,
      { new: true }
    );
    return NextResponse.json({ msg: "LEAD_EDITED", editedLead });
  } catch (error) {
    return NextResponse.json({ msg: "EDIT_LEAD_ERROR" });
  }
}

export async function DELETE(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);

  try {
    await LeadModel.findByIdAndDelete(data);
    return NextResponse.json({ msg: "LEAD_DELETED" });
  } catch (error) {
    return NextResponse.json({ msg: "DELETE_LEAD_ERROR" });
  }
}
