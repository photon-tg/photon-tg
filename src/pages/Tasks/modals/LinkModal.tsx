import { TaskFragment, UserTaskFragment } from '@/gql/graphql';
import { Button } from '@/components/Button/Button';
import { useDispatch } from 'react-redux';
import { minutesSinceUTCDate } from '@/utils/date';
import { useModalContext } from '@/contexts/ModalContext';
import { operationTaskClaim } from '@/model/user/operations/operationTaskClaim';
interface LinkModalProps {
	task: TaskFragment;
	userTask?: UserTaskFragment;
}

export function LinkModal(props: LinkModalProps) {
	const { task, userTask } = props;
	const dispatch = useDispatch();
	const { closeModal } = useModalContext();
	const minutesPassed = minutesSinceUTCDate(userTask?.updated_at || '');
	const isTimeOut = userTask?.updated_at ? minutesPassed > 9 : true;
	const onClick = () => {
		dispatch(operationTaskClaim({ type: 'link', userTask, task }));
		if (userTask?.status === 'pending' && isTimeOut) {
			closeModal();
		}
	};

	return (
		<div className={'mb-[20px]'}>
			{!userTask?.status && (
				<Button onClick={onClick} variant={'filled'}>
					{task.cta_text || 'Start'}
				</Button>
			)}
			{userTask?.status === 'pending' && !isTimeOut && (
				<Button onClick={() => {}} variant={'filled'}>
					Claim reward in {10 - minutesPassed} minutes
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
