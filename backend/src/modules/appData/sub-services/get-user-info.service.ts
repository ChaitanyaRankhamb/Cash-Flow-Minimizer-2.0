import { userRepository } from "../../../database/mongo/user/userRepository";
import { UserId } from "../../../entities/user/UserId";

export const getUserInfo = async (idStr: string) => {
  const usernameCache = new Map<
    string,
    { username: string; image: string | null }
  >();

  if (usernameCache.has(idStr)) return usernameCache.get(idStr)!;

  const u = await userRepository.findUserByID(new UserId(idStr));
  const value = {
    username: u?.username ?? "",
    image: u?.image ?? null,
  };
  usernameCache.set(idStr, value);
  return value;
};
