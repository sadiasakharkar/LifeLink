import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "../config/dynamoDb.js";

export const getItem = async (tableName, id) => {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    }),
  );

  return result.Item ?? null;
};

export const putItem = async (tableName, item) => {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
    }),
  );

  return item;
};

export const deleteItem = async (tableName, id) => {
  await docClient.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id },
    }),
  );
};

export const scanItems = async (tableName, filters = {}) => {
  const filterKeys = Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== "");

  const scanInput = {
    TableName: tableName,
  };

  if (filterKeys.length > 0) {
    const expressionNames = {};
    const expressionValues = {};
    const expressions = filterKeys.map(([key], index) => {
      const nameKey = `#field${index}`;
      const valueKey = `:value${index}`;
      expressionNames[nameKey] = key;
      expressionValues[valueKey] = filters[key];
      return `${nameKey} = ${valueKey}`;
    });

    scanInput.FilterExpression = expressions.join(" AND ");
    scanInput.ExpressionAttributeNames = expressionNames;
    scanInput.ExpressionAttributeValues = expressionValues;
  }

  const result = await docClient.send(new ScanCommand(scanInput));
  return result.Items ?? [];
};

export const updateItem = async (tableName, id, updates) => {
  const entries = Object.entries(updates).filter(([, value]) => value !== undefined);
  const expressionNames = {};
  const expressionValues = {};
  const updateExpression = entries
    .map(([key, value], index) => {
      const nameKey = `#field${index}`;
      const valueKey = `:value${index}`;
      expressionNames[nameKey] = key;
      expressionValues[valueKey] = value;
      return `${nameKey} = ${valueKey}`;
    })
    .join(", ");

  const result = await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: "ALL_NEW",
    }),
  );

  return result.Attributes ?? null;
};

export const queryItems = async (tableName, indexName, keyName, keyValue) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: "#key = :value",
      ExpressionAttributeNames: {
        "#key": keyName,
      },
      ExpressionAttributeValues: {
        ":value": keyValue,
      },
    }),
  );

  return result.Items ?? [];
};
