// Lambda: check-balance (modo ESM)
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient();

exports.handler = async (event) => {
  console.log("Evento recibido:", JSON.stringify(event));

  for (const record of event.Records) {
    const msg = JSON.parse(record.body);
    console.log("Validando saldo para traceId:", msg.traceId);

    await new Promise(r => setTimeout(r, 5000));

    // Simula validación (por ahora siempre true)
    const valid = true;

    const updatedMsg = {
      ...msg,
      status: valid ? "VALIDATED" : "FAILED",
      error: valid ? null : "Saldo insuficiente",
    };

    if (valid) {
      const params = {
        QueueUrl: process.env.TRANSACTION_QUEUE,
        MessageBody: JSON.stringify(updatedMsg),
      };
      await sqs.send(new SendMessageCommand(params));
      console.log("✅ Enviado a transaction-queue:", msg.traceId);
    } else {
      console.warn("❌ Saldo insuficiente para:", msg.traceId);
    }
  }

  return { statusCode: 200 };
};