import { handler } from "./lambdas/start-payment/index.mjs";
import "dotenv/config";

console.log("🚀 Ejecutando Lambda start-payment localmente...\n");

const event = {
  Records: [
    {
      body: JSON.stringify({
        traceId: "trace-123",
        amount: 1500,
        accountId: "user-001",
      }),
    },
  ],
};

(async () => {
  try {
    const result = await handler(event);
    console.log("\n✅ Lambda ejecutada correctamente:\n", result);
  } catch (error) {
    console.error("\n❌ Error ejecutando Lambda:\n", error);
  }
})();

