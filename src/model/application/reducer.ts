import { ApplicationState, Task } from '@/model/application/types';
import { createReducer } from '@reduxjs/toolkit';
import {
	applicationErrorSet,
	applicationIsInitializedSet,
	applicationTasksSet,
} from '@/model/application/actions';

export const getInitialState = (): ApplicationState => ({
	data: {
		tasks: [],
	},
	meta: {
		error: null,
		isInitialized: false,
	},
});

const initialState = getInitialState();

const applicationReducer = createReducer<ApplicationState>(
	initialState,
	(builder) =>
		builder
			.addCase(applicationTasksSet, (draftState, { payload: tasks }) => {
				const newTasks: Task[] = tasks.map((task) => ({
					...task,
					rewardByDay: task.reward_by_day && JSON.parse(task.reward_by_day),
					rewardByLevel:
						task.reward_by_level && JSON.parse(task.reward_by_level),
					textByDate: task.text_by_date && JSON.parse(task.text_by_date),
				}));

				draftState.data.tasks = newTasks;
			})
			.addCase(applicationErrorSet, (draftState, { payload: error }) => {
				draftState.meta.error = error;
			})
			.addCase(
				applicationIsInitializedSet,
				(draftState, { payload: isInitialized }) => {
					draftState.meta.isInitialized = isInitialized;
				},
			),
);

export default applicationReducer;
