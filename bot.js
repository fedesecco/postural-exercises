const { Bot } = require("grammy");
const express = require("express");
const schedule = require("node-schedule");
require("dotenv").config();

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

//wiki messages
const introductionMessage = `Ciao! Sono un bot che selezionerà per te degli esercizi specifici da fare ogni giorno! Gli esercizi sono a cura del dott. Alessandro Mantoan, laureato in bla bla bla. Il messaggio arriverà ogni giorno alle 9!`;
const helpMessage = `Nessun aiuto a ancora disponibile.`;

//scheduled message
const message1 = `Buongiorno, sono le 9! Ed io puntuale invio un messaggio. Domani invece invierò esercizi anzichè questo messaggino del cazzo!`;
const message2 = `Buongiorno, sono le 18:15! Ed io puntuale invio un messaggio. Domani invece invierò esercizi anzichè questo messaggino del cazzo!`;

//groupID mio ale e bot
const testGroupID = -100956704196;
const testChannelID = -1001859807156;

//commands
bot.command("PEstart", (ctx) => {
  ctx.reply(introductionMessage, {
    parse_mode: "HTML",
  });
});

bot.command("PEhelp", (ctx) => {
  ctx.reply(helpMessage, {
    parse_mode: "HTML",
  });
});

//scheduler
const groupMessage1 = schedule.scheduleJob("0 9 * * *", function () {
  bot.api.sendMessage(testGroupID, message1);
});
const channelMessage1 = schedule.scheduleJob("0 9 * * *", function () {
  bot.api.sendMessage(testChannelID, message1);
});

const groupMessage2 = schedule.scheduleJob("15 18 * * *", function () {
  bot.api.sendMessage(testGroupID, message2);
});
const channelMessage2 = schedule.scheduleJob("15 18 * * *", function () {
  bot.api.sendMessage(testChannelID, message2);
});

//deploy
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  console.log(`Bot working on localhost`);
  bot.start();
}
