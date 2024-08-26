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
  documents: 'src/**/*.tsx',
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
    'src/graphql/': {
      preset: 'client',
      documentTransforms: [addTypenameSelectionDocumentTransform],
      plugins: [],
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
