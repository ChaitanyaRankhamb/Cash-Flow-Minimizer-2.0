import { GroupId } from "../group/GroupId";
import { UserId } from "../user/UserId";
import { Expense } from "./Expense";
import { ExpenseId } from "./ExpenseId";

export type SplitType = "equal" | "exact" | "percentage";

export interface CreateExpenseData {
  groupId: GroupId;
  paidBy: UserId;
  createdBy: UserId;
  title?: string,
  totalAmount: number;
  splitType: SplitType,
  splits: {
    userId: UserId;
    value?: number;
  }[];
  description?: string;
  expenseDate?: Date; // optional, defaults to now
  notes?: string;
}

export interface UpdateExpenseData {
  expenseId: ExpenseId;
  groupId: GroupId,
  paidBy?: UserId;
  createdBy?: UserId;
  title?: string;
  totalAmount?: number;
  splitType:SplitType,
  splits?: {
    userId: UserId;
    value?: number;
  }[];
  description?: string;
  expenseDate?: Date;
  notes?: string;
}

export interface ExpenseRepository {
  createExpense(data: CreateExpenseData): Promise<Expense>;

  getExpenseById(expenseId: ExpenseId): Promise<Expense | null>;

  getExpensesByGroup(groupId: GroupId): Promise<Expense[]>;

  getExpenseByIdAndGroup(groupId: GroupId, expenseId: ExpenseId): Promise<Expense | null>;

  getExpenseBynameAndGroup(groupId: GroupId, title: string): Promise<Expense | null>;

  updateExpense(data: UpdateExpenseData) : Promise<Expense |null>;

  deleteExpense(groupId: GroupId, expenseId: ExpenseId): Promise<Expense | null>;
}
