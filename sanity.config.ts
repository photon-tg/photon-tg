import { defineConfig } from 'sanity'
import { I18nFields } from 'sanity-plugin-i18n-fields';
import { schema } from './sanity/schemaTypes';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

export default defineConfig({
	projectId: 's63tg1ep',
	dataset: 'production',
	plugins: [structureTool({ name: 'Photon', title: 'Content' }), I18nFields({
		ui: {
			position: 'bottom'
		},
		locales: [
			{ code: 'en', label: 'en', title: 'English', default: true },
			{ code: 'ru', label: 'ru', title: 'Russian', default: false },
		],
	}), visionTool()],
	schema: schema,
});
