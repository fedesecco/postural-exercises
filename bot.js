const { Bot } = require("grammy");
const express = require("express");
const schedule = require("node-schedule");
require("dotenv").config();

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

//wiki messages
const introductionMessage = `Ciao! Sono un bot che selezionerà per te degli esercizi specifici da fare ogni giorno! Gli esercizi sono a cura del dott. Alessandro Mantoan, laureato in bla bla bla. Il messaggio arriverà ogni giorno alle 9!`;
const helpMessage = `Nessun aiuto a ancora disponibile.`;

//scheduled message
const scheduledMessage1 = `Buongiorno, sono le ${getTime()}! Ed io puntuale invio un messaggio. Domani invece invierò esercizi anzichè questo messaggino del cazzo!`;

const chatIDs = {
  testGroup1: -100956704196,
  testChannel1: -1001859807156,
};

function getTime() {
  let result = "";
  let date = new Date();
  result = result.concat(date.getHours);
  result = result.concat(":");
  result = result.concat(date.getMinutes);
  return result;
}

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
const scheduler1 = schedule.scheduleJob("0 9 * * *", function () {
  Object.values(chatIDs).forEach((chatID) => {
    bot.api.sendMessage(chatID, scheduledMessage1);
  });
});

const scheduler2 = schedule.scheduleJob("45 18  * * *", function () {
  Object.values(chatIDs).forEach((chatID) => {
    bot.api.sendMessage(chatID, scheduledMessage1);
  });
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
