import { TaskFragment, UserTaskFragment } from '@/gql/graphql';
import { Button } from '@/components/Button/Button';
import { useDispatch } from 'react-redux';
import { operationClaimTask } from '@/model/user/operations';
import { minutesSinceUTCDate } from '@/utils/date';
import { useModalContext } from '@/contexts/ModalContext';
interface LinkModalProps {
	task: TaskFragment;
	userTask?: UserTaskFragment;
}

export function LinkModal(props: LinkModalProps) {
	const { task, userTask } = props;
	const dispatch = useDispatch();
	const { closeModal } = useModalContext();
	const isTimeOut = userTask?.updated_at
		? minutesSinceUTCDate(userTask?.updated_at || '') > 1
		: true;
	const onClick = () => {
		dispatch(operationClaimTask({ type: 'link', userTask, task }));
		if (userTask?.status === 'pending' && isTimeOut) {
			closeModal();
		}
	};

	return (
		<div className={'mb-[20px]'}>
			{!userTask?.status && (
				<Button onClick={onClick} variant={'filled'}>
					Start
				</Button>
			)}
			{userTask?.status === 'pending' && !isTimeOut && (
				<Button onClick={() => {}} variant={'filled'}>
					Checking...
				</Button>
			)}
			{userTask?.status === 'pending' && isTimeOut && (
				<Button onClick={onClick} variant={'filled'}>
					Claim reward!
				</Button>
			)}
		</div>
	);
}
