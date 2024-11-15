import { RegisteredUserState } from '@/model/user/types';
import { ApplicationState } from '@/model/application/types';
import { BattleState } from '@/model/battle/types';

export interface AppState {
	user: RegisteredUserState;
	application: ApplicationState;
	battle: BattleState;
}
