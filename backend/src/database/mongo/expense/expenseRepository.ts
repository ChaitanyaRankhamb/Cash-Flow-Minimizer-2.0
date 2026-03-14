import type {
  CreateExpenseData,
  ExpenseRepository as IExpenseRepository,
  UpdateExpenseData,
} from "../../../entities/expense/ExpenseRepository";
import { Expense } from "../../../entities/expense/Expense";
import { ExpenseId } from "../../../entities/expense/ExpenseId";
import { GroupId } from "../../../entities/group/GroupId";
import { UserId } from "../../../entities/user/UserId";
import { ExpenseDocument, ExpenseModel } from "./expenseSchema";

// Convert Mongoose document -> Domain entity
function docToExpense(doc: ExpenseDocument): Expense {
  return new Expense(
    new ExpenseId(doc._id.toString()),
    new GroupId(doc.groupId),
    new UserId(doc.paidBy),
    new UserId(doc.createdBy),
    doc.title,
    doc.totalAmount,
    {
      equal: doc.splitType?.equal ?? [],
      exact: doc.splitType?.exact ?? [],
      percentage: doc.splitType?.percentage ?? [],
    },
    doc.expenseDate,
    doc.notes ?? "",
    doc.createdAt,
    doc.updatedAt,
    doc.isDeleted
  );
}

// Helper function to safely extract splitType arrays from data (fixes linter error on discriminated union)
function getSplitTypeFromData(splitType: any) {
  // If it's a string, return an object with that key as an empty array (it will be populated by recreateSplits)
  if (typeof splitType === "string") {
    return {
      [splitType]: [],
    };
  }

  // If it's not an object, return all empty
  if (typeof splitType !== "object" || splitType === null) return {};
  return {
    ...(Array.isArray(splitType.equal) ? { equal: splitType.equal } : {}),
    ...(Array.isArray(splitType.exact) ? { exact: splitType.exact } : {}),
    ...(Array.isArray(splitType.percentage) ? { percentage: splitType.percentage } : {}),
  };
}

export class MongoExpenseRepository implements IExpenseRepository {
  async createExpense(data: CreateExpenseData): Promise<Expense> {
    const doc = await ExpenseModel.create({
      groupId: data.groupId.toString(),
      paidBy: data.paidBy.toString(),
      createdBy: data.createdBy.toString(),
      title: data.title ?? "",
      totalAmount: data.totalAmount,
      splitType: getSplitTypeFromData(data.splitType),
      expenseDate: data.expenseDate ?? new Date(),
      notes: data.notes ?? "",
      isDeleted: false,
    });
    return docToExpense(doc);
  }

  async getExpenseById(expenseId: ExpenseId): Promise<Expense | null> {
    const doc = await ExpenseModel.findById(expenseId.toString());
    return doc ? docToExpense(doc) : null;
  }

  async getExpensesByGroup(groupId: GroupId): Promise<Expense[]> {
    const docs = await ExpenseModel.find({
      groupId: groupId.toString(),
      isDeleted: false,
    });
    return docs.map(docToExpense);
  }

  async getExpenseByIdAndGroup(groupId: GroupId, expenseId: ExpenseId): Promise<Expense | null> {
    const doc = await ExpenseModel.findOne({
      groupId: groupId.toString(),
      _id: expenseId.toString(),
    });
    return doc ? docToExpense(doc) : null;
  }

  async getExpenseBynameAndGroup(groupId: GroupId, title: string): Promise<Expense | null> {
    const doc = await ExpenseModel.findOne({
      groupId: groupId.toString(),
      title: title,
      isDeleted: false,
    });
    return doc ? docToExpense(doc) : null;
  }

  async updateExpense(data: UpdateExpenseData): Promise<Expense | null> {
    const updateFields: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.paidBy) updateFields.paidBy = data.paidBy.toString();
    if (data.createdBy) updateFields.createdBy = data.createdBy.toString();
    if (data.title !== undefined) updateFields.title = data.title;
    if (data.totalAmount !== undefined) updateFields.totalAmount = data.totalAmount;
    if (data.description !== undefined) updateFields.description = data.description;
    if (data.expenseDate !== undefined) updateFields.expenseDate = data.expenseDate;
    if (data.notes !== undefined) updateFields.notes = data.notes;
    if (data.splitType) {
      updateFields.splitType = getSplitTypeFromData(data.splitType);
    }

    const doc = await ExpenseModel.findOneAndUpdate(
      { _id: data.expenseId.toString() },
      updateFields,
      { new: true }
    );
    return doc ? docToExpense(doc) : null;
  }

  async deleteExpense(groupId: GroupId, expenseId: ExpenseId): Promise<Expense | null> {
    const doc = await ExpenseModel.findOneAndDelete({
      _id: expenseId.toString(),
      groupId: groupId.toString(),
    });
    return doc ? docToExpense(doc) : null;
  }
}

export const expenseRepository = new MongoExpenseRepository();
