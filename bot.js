const { Bot, webhookCallback } = require("grammy");
const express = require("express");
const schedule = require("node-schedule");
require("dotenv").config();

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

//wiki messages
const introductionMessage = `Ciao! Sono un bot che selezionerà per te degli esercizi specifici da fare ogni giorno! Gli esercizi sono a cura del dott. Alessandro Mantoan, laureato in bla bla bla. Il messaggio arriverà ogni giorno alle 9!`;
const helpMessage = `Nessun aiuto a ancora disponibile.`;

//scheduled message
const scheduledMessage1 = `Buongiorno, sono le ${getTime()}! Ed io puntuale invio un messaggio.`;

const chatIDs = {
  testGroup1: -956704196,
  //testChannel1: -1001859807156,
};

let scheduledCETHours = "";
let scheduledHours = "";
let scheduledMinutes = "";

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
  ctx.reply(`Server time is  ${getServerTime()}`, {
    parse_mode: "HTML",
  });
});

bot.command("setMessageTime", (ctx) => {
  console.log("/setMessageTime triggered");
  let time = ctx.match;
  [scheduledCETHours, scheduledMinutes] = time.split(":");
  scheduledHours = (Number(scheduledCETHours) - 2).toString();
  ctx.reply(
    `Job scheduled every day at <b>${
      ctx.match
    }</b>. (Server time is  ${getServerTime()}).`,
    {
      parse_mode: "HTML",
    }
  );
});

// scheduled message
function sendMessageAtSpecificTime() {
  console.log(`${getServerTime()}: sendMessageAtSpecificTime() triggered`);
  Object.values(chatIDs).forEach((chatID) => {
    bot.api.sendMessage(chatID, scheduledMessage1);
  });
}

schedule.scheduleJob(
  `${scheduledMinutes} ${scheduledHours} * * *`,
  function () {
    sendMessageAtSpecificTime();
  }
);

//deploy
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(
      `Bot listening on port ${PORT}. Server time: ${getServerTime()}`
    );
  });
} else {
  // Use Long Polling for development
  console.log(`Bot working on localhost`);
  bot.start();
}
