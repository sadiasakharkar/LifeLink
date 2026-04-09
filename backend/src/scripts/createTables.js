import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { pathToFileURL } from "node:url";
import { env } from "../config/env.js";

const client = new DynamoDBClient({
  region: env.awsRegion,
  endpoint: env.dynamoDbEndpoint || undefined,
  credentials: env.dynamoDbEndpoint
    ? {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey,
      }
    : undefined,
});

const tableNames = [
  env.usersTable,
  env.donorsTable,
  env.recipientsTable,
  env.allocationsTable,
  env.auditLogsTable,
];

const ensureTable = async (tableName) => {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    console.log(`exists: ${tableName}`);
    return;
  } catch (error) {
    if (error.name !== "ResourceNotFoundException") throw error;
  }

  await client.send(
    new CreateTableCommand({
      TableName: tableName,
      BillingMode: "PAY_PER_REQUEST",
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    }),
  );

  console.log(`created: ${tableName}`);
};

export const createTables = async () => {
  for (const tableName of tableNames) {
    await ensureTable(tableName);
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await createTables();
}
