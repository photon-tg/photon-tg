import { CoreUserFieldsFragment } from '@/gql/graphql';

export type AuthData = {
	id: string;
	telegram: WebAppUser;
	referrerId: string | null;
}

export type User = CoreUserFieldsFragment & AuthData & {
	isDailyRewardClaimed: boolean;
};
