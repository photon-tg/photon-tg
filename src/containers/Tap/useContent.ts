import { useIntl } from 'react-intl';

export function useContent() {
	const intl = useIntl();
	return {
		profitPerHour: intl.formatMessage({
			id: 'profit-per-hour',
			defaultMessage: 'Profit per hour',
		}),
		languages: intl.formatMessage({
			id: 'languages',
			defaultMessage: 'Languages',
		}),
	};
}
