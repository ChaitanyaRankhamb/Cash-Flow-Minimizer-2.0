import { SettlementRepository } from "../../entities/settlement/settlementRepository";
import { suggestionRepository } from "../../database/mongo/settled/suggestionRepository";
import { GroupRepository } from "../../entities/group/GroupRepository";
import { GroupId } from "../../entities/group/GroupId";
import { SuggestionId } from "../../entities/settled/SuggestionId";
import { Settlement } from "../../entities/settlement/settlement";
import { UserId } from "../../entities/user/UserId";
import { groupRepository } from "../../database/mongo/group/groupRepository";
import { isConfirmValidation } from "./suggestionSettlement.confirmValidation";
import { settlementRepository } from "../../database/mongo/settlement/settlementRepository";

export const ConfirmSettlementService = async (
  groupId: GroupId,
  suggestionId: SuggestionId,
  confirmedBy: UserId,
  paymentMethod: string
): Promise<Settlement | null> => {

  // check group exist with groupId
  const isGroup = await groupRepository.exists(groupId);
  if (!isGroup) {
    throw (
      (Object.assign(new Error("Group Not Found!")),
      {
        name: "GroupNotFoundError",
      })
    );
  }

  const isMember = await groupRepository.findGroupMember(groupId, confirmedBy);
  if (!isMember) {
    throw (
      (Object.assign(new Error("User Not Group Member!")),
      {
        name: "UserNotGroupMemberError",
      })
    );
  }

  const suggestion = await suggestionRepository.getSuggestionByIdAndGroup(new GroupId(groupId.toString()), new SuggestionId(suggestionId.toString()));

  console.log(suggestion);
  console.log(groupId, suggestionId);

  //suggestion validation
  if (!suggestion) {
    throw Object.assign(new Error("Suggestion not found"), {
      name: "SuggestionNotFoundError",
    });
  }

  // Suggestion must belong to the group
  if (suggestion.groupId.toString() !== groupId.toString()) {
    throw Object.assign(new Error("Suggestion does not belong to this group"), {
      name: "SuggestionGroupMismatchError",
    });
  }

  // Suggestion must not be already settled
  if (suggestion.isSettled) {
    throw Object.assign(new Error("Suggestion already settled"), {
      name: "SuggestionAlreadySettledError",
    });
  }

  // confirmedBy must belongs from who, whom or group admin
  const isValidMember = await isConfirmValidation(
    confirmedBy.toString(),
    suggestion.who.toString(),
    suggestion.whom.toString(),
    groupId.toString()
  );

  if (!isValidMember) {
    throw Object.assign(
      new Error("User not authorized to confirm settlement"),
      {
        name: "SettlementConfirmationForbiddenError",
      }
    );
  }

  // create new settlement record
  const settlement = await settlementRepository.createSettlement({
    groupId,
    suggestionId: suggestionId.toString(),
    who: suggestion.who,
    whom: suggestion.whom,
    amount: suggestion.amount,
    confirmedBy,
    paymentMethod,
  });

  if (!settlement) {
    throw Object.assign(new Error("Failed to create settlement"), {
      name: "SettlementCreationFailedError",
    });
  }

  // make suggestion settled
  await suggestionRepository.markAsSettled(suggestionId);

  return settlement;
};
