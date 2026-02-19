import { Schema, model, Document } from "mongoose";

export interface ICalculation extends Document {
  expression: string;
  result: number;
  date: string;   
  time: string;   
  isSpecial: boolean;
}

const calculationSchema = new Schema<ICalculation>(
  {
    expression: { type: String, required: true, trim: true },
    result:     { type: Number, required: true },
    date:       { type: String, required: true, index: true }, // indexed for fast date queries
    time:       { type: String, required: true },
    isSpecial:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Calculation = model<ICalculation>("Calculation", calculationSchema);
