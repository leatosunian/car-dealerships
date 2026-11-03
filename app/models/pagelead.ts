import { Document, model, Schema, models } from "mongoose";

export interface IPageLead extends Document {
  name: string;
  surname: string;
  phone: string;
  _id?: string;
  status: string;
  updatedAt?: string;
  createdAt?: string;
  vehicleYear: string;
  vehicleInfo: string; // marca, modelo y versión del vehiculo
  vehicleKm: string;
  employeeAsignedID: string;
}

const pageLeadSchema: Schema = new Schema<IPageLead>(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    vehicleYear: {
      type: String,
      required: true,
    },
    vehicleInfo: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    vehicleKm: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    employeeAsignedID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const PageLeadModel = models.page_leads || model("page_leads", pageLeadSchema);

export default PageLeadModel;
