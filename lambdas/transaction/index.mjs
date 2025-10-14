// Lambda: transaction (modo ESM)
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDBClient();

export const handler = async (event) => {
  console.log("Evento recibido:", JSON.stringify(event));

  for (const record of event.Records) {
    const msg = JSON.parse(record.body);
    console.log("Ejecutando transacción para traceId:", msg.traceId);

    await new Promise(r => setTimeout(r, 5000));

    const item = {
      traceId: { S: msg.traceId },
      cardId: { S: msg.cardId },
      status: { S: "FINISH" },
      timestamp: { S: new Date().toISOString() },
    };

    await dynamo.send(new PutItemCommand({
      TableName: "payment",
      Item: item,
    }));

    console.log("Transacción guardada en DynamoDB:", msg.traceId);
  }

  return { statusCode: 200 };
};