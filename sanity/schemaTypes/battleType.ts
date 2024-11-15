import { defineType } from 'sanity';

export const battleType = defineType({
	title: 'Battle',
	name: 'battle',
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
			title: 'ID',
			name: 'id',
			type: 'string',
		}),
	]
})
