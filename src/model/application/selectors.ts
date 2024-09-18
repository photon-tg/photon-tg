import { AppState } from '@/store/types';

export const applicationTasksSelector = (state: AppState) =>
	state.application.data.tasks;
export const applicationIsInitializedSelector = (state: AppState) =>
	state.application.meta.isInitialized;
