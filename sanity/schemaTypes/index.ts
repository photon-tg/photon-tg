import { type SchemaTypeDefinition } from 'sanity'
import { battleType } from './battleType';
import { taskType } from './taskType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [battleType, taskType],
}
