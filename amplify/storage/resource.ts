import { defineStorage } from '@aws-amplify/backend';

/**
 * Define and configure your storage resource
 * @see https://docs.amplify.aws/react/build-a-backend/storage
 */
export const storage = defineStorage({
  name: 'kalpla-storage',
  access: (allow) => ({
    'profile-pictures/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'assignments/*': [
      allow.authenticated.to(['read', 'write']),
      allow.groups(['mentor']).to(['read', 'write', 'delete']),
      allow.groups(['admin']).to(['read', 'write', 'delete']),
    ],
    'recordings/*': [
      allow.authenticated.to(['read']),
      allow.groups(['mentor']).to(['read', 'write', 'delete']),
      allow.groups(['admin']).to(['read', 'write', 'delete']),
    ],
    'documents/*': [
      allow.authenticated.to(['read', 'write']),
      allow.groups(['admin']).to(['read', 'write', 'delete']),
    ],
  }),
});
