import { suggestionRepository } from "../../../database/mongo/settled/suggestionRepository";
import { settlementRepository } from "../../../database/mongo/settlement/settlementRepository";
import { UserId } from "../../../entities/user/UserId";

export const BuildSuggestionsForUI = async (
  userId: UserId,
) => {
  const pendingSuggestions =
      await suggestionRepository.getPendingSuggestionsByUser(userId);
  
    const userSettlements =
      await settlementRepository.findSettlementsByUser(userId);

 const suggestionsPendingForUi = pendingSuggestions.map((s) => ({
    id: s._id.toString(),
    groupId: s.groupId.toString(),
    amount: s.amount,
    status: s.isSettled ? ("settled" as const) : ("pending" as const),
    fromUserId: s.who.toString(),
    toUserId: s.whom.toString(),
    creditedAt: s.creditedAt.toISOString(),
  }));

  const suggestionHistoryForUi = userSettlements.map((s) => ({
    id: s.id.toString(),
    whoUserId: s.who.toString(),
    whomUserId: s.whom.toString(),
    amount: s.amount,
    settledAt: new Date(0).toISOString(),
  }));

  return {
    suggestionsPendingForUi,
    suggestionHistoryForUi
  }
}