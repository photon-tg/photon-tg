import { defineField, defineType } from '@sanity/types';

export const taskType = defineType({
	name: 'taks',
	title: 'Task',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Name',
			type: 'i18n.string'
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'i18n.text',
		}),
		defineField({
			name: 'cta_text',
			title: 'CTA text',
			type: 'i18n.string',
		}),
		defineField({
			name: 'reward_coins',
			title: 'Reward coins',
			type: 'number',
		})
	]
});
