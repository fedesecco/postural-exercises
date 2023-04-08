const { Bot, webhookCallback } = require("grammy");
const express = require("express");
const schedule = require("node-schedule");
require("dotenv").config();

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

//wiki messages
const introductionMessage = `Ciao! Sono un bot che selezionerà per te degli esercizi specifici da fare ogni giorno! Gli esercizi sono a cura del dott. Alessandro Mantoan, laureato in bla bla bla. Il messaggio arriverà ogni giorno alle 9!`;
const helpMessage = `Nessun aiuto a ancora disponibile.`;
const testMessage = `Sono le ${getTime()}.`;

//scheduled message
const scheduledMessage1 = `Buongiorno, sono le ${getTime()}! Ed io puntuale invio un messaggio. Domani invece invierò esercizi anzichè questo messaggino del cazzo!`;

const chatIDs = {
  testGroup1: -100956704196,
  testChannel1: -1001859807156,
};

function getTime() {
  let date = new Date();
  let hours = (date.getUTCHours() + 2).toString();
  let minutes = date.getUTCMinutes().toString();
  if (minutes.length === 1) {
    minutes += "0";
  }
  let result = hours + ":" + minutes;
  return result;
}

// scheduled message
function sendMessageAtSpecificTime(targetTime) {
  const time = getTime();
  console.log(`Time check: time = ${time}, target = ${targetTime}`);
  if (time == targetTime) {
    console.log("send scheduled message triggered");
    Object.values(chatIDs).forEach((chatID) => {
      bot.api.sendMessage(chatID, scheduledMessage1);
    });
  }
}

// PEstart
bot.command("PEstart", (ctx) => {
  console.log("/PEstart triggered");
  ctx.reply(introductionMessage, {
    parse_mode: "HTML",
  });
});
// PEhelp
bot.command("PEhelp", (ctx) => {
  console.log("/PEhelp triggered");
  ctx.reply(helpMessage, {
    parse_mode: "HTML",
  });
});
// test
bot.command("test", (ctx) => {
  console.log("/test triggered");
  ctx.reply(testMessage, {
    parse_mode: "HTML",
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
    setInterval(() => sendMessageAtSpecificTime("20:34"), 60 * 1000);
  });
} else {
  // Use Long Polling for development
  console.log(`Bot working on localhost`);
  bot.start();
}
