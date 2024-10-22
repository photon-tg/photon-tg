import { type SchemaTypeDefinition } from 'sanity'
import { taskType } from './taskType';
import { tasksType } from './tasksType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [taskType, tasksType],
}
