import { createAction } from '@reduxjs/toolkit';
import { FullTaskFragment } from '@/gql/graphql';
import { ApplicationErrorType } from '@/model/application/types';

export const applicationTasksSet = createAction<FullTaskFragment[]>(
	'application/tasks/set',
);
export const applicationErrorSet = createAction<ApplicationErrorType>(
	'application/error/set',
);
export const applicationIsInitializedSet = createAction<boolean>(
	'application/isInitialized/set',
);
