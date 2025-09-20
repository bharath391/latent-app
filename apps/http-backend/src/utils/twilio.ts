import dotenv from "dotenv";
dotenv.config();
import Twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;

if (!accountSid || !authToken) {
  throw new Error("Twilio credentials are missing in .env");
}

const client = Twilio(accountSid, authToken);

async function sendMessage(body: string, to: string) {
  const from = process.env.TWILIO_PHONE_NUMBER!;
  if (!from) throw new Error("TWILIO_PHONE_NUMBER not set in .env");

  const message = await client.messages.create({ from, to, body });
  console.log(message.sid, message.body);
}

export default sendMessage;
