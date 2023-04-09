const { Bot, webhookCallback } = require("grammy");
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
  //testGroup1: -100956704196,
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
  // 19:50
}

function getServerTime() {
  return new Date().toLocaleString();
  // 4/9/2023, 2:15:30 PM
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
  // const specificTime = ctx.match;
  // setInterval(() => sendMessageAtSpecificTime(specificTime), 60 * 1000);
  ctx.reply(`Server time is  ${new Date().toLocaleString()}`, {
    parse_mode: "HTML",
  });
});

// scheduled message
function sendMessageAtSpecificTime(targetTime) {
  console.log(`${getServerTime()}: sendMessageAtSpecificTime() triggered`);
  Object.values(chatIDs).forEach((chatID) => {
    bot.api.sendMessage(chatID, scheduledMessage1);
  });
}

const j = schedule.scheduleJob("05 17 * * *", function () {
  sendMessageAtSpecificTime();
});

//deploy
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`${getServerTime()}: bot listening on port ${PORT}.`);
  });
} else {
  // Use Long Polling for development
  console.log(`Bot working on localhost`);
  bot.start();
}
