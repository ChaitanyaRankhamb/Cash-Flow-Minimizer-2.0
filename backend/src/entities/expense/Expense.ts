import { GroupId } from "../group/GroupId";
import { UserId } from "../user/UserId";
import { ExpenseId } from "./ExpenseId";

export interface SplitTypeData {
  equal?: number[];
  exact?: number[];
  percentage?: number[];
}

export class Expense {
  constructor(
    public readonly _id: ExpenseId,
    public groupId: GroupId,
    public paidBy: UserId,
    public createdBy: UserId,
    public title: string,
    public totalAmount: number,
    public splitType: SplitTypeData,
    public expenseDate: Date,
    public notes?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public isDeleted: boolean = false
  ) {}

  validateSplit() {
    if (this.splitType.percentage) {
      const sum = this.splitType.percentage.reduce((a, b) => a + b, 0);
      if (sum !== 100) throw new Error("Percentage split must sum to 100");
    }
    if (this.splitType.exact) {
      const sum = this.splitType.exact.reduce((a, b) => a + b, 0);
      if (sum !== this.totalAmount)
        throw new Error("Exact split must equal totalAmount");
    }
  }
}
