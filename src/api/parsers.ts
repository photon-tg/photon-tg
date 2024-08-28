import {
	FullTaskFragment,
	FullUserTaskFragment
} from '@/gql/graphql';
import { FullTask, PersonalizedTask } from '@/interfaces/Task';

type GqlResponseCollection<NT> = {
	edges: {
		node: NT;
	}[];
} | undefined | null;

export function parseTasks(tasks: GqlResponseCollection<FullTaskFragment>, userTasks: GqlResponseCollection<FullUserTaskFragment>): PersonalizedTask[] | undefined {
	return tasks?.edges.map(({ node: task }) => {
		const personalizedTaskData = userTasks?.edges.find((userTask) => userTask.node.task_id === task.id)?.node;

		const parsedTask = parseTask(task);

		if (!personalizedTaskData) {
			return parsedTask;
		}

		return {
			...parsedTask,
			userTask: personalizedTaskData,
		}
	});
}

export function parseTask(task: FullTaskFragment): FullTask {
	const modifiedTask: FullTask = { ...task };

	if (typeof modifiedTask.reward_by_day === 'string') {
		modifiedTask.rewardByDay = JSON.parse(modifiedTask.reward_by_day);
	}

	return modifiedTask;
}

// Utility types to omit the __typename field and remove the 'records' wrapper
export type OmitTypenameAndUnwrapRecords<T> = {
	[K in keyof T as Exclude<K, '__typename' | 'records'>]: T[K] extends { records: Array<infer U> }
		? U extends object
			? OmitTypenameAndUnwrapRecords<U>[]
			: U[]
		: OmitTypenameAndUnwrapRecords<T[K]>;
};

// Main parser function
export function parseGraphQLMutationResponse<T extends Record<string, any>>(data: T): OmitTypenameAndUnwrapRecords<T> {
	const result: any = {};

	for (const key in data) {
		if (data[key]?.records) {
			// Directly assign the unwrapped records to the top-level key, stripping __typename
			result[key] = data[key].records.map((record: any) => {
				const { __typename, ...rest } = record;
				return rest;
			});
		} else {
			result[key] = data[key];
		}
	}

	return result as OmitTypenameAndUnwrapRecords<T>;
}
