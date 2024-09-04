import { graphql } from '@/gql';

export const CLAIM_FIRST_TASK = graphql(`
	mutation ClaimFirstTask(
		$userId: UUID!,
		$taskId: String!
		$lastDailyReward: Datetime,
		$daysCompleted: Int!,
		$completed: Boolean,
		$coins: Int,
	) {
		updateusersCollection(
			atMost: 1
			set: { last_daily_reward: $lastDailyReward, coins: $coins }
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}

		insertIntouser_tasksCollection(
			objects: [
				{
					user_id: $userId,
					task_id: $taskId,
					days_completed: $daysCompleted,
					completed: $completed,
				}
			]
		) {
			records {
				...FullUserTask
			}
		}
	}
`);

export const CLAIM_TASK = graphql(`
	mutation ClaimTask(
		$userId: UUID!,
		$userTaskId: UUID!
		$lastDailyReward: Datetime,
		$daysCompleted: Int!,
		$completed: Boolean,
		$coins: Int,
	) {
		updateusersCollection(
			atMost: 1
			set: { last_daily_reward: $lastDailyReward, coins: $coins }
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}

		updateuser_tasksCollection(
			atMost: 1
			set: { days_completed: $daysCompleted, completed: $completed }
			filter: { id: { eq: $userTaskId }, user_id: { eq: $userId } }
		) {
			records {
				...FullUserTask
			}
		}
	}
`);









export const CLAIM_DAILY_REWARD = graphql(`
	mutation ClaimDailyReward(
		$userId: UUID!
		$userTaskId: UUID!
		$lastDailyReward: Datetime!
		$daysCompleted: Int!
		$completed: Boolean
		$coins: Int
	) {
		updateusersCollection(
			atMost: 1
			set: { last_daily_reward: $lastDailyReward, coins: $coins }
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}

		updateuser_tasksCollection(
			atMost: 1
			set: { days_completed: $daysCompleted, completed: $completed }
			filter: { id: { eq: $userTaskId }, user_id: { eq: $userId } }
		) {
			records {
				...FullUserTask
			}
		}
	}
`);

export const CLAIM_FIRST_DAILY_REWARD = graphql(`
	mutation ClaimFirstDailyReward(
		$userId: UUID!
		$taskId: String!
		$lastDailyReward: Datetime!
		$daysCompleted: Int!
		$completed: Boolean
		$coins: Int
	) {
		updateusersCollection(
			atMost: 1
			set: { last_daily_reward: $lastDailyReward, coins: $coins }
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}

		insertIntouser_tasksCollection(
			objects: [
				{
					user_id: $userId
					task_id: $taskId
					days_completed: $daysCompleted
					completed: $completed
				}
			]
		) {
			records {
				...FullUserTask
			}
		}
	}
`);

export const UPDATE_DAILY_REWARD_COMPLETED_DAYS = graphql(`
	mutation UpdateDailyRewardCompletedDays(
		$userId: UUID!
		$userTaskId: UUID!
		$completedDays: Int!
	) {
		updateuser_tasksCollection(
			atMost: 1
			set: { days_completed: $completedDays }
			filter: { user_id: { eq: $userId }, id: { eq: $userTaskId } }
		) {
			records {
				...FullUserTask
			}
		}
	}
`);
