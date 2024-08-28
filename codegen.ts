import type { CodegenConfig } from '@graphql-codegen/cli'
import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset'

const config: CodegenConfig = {
  schema: [
    {
     'https://hnvngbrjzbcenxwmzzrk.supabase.co/graphql/v1': {
        headers: {
          apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhudm5nYnJqemJjZW54d216enJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjk5NDksImV4cCI6MjAzNjkwNTk0OX0.jQPEGgkP_3AERI25_RS2o_7XD-kwUDp690AkgmqtuJc',
        },
      },
    },
  ],
	documents: ['src/**/*.{ts,tsx}'],
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
    'src/gql/': {
      preset: 'client',
      documentTransforms: [addTypenameSelectionDocumentTransform],
			documents: ['src/graphql/queries/*.ts', 'src/graphql/mutations/*.ts', 'src/graphql/fragments/*.ts'],
      plugins: [],
			presetConfig: {
				fragmentMasking: false
			},
      config: {
        scalars: {
          UUID: 'string',
          Date: 'string',
          Time: 'string',
          Datetime: 'string',
          JSON: 'string',
          BigInt: 'string',
          BigFloat: 'string',
          Opaque: 'any',
        },
      },
    },
    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    }
  },
}

export default config
