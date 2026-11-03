import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import BudgetModel from "@/app/models/budget";
import BudgetBonifModel from "@/app/models/budgetbonif";
import connectDB from "@/lib/db";
import TaskModel from "@/app/models/task";
import LeadModel from "@/app/models/lead";

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const data = await request.json();
    console.log('data', data);

    data.budgetData.clientPhone = Number(data.budgetData.clientPhone);
    data.budgetData.transfer = Number(data.budgetData.transfer);
    data.budgetData.clientVehiclePrice = Number(data.budgetData.clientVehiclePrice);
    data.budgetData.clientVehicleYear = Number(data.budgetData.clientVehicleYear);
    data.budgetData.clientVehicleKilometers = Number(data.budgetData.clientVehicleKilometers);
    if (data.budgetData.MLValue) {
      data.budgetData.MLValue = Number(data.budgetData.MLValue);
    }
    if (data.budgetData.infoAutosValue) {
      data.budgetData.infoAutosValue = Number(data.budgetData.infoAutosValue);
    }

    const uploadedBudget = await BudgetModel.create(data.budgetData);
    console.log('uploadedBudget', uploadedBudget);
    const updateLeadStatus = await LeadModel.findOneAndUpdate(
      { _id: data.budgetData.leadID },
      { status: "Negociando" },
      { new: true }
    );
    console.log('updateLeadStatus', updateLeadStatus);
    const taskHistory = await TaskModel.create({
      leadID: data.budgetData.leadID,
      title: "Presupuesto creado",
      observations: `El presupuesto N° ${data.budgetData.budgetNumber} fue creado.`,
      dateToDo: new Date(),
      completedDate: new Date(),
      status: "Completada",
    });
    console.log('taskHistory', taskHistory);

    if (data.bonifs.length > 0) {
      data.bonifs.map(async (bonif: any) => {
        bonif.budgetID = uploadedBudget._id;
        bonif.leadID = data.budgetData.leadID;
        const uploadedBudgetBonif = await BudgetBonifModel.create(bonif);
        console.log(uploadedBudgetBonif);
      });
    }
    return NextResponse.json({ msg: "BUDGET_UPLOADED", uploadedBudget });
  } catch (error: any) {
    console.error("Error al crear presupuesto:", error.message, error);
    return NextResponse.json(
      {
        msg: "BUDGET_UPLOAD_ERROR",
        error: error.message,
        detail: error.errors || error,
      },
      { status: 400 }
    );
  }
}
