import { defineType } from 'sanity';

export const taskType = defineType({
	title: 'Task',
	name: 'task',
	type: 'document',
	fields: [
		defineType({
			title: 'Name',
			name: 'name',
			type: 'i18n.string',
		}),
		defineType({
			title: 'Description',
			name: 'description',
			type: 'i18n.text',
		}),
		defineType({
			title: 'Type',
			name: 'type',
			type: 'string',
			options: {
				list: [
					{ title: 'Link', value: 'link' },
					{ title: 'Daily reward', value: 'daily_reward' },
					{ title: 'Daily photo', value: 'daily_photo' },
					{ title: 'Daily photo', value: 'daily_photo' },
				],
				layout: 'radio',
			}
		}),
	]
})
