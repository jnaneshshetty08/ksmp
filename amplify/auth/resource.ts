import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your authentication resource
 * @see https://docs.amplify.aws/react/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    // External providers can be added later when needed
    // externalProviders: {
    //   callbackUrls: ['http://localhost:3000/'],
    //   logoutUrls: ['http://localhost:3000/'],
    //   domainPrefix: 'your-domain-prefix',
    // },
  },
  /**
   * enable multifactor authentication
   * @see https://docs.amplify.aws/react/build-a-backend/auth/enable-mfa
   */
  // multifactor: {
  //   mode: 'OPTIONAL',
  //   totp: true,
  //   sms: true,
  // },
  userAttributes: {
    /** request additional attributes for your app's users */
    // profilePicture: {
    //   mutable: true,
    //   required: false,
    // },
  },
  groups: ['admin', 'mentor', 'student'],
});
