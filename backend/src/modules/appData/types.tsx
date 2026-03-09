import { UserId } from "../../entities/user/UserId";

export interface CashFlowAppData {
  dashboard: {
    user: {
      id: string;
      username: string;
      profileImageUrl: string | null;
      email: string | null;
    };

    globalFinancialOverview: {
      totalGroupsJoined: number;
      totalExpensesRecorded: number;
      totalPendingSettlements: number;
      totalSettledTransactions: number;
    };

    debtStatus: {
      totalActiveDebtAmount: number;
      totalActiveGroups: number;
      youOwe: number;
      youAreOwed: number;
      balancedGroups: number;
      netPosition: number;
    };

    optimizationStats: {
      totalNaiveTransactions: number;
      totalOptimizedTransactions: number;
      transactionsSaved: number;
    };
  };

  groups: {
    header: {
      totalGroupsJoined: number;
      youOwe: number;
      youAreOwed: number;
    };

    groups: {
      id: string;
      description: string;

      groupName: string;
      groupStatus: "active" | "balanced";

      createdAt: Date;

      members: {
        userId: string;
        username: string;
        profileImageUrl?: string | null;
      }[];

      overview: {
        totalExpensesAmount: number;
        yourNetBalance: number;
        recentTransctionList: {
          timeOfpaid: string; // ISO string
          transactionName: string;
          amount: number;
        }[];
      };

      expenses: {
        expensesList: {
          id: string;

          nameOfExpense: string;
          paidByUserId: string;

          totalAmount: number;
          createdAt: string;

          splits: {
            userId: string;
            share: number;
          }[];
        }[];
      };

      suggestions: {
        listOfSuggestions: {
          id: string;
          fromUserId: string;
          toUserId: string;
          amount: number;
          creditedAt: string; // ISO string
          status: "pending" | "settled";
        }[];
      };
    }[];
  };

  expenses: {
    header: {
      totalExpenses: number;
      totalYouPaid: number;
      totalYouOwe: number;
    };

    expenses: {
      expenseId: string;
      groupId: string;

      expenseName: string;
      paidByUserId: string;

      totalAmount: number;
      userShare: number;

      status: "pending" | "settled";
      createdAt: string;
    }[];
  };

  suggestions: {
    summary: {
      totalYouOwe: number;
      totalYouAreOwed: number;
      netPosition: number;
    };

    pending: {
      id: string;
      groupId: string;
      amount: number;
      status: "pending" | "settled";
      fromUserId: string;
      toUserId: string;
      creditedAt: string;
    }[];

    history: {
      id: string;
      whoUserId: string;
      whomUserId: string;
      amount: number;
      settledAt: string;
    }[];
  };
}

export const guestDefaultData: CashFlowAppData = {
  dashboard: {
    user: {
      id: "",
      username: "Guest",
      profileImageUrl: null,
      email: null,
    },

    globalFinancialOverview: {
      totalGroupsJoined: 0,
      totalExpensesRecorded: 0,
      totalPendingSettlements: 0,
      totalSettledTransactions: 0,
    },

    debtStatus: {
      totalActiveDebtAmount: 0,
      totalActiveGroups: 0,
      youOwe: 0,
      youAreOwed: 0,
      balancedGroups: 0,
      netPosition: 0,
    },

    optimizationStats: {
      totalNaiveTransactions: 0,
      totalOptimizedTransactions: 0,
      transactionsSaved: 0,
    },
  },

  groups: {
    header: {
      totalGroupsJoined: 0,
      youOwe: 0,
      youAreOwed: 0,
    },
    groups: [],
  },

  expenses: {
    header: {
      totalExpenses: 0,
      totalYouPaid: 0,
      totalYouOwe: 0,
    },
    expenses: [],
  },

  suggestions: {
    summary: {
      totalYouOwe: 0,
      totalYouAreOwed: 0,
      netPosition: 0,
    },
    pending: [],
    history: [],
  },
};
