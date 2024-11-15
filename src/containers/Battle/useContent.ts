import { useIntl } from 'react-intl';

export function useContent() {
	const intl = useIntl();
	return {
		timeLeftForVoting: intl.formatMessage({
			id: 'time-left-for-voting',
			defaultMessage: 'Time left for voting',
		}),
		battlesRules: intl.formatMessage({
			id: 'battles-rules',
			defaultMessage: `
				<div>
					<span>Choose a photo</span>
					<ul>
						<li>Authors get coins for likes</li>
						<li>You get coins for voting</li>
					</ul>
				</div>
			`,
		}),
		joinCurrentBattle: intl.formatMessage({
			id: 'join-current-battle',
			defaultMessage: 'Join current battle',
		}),
		joinNextBattle: intl.formatMessage({
			id: 'join-next-battle',
			defaultMessage: 'Join next battle',
		}),
		checkBattleLeaders: intl.formatMessage({
			id: 'check-battle-leaders',
			defaultMessage: 'Check battle leaders',
		}),
		topOfTheDay: intl.formatMessage({
			id: 'top-of-the-day',
			defaultMessage: 'Top of the day',
		}),
		youHaveNotJoinedTheBattleYet: intl.formatMessage({
			id: 'you-have-not-joined-the-battle-yet',
			defaultMessage: 'You have not joined the battle yet',
		}),
		youHaveMissedTheBattle: intl.formatMessage({
			id: 'you-have-missed-the-battle',
			defaultMessage: 'You have missed the battle',
		}),
		youHaveJoined: intl.formatMessage({
			id: 'you-have-joined',
			defaultMessage: 'You have joined',
		}),
		joinTheBattle: intl.formatMessage({
			id: 'join-the-battle',
			defaultMessage: 'Join the battle',
		}),
		youAreAGreatJudge: intl.formatMessage({
			id: 'you-are-a-great-judge',
			defaultMessage: 'You are a great judge',
		}),
		thereAreNoPhotos: intl.formatMessage({
			id: 'there-are-no-photos',
			defaultMessage: 'There are no photos to choose from yet',
		}),
		notEnoughEnergy: intl.formatMessage({
			id: 'not-enough-energy',
			defaultMessage: 'Not enough energy to vote',
		}),
		waitToRecover: intl.formatMessage({
			id: 'wait-to-recover',
			defaultMessage: 'Wait for some time for it to recover',
		}),
	};
}
