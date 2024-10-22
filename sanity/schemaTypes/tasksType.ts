import { defineField, defineType } from '@sanity/types';
import { taskType } from './taskType';

export const tasksType = defineType({
	name: 'tasks',
	title: 'Tasks',
	type: 'document',
	fields: [
		defineField({
			name: 'Task',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: taskType.name }] }]
		})
	]
});
