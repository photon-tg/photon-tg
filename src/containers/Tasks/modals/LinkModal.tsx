import { TaskFragment, UserTaskFragment } from '@/gql/graphql';
import { Button } from '@/components/Button/Button';
import { useDispatch } from 'react-redux';
import { operationClaimTask } from '@/model/user/operations';
interface LinkModalProps {
	task: TaskFragment;
	userTask?: UserTaskFragment;
}

export function LinkModal(props: LinkModalProps) {
	const { task, userTask } = props;
	const dispatch = useDispatch();
	const onClick = () => {
		dispatch(operationClaimTask({ type: 'link', userTask, task }));
	};

	return (
		<div className={'mb-[20px]'}>
			<Button onClick={onClick} variant={'filled'}>
				Start
			</Button>
		</div>
	);
}
