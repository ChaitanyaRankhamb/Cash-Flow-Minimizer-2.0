import mongoose, { Schema, Document, Types } from "mongoose";
import z from "zod";

export interface ExpenseDocument extends Document {
  _id: Types.ObjectId;
  groupId: string;      // GroupId as string (reference to Group)
  paidBy: string;       // UserId as string (reference to User)
  createdBy: string;    // UserId as string (reference to User)
  title: string;
  totalAmount: number;
  splitType: {
    equal?: number[];
    exact?: number[];
    percentage?: number[];
  };
  expenseDate: Date;
  notes?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Zod schema for validation
export const ExpenseZodSchema = z.object({
  groupId: z.string().min(1, "GroupId is required"),
  paidBy: z.string().min(1, "PaidBy (UserId) is required"),
  createdBy: z.string().min(1, "CreatedBy (UserId) is required"),
  title: z.string().min(3).max(100),
  totalAmount: z.number().positive(),
  splitType: z.object({
    equal: z.array(z.number()).optional(),
    exact: z.array(z.number()).optional(),
    percentage: z.array(z.number()).optional(),
  }),
  expenseDate: z.date(),
  notes: z.string().max(500).optional(),
  isDeleted: z.boolean().default(false),
});

// Mongoose schema
const ExpenseSchema = new Schema<ExpenseDocument>(
  {
    groupId: { type: String, ref: "Group", required: true },
    paidBy: { type: String, ref: "User", required: true },
    createdBy: { type: String, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true },
    splitType: {
      equal: { type: [Number], default: undefined },
      exact: { type: [Number], default: undefined },
      percentage: { type: [Number], default: undefined },
    },
    expenseDate: { type: Date, required: true },
    notes: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.model<ExpenseDocument>("Expense", ExpenseSchema);
