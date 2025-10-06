import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via Cognito can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      cognitoId: a.string().required(),
      email: a.string().required(),
      name: a.string().required(),
      role: a.enum(['STUDENT', 'MENTOR', 'ADMIN']),
      status: a.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
      paymentStatus: a.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
      paymentAmount: a.integer().default(0),
      transactionId: a.string(),
      fcmToken: a.string(),
      enrollmentDate: a.datetime(),
      lastLoginAt: a.datetime(),
      enrollments: a.hasMany('Enrollment', 'userId'),
      submissions: a.hasMany('Submission', 'userId'),
      sessions: a.hasMany('Session', 'mentorId'),
      sessionParticipants: a.hasMany('SessionParticipant', 'userId'),
      notifications: a.hasMany('Notification', 'userId'),
    })
    .authorization(allow => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  Program: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      duration: a.integer().required(), // in months
      price: a.integer().required(),
      isActive: a.boolean().default(true),
      modules: a.hasMany('Module', 'programId'),
      enrollments: a.hasMany('Enrollment', 'programId'),
    })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('admin').to(['create', 'update', 'delete']),
    ]),

  Module: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      order: a.integer().required(),
      programId: a.id().required(),
      program: a.belongsTo('Program', 'programId'),
      assignments: a.hasMany('Assignment', 'moduleId'),
    })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('admin').to(['create', 'update', 'delete']),
    ]),

  Assignment: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      type: a.enum(['QUIZ', 'PROJECT', 'ESSAY']),
      maxScore: a.integer().required(),
      dueDate: a.datetime().required(),
      moduleId: a.id().required(),
      module: a.belongsTo('Module', 'moduleId'),
      submissions: a.hasMany('Submission', 'assignmentId'),
    })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('admin').to(['create', 'update', 'delete']),
    ]),

  Enrollment: a
    .model({
      userId: a.id().required(),
      programId: a.id().required(),
      user: a.belongsTo('User', 'userId'),
      program: a.belongsTo('Program', 'programId'),
      enrollmentDate: a.datetime().required(),
      status: a.enum(['ACTIVE', 'COMPLETED', 'DROPPED']),
    })
    .authorization(allow => [
      allow.owner(),
      allow.group('admin').to(['read', 'update']),
    ]),

  Submission: a
    .model({
      userId: a.id().required(),
      assignmentId: a.id().required(),
      user: a.belongsTo('User', 'userId'),
      assignment: a.belongsTo('Assignment', 'assignmentId'),
      content: a.string(),
      score: a.integer(),
      feedback: a.string(),
      submittedAt: a.datetime().required(),
    })
    .authorization(allow => [
      allow.owner().to(['create', 'read', 'update']),
      allow.group('mentor').to(['read', 'update']),
      allow.group('admin').to(['read', 'update', 'delete']),
    ]),

  Session: a
    .model({
      title: a.string().required(),
      description: a.string(),
      startTime: a.datetime().required(),
      endTime: a.datetime().required(),
      mentorId: a.id().required(),
      mentor: a.belongsTo('User', 'mentorId'),
      participants: a.hasMany('SessionParticipant', 'sessionId'),
      recordings: a.hasMany('Recording', 'sessionId'),
    })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('mentor').to(['create', 'update', 'delete']),
      allow.group('admin').to(['create', 'update', 'delete']),
    ]),

  SessionParticipant: a
    .model({
      sessionId: a.id().required(),
      userId: a.id().required(),
      session: a.belongsTo('Session', 'sessionId'),
      user: a.belongsTo('User', 'userId'),
      joinedAt: a.datetime().required(),
    })
    .authorization(allow => [
      allow.owner(),
      allow.group('mentor').to(['read']),
      allow.group('admin').to(['read', 'create', 'delete']),
    ]),

  Recording: a
    .model({
      sessionId: a.id().required(),
      session: a.belongsTo('Session', 'sessionId'),
      url: a.string().required(),
      duration: a.integer().required(), // in seconds
      createdAt: a.datetime().required(),
    })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('mentor').to(['create', 'update', 'delete']),
      allow.group('admin').to(['create', 'update', 'delete']),
    ]),

  Notification: a
    .model({
      userId: a.id().required(),
      user: a.belongsTo('User', 'userId'),
      title: a.string().required(),
      body: a.string().required(),
      type: a.enum(['ASSIGNMENT', 'SESSION', 'PAYMENT', 'SYSTEM']),
      data: a.json(),
      read: a.boolean().default(false),
      createdAt: a.datetime().required(),
    })
    .authorization(allow => [
      allow.owner(),
      allow.group('admin').to(['create', 'read', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React, you can generate a Data client:

```typescript
import { generateClient } from "aws-amplify/data";
import { schema } from "./amplify/data/resource";

const client = generateClient<Schema>({ auth: { mode: "userPool" } });

const { data: todos } = await client.models.Todo.list();
const { data: todo } = await client.models.Todo.create({
  content: "My first todo",
});
```

=========================================================================*/
