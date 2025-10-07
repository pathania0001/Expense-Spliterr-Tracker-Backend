// inngest/index.js
const client = require("./client");
const functions = require("./function/index");
//console.log(process.env.INNGEST_SIGNING_KEY)
module.exports = {
  client,
  functions,
};
