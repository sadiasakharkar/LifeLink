import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? "development";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "lifelink_demo_secret",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  awsRegion: process.env.AWS_REGION ?? "ap-south-1",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "local",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "local",
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT ?? "",
  usersTable: process.env.USERS_TABLE ?? "LifeLinkUsers",
  donorsTable: process.env.DONORS_TABLE ?? "LifeLinkDonors",
  recipientsTable: process.env.RECIPIENTS_TABLE ?? "LifeLinkRecipients",
  allocationsTable: process.env.ALLOCATIONS_TABLE ?? "LifeLinkAllocations",
  auditLogsTable: process.env.AUDIT_LOGS_TABLE ?? "LifeLinkAuditLogs",
  nodeEnv,
  seedDemoData: process.env.SEED_DEMO_DATA === "true",
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS ?? 12000),
};
