// Lambda: start-payment (modo ESM)
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient();

export const handler = async (event) => {
  console.log("Evento recibido:", JSON.stringify(event));

  if (!event.Records) {
    console.warn("⚠️ No hay Records en el evento.");
    return { statusCode: 400, body: "No records to process" };
  }

  for (const record of event.Records) {
    const msg = JSON.parse(record.body);
    console.log("Mensaje recibido:", msg);

    // Simula 5 segundos de procesamiento
    await new Promise(r => setTimeout(r, 5000));

    // Actualiza estado del pago
    const updatedMsg = { ...msg, status: "IN_PROGRESS" };

    // Enviar a la siguiente cola (check-balance)
    const params = {
      QueueUrl: process.env.CHECK_BALANCE_QUEUE,
      MessageBody: JSON.stringify(updatedMsg),
    };

    await sqs.send(new SendMessageCommand(params));
    console.log("✅ Enviado a check-balance-queue:", updatedMsg.traceId);
  }

  return { statusCode: 200 };
};