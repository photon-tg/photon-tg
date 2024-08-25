import { isDateTodayUTC } from "@/utils/date";

export function getIsDailyRewardClaimed(lastClaimedRewardDate: string | null) {
  const isClaimed = lastClaimedRewardDate !== null && isDateTodayUTC(new Date(lastClaimedRewardDate));
  return !!isClaimed;
}
