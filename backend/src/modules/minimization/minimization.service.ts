import { groupRepository } from "../../database/mongo/group/groupRepository";
import { suggestionRepository } from "../../database/mongo/settled/suggestionRepository";
import { GroupId } from "../../entities/group/GroupId";
import { Suggestion } from "../../entities/settled/Suggestion";
import { UserId } from "../../entities/user/UserId";
import { groupBalanceService } from "../balance/balance.service";

export const groupMinimizationService = async (
  groupId: GroupId,
  requesterId: UserId
): Promise<Suggestion[]> => {
  // ===============================
  // 1. Validate group
  // ===============================
  const groupExists = await groupRepository.exists(groupId);
  if (!groupExists) {
    const error = new Error("Group Not Found!");
    (error as any).name = "GroupNotFoundError";
    throw error;
  }

  const isMember = await groupRepository.findGroupMember(groupId, requesterId);
  if (!isMember) {
    const error = new Error("User is not a member of group!");
    (error as any).name = "UserNotGroupMemberError";
    throw error;
  }

  // ===============================
  // 2. Get current balances
  // ===============================
  const balances = await groupBalanceService({ groupId, requesterId });
  if (!balances) {
    const error = new Error("Error in balance fetching!");
    (error as any).name = "BalanceFetchingError";
    throw error;
  }

  const creditors = balances
    .filter((b) => b.netBalance > 0)
    .sort((a, b) => b.netBalance - a.netBalance);

  const debtors = balances
    .filter((b) => b.netBalance < 0)
    .sort((a, b) => a.netBalance - b.netBalance);

  // ===============================
  // 3. Compute new suggestions (IN MEMORY ONLY)
  // ===============================
  const computed: {
    who: string;
    whom: string;
    amount: number;
  }[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    if (!debtor || !creditor) break;

    const debit = Math.min(
      Math.abs(debtor.netBalance),
      creditor.netBalance
    );

    computed.push({
      who: debtor.userId.toString(),
      whom: creditor.userId.toString(),
      amount: Number(debit.toFixed(2)),
    });

    debtor.netBalance += debit;
    creditor.netBalance -= debit;

    if (debtor.netBalance === 0) i++;
    if (creditor.netBalance === 0) j++;
  }

  // ===============================
  // 4. Fetch existing pending suggestions
  // ===============================
  const existing =
    await suggestionRepository.getPendingSuggestionsByGroup(groupId);

  // Convert to comparable format
  const existingComparable = existing.map((s) => ({
    who: s.who.toString(),
    whom: s.whom.toString(),
    amount: s.amount,
  }));

  // ===============================
  // 5. If nothing changed → return existing
  // ===============================
  const isSame =
    existingComparable.length === computed.length &&
    existingComparable.every((e) =>
      computed.some(
        (c) =>
          c.who === e.who &&
          c.whom === e.whom &&
          c.amount === e.amount
      )
    );

  if (isSame) {
    return existing;
  }

  // ===============================
  // 6. Otherwise → replace only pending suggestions
  // ===============================
  await suggestionRepository.deletePendingSuggestionsByGroup(groupId);

  const created: Suggestion[] = [];

  for (const s of computed) {
    const suggestion = await suggestionRepository.createSuggestion({
      groupId,
      who: new UserId(s.who),
      whom: new UserId(s.whom),
      amount: s.amount,
    });

    if (suggestion) created.push(suggestion);
  }

  return created;
  
};