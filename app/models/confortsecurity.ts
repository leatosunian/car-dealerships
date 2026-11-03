import { Document, model, Schema, models } from "mongoose";

export interface IConfortSecurity extends Document {
  carID: string;
  key: string;
  value: string;
}

const confortSecuritySchema: Schema = new Schema<IConfortSecurity>(
  {
    carID: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CarConfortSecurityModel = models.car_confortsecurity || model("car_confortsecurity", confortSecuritySchema);

export default CarConfortSecurityModel;
