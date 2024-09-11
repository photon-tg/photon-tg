import { RegisteredUserState } from '@/model/user/types';
import { ApplicationState } from '@/model/application/types';

export interface AppState {
	user: RegisteredUserState;
	application: ApplicationState;
}
