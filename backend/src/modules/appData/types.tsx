import { UserId } from "../../entities/user/UserId";


export interface CashFlowAppData {
  dashboard: {
    user: {
      id: UserId | null;
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
      groupName: string;
      groupStatus: "active" | "balanced";
      membersCount: number;
      memberList: string[];

      // overview of the group
      overview: {
        totalExpensesAmount: number;
        yourNetBalance: number;
        recentTransctionList : {
          timeOfpaid: Date;
          transactionName: string;
          amount: number;
        }[]
      };

      // expenses reconrds of the group
      expenses: {
        expensesList: {
          nameOfExpense: string;
          paidBy: string; // username of paid member
          amount: number;
        }[]
      };

      // user settlement of the group
      settlements: {
        listOfSettelments: {
          who: string; // payer username
          whom: string // creditor username
          amount: number;
        }[]
      }
    }[];
  };

  expenses: {
    header: {
      totalExpenses: number;
      totalYouPaid: number;
      totalYouOwe: number;
    };

    // expenses records of all user groups
    expenses: {
      expenseName: string;
      groupName: string;
      paidBY: string; // payer's username
      totalAmount: number;
      userShare: number;
      status: "pending" | "settled";
      createdAt: string;
    }[];
  };

  settlements: {
    summary: {
      totalYouOwe: number;
      totalYouAreOwed: number;
      netPosition: number;
    };

    settlementSuggestions: {
      amount: number;
      status: "pending";
      from: string;  // debtor username
      to: string; // creditor username
      groupName: string; // settlement group name
      creditedAt: Date; // date of settlement creation
    }[];

    settlementHistory: {
      who: string; // debtor username
      whom: string; // creditor username
      amount: number;
      settledAt: Date; // date of settlement
    }[];
  };
}

export const guestDefaultData: CashFlowAppData = {
  dashboard: {
    user: {
      id: null,
      username: "Guest",
      profileImageUrl: null,
      email: "useremailaddress@gmail.com"
    },

    globalFinancialOverview: {
      totalGroupsJoined: 0,
      totalExpensesRecorded: 0,
      totalPendingSettlements: 0,
      totalSettledTransactions: 0
    },

    debtStatus: {
      totalActiveDebtAmount: 0,
      totalActiveGroups: 0,
      youOwe: 0,
      youAreOwed: 0,
      balancedGroups: 0,
      netPosition: 0
    },

    optimizationStats: {
      totalNaiveTransactions: 0,
      totalOptimizedTransactions: 0,
      transactionsSaved: 0
    }
  },

  groups: {
    header: {
      totalGroupsJoined: 0,
      youOwe: 0,
      youAreOwed: 0
    },

    groups: [
      {
        groupName: "",
        groupStatus: "active",
        membersCount: 0,
        memberList: [],

        overview: {
          totalExpensesAmount: 0,
          yourNetBalance: 0,
          recentTransctionList: [
            {
              timeOfpaid: new Date(0),
              transactionName: "",
              amount: 0
            }
          ]
        },

        expenses: {
          expensesList: [
            {
              nameOfExpense: "",
              paidBy: "",
              amount: 0
            }
          ]
        },

        settlements: {
          listOfSettelments: [
            {
              who: "",
              whom: "",
              amount: 0
            }
          ]
        }
      }
    ]
  },

  expenses: {
    header: {
      totalExpenses: 0,
      totalYouPaid: 0,
      totalYouOwe: 0
    },

    expenses: [
      {
        expenseName: "",
        groupName: "",
        paidBY: "",
        totalAmount: 0,
        userShare: 0,
        status: "pending",
        createdAt: ""
      }
    ]
  },

  settlements: {
    summary: {
      totalYouOwe: 0,
      totalYouAreOwed: 0,
      netPosition: 0
    },

    settlementSuggestions: [
      {
        amount: 0,
        status: "pending",
        from: "",
        to: "",
        groupName: "",
        creditedAt: new Date(0)
      }
    ],

    settlementHistory: [
      {
        who: "",
        whom: "",
        amount: 0,
        settledAt: new Date(0)
      }
    ]
  }
};