import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDBClient();

export const handler = async (event) => {
  console.log("Evento recibido:", JSON.stringify(event));

  for (const record of event.Records) {
    const msg = JSON.parse(record.body);
    console.log("Ejecutando transacción para traceId:", msg.traceId);

    if (!msg.traceId) {
      console.error("traceId no definido:", msg);
      continue;
    }

    // Espera simulando procesamiento
    await new Promise(r => setTimeout(r, 5000));

    const item = {
      traceId: { S: msg.traceId },
      cardId: { S: msg.cardId || "UNKNOWN" }, // Evita undefined
      status: { S: "FINISH" },
      timestamp: { S: new Date().toISOString() },
    };

    console.log("Item a guardar en DynamoDB:", item);

    await dynamo.send(new PutItemCommand({
      TableName: "payment",
      Item: item,
    }));

    console.log("Transacción guardada en DynamoDB:", msg.traceId);
  }

  return { statusCode: 200 };
};
