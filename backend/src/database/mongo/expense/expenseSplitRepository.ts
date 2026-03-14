import type {
  CreateExpenseSplitData,
  ExpenseSplitRepository as IExpenseSplitRepository,
} from "../../../entities/expense/ExpenseSplitRepository";
import { ExpenseSplit } from "../../../entities/expense/ExpenseSplit";
import { ExpenseSplitId } from "../../../entities/expense/ExpenseSplitId";
import { ExpenseId } from "../../../entities/expense/ExpenseId";
import { UserId } from "../../../entities/user/UserId";
import { ExpenseSplitDocument, ExpenseSplitModel } from "./expenseSplitSchema";

// Convert Mongoose document -> Domain entity
function docToExpenseSplit(doc: ExpenseSplitDocument): ExpenseSplit {
  return new ExpenseSplit(
    new ExpenseSplitId(doc._id.toString()),
    new ExpenseId(doc.expenseId.toString()),
    new UserId(doc.userId.toString()),
    doc.amount,
    typeof doc.percentage === "number" ? doc.percentage : undefined,
    doc.isSettled,
    doc.createdAt
  );
}

export class MongoExpenseSplitRepository implements IExpenseSplitRepository {
  async createExpenseSplit(
    data: CreateExpenseSplitData
  ): Promise<ExpenseSplit> {
    // Only include percentage if it's defined
    const toCreate: any = {
      expenseId: data.expenseId.toString(),
      userId: data.userId.toString(),
      amount: data.amount,
      isSettled: data.isSettled ?? false,
      createdAt: new Date(),
    };
    if (typeof data.percentage === "number") {
      toCreate.percentage = data.percentage;
    }
    const doc = await ExpenseSplitModel.create(toCreate);
    return docToExpenseSplit(doc);
  }

  async getExpenseSplitById(
    expenseSplitId: ExpenseSplitId
  ): Promise<ExpenseSplit | null> {
    const doc = await ExpenseSplitModel.findById(expenseSplitId.toString());
    return doc ? docToExpenseSplit(doc) : null;
  }

  async getExpenseSplitsByExpenseId(
    expenseId: ExpenseId
  ): Promise<ExpenseSplit[]> {
    const docs = await ExpenseSplitModel.find({
      expenseId: expenseId.toString(),
    });
    console.log(docs);
    return docs.map(docToExpenseSplit);
  }

  async getExpenseSplitsByExpenseIds(
    expenseIds: ExpenseId[]
  ): Promise<ExpenseSplit[]> {
    const docs = await ExpenseSplitModel.find({
      expenseId: { $in: expenseIds.map((id) => id.toString()) },
    });
    return docs.map(docToExpenseSplit);
  }

  async getExpenseSplitsByUserId(userId: UserId): Promise<ExpenseSplit[]> {
    const docs = await ExpenseSplitModel.find({
      userId: userId.toString(),
    });
    return docs.map(docToExpenseSplit);
  }

  async markExpenseSplitAsSettled(
    expenseSplitId: ExpenseSplitId
  ): Promise<ExpenseSplit> {
    const doc = await ExpenseSplitModel.findByIdAndUpdate(
      expenseSplitId.toString(),
      {
        isSettled: true,
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!doc) throw new Error("ExpenseSplit not found");
    return docToExpenseSplit(doc);
  }

  async deleteExpenseSplits(expenseId: ExpenseId): Promise<boolean> {
    const result = await ExpenseSplitModel.deleteMany({
      expenseId: expenseId.toString(),
    });
    return result.deletedCount > 0;
  }
}

export const expenseSplitRepository = new MongoExpenseSplitRepository();
