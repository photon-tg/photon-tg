// sanity.config.js
import { defineConfig } from 'sanity';
import { schema } from './sanity/schemaTypes';
import { structureTool } from 'sanity/structure';
import { I18nFields } from 'sanity-plugin-i18n-fields';

export default defineConfig({
	title: 'Photon',
	projectId: 'pq53z0fe',
	dataset: 'production',
	plugins: [structureTool(), I18nFields({
		ui: {
			position: 'bottom'
		},
		locales: [
			{ code: 'en', label: 'en', title: 'English', default: true },
			{ code: 'ru', label: 'ru', title: 'Russian', default: false },
		]
	})],
	schema: schema,
});
