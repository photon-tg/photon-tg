import { RegisteredUserState } from '@/model/user/types';
import { ApplicationState } from '@/model/application/types';
import { BattleState } from '@/model/battle/types';
import { TranslationsState } from '@/model/translations/types';

export interface AppState {
	user: RegisteredUserState;
	application: ApplicationState;
	battle: BattleState;
	translations: TranslationsState;
}
