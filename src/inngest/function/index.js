// inngest/function/index.js
const inngestClient = require("../client");
const { getFinalLedgerOfUsers, prepareMails } = require("./utilFunctions");

const helloWorld = inngestClient.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

const paymentReminders = inngestClient.createFunction(
  { id: "payment-reminders" },
  { cron: "0 9 * * *" },
  async ({ step }) => {
    console.log(" Running Payment Reminder Job");
    const netLedger = await step.run("Calculate ledger", getFinalLedgerOfUsers());
    await step.run("Send reminder emails", () => prepareMails(netLedger));
    console.log("Reminders sent!");
  }
);

module.exports = [ helloWorld,paymentReminders ];
