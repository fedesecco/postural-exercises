import { Bot, webhookCallback } from "grammy";
import express from "express";
const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

const introductionMessage = `Hello! I'm a Telegram bot.
I'm powered by Cyclic, the next-generation serverless computing platform.

<b>Commands</b>
/yo - Be greeted by me
/effect [text] - Show a keyboard to apply text effects to [text]`;

const replyWithIntro = (ctx: any) =>
  ctx.reply(introductionMessage, {
    parse_mode: "HTML",
  });

bot.on("message", replyWithIntro);


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
  bot.start();
}

/* const Telegraf = require("telegraf");
const bot = new Telegraf("TOKEN FORNITO DA BOTFATHER");
bot.start((context) => {
  console.log("Servizio avviato...");
  context.reply("Servizio ECHO avviato");
});
bot.on("text", (context) => {
  text = context.update.message.text;
  context.reply("Hai scritto: " + text);
});

//development
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
  bot.start();
} */

/* const TelegramBot = require("node-telegram-bot-api");

const API_TOKEN = process.env.TELEGRAF_API_TOKEN;

const exercises = [
  { name: "Esercizio 1", sets: 3, reps: 10, rest: 60 },
  { name: "Esercizio 2", sets: 4, reps: 12, rest: 90 },
  { name: "Esercizio 3", sets: 3, reps: 15, rest: 60 },
  { name: "Esercizio 4", sets: 2, reps: 20, rest: 120 },
  { name: "Esercizio 5", sets: 5, reps: 8, rest: 90 },
  // Aggiungi altri esercizi come necessario
];

const bot = new TelegramBot(API_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Ciao! Sono un bot che invia esercizi casuali ogni giorno alle 9 del mattino!"
  );
});

bot.onText(/\/daily/, (msg) => {
  const chatId = msg.chat.id;
  const numExercises = 3;
  const selectedExercises = getRandomExercises(exercises, numExercises);

  let message = "Ecco gli esercizi di oggi:\n\n";

  selectedExercises.forEach((exercise, index) => {
    message += `${index + 1}. ${exercise.name}\n   Serie: ${
      exercise.sets
    }\n   Ripetizioni: ${exercise.reps}\n   Recupero: ${
      exercise.rest
    } secondi\n\n`;
  });

  bot.sendMessage(chatId, message);

  // Programmazione dell'invio degli esercizi alle 9:00 di ogni giorno
  const now = new Date();
  const next9am = new Date(now);
  next9am.setHours(9, 0, 0, 0);
  if (now >= next9am) {
    next9am.setDate(next9am.getDate() + 1);
  }

  setTimeout(() => {
    sendDailyExercises(chatId);
    setInterval(() => sendDailyExercises(chatId), 24 * 60 * 60 * 1000);
  }, next9am.getTime() - now.getTime());
});

function getRandomExercises(exercises, count) {
  const shuffledExercises = exercises.sort(() => 0.5 - Math.random());
  return shuffledExercises.slice(0, count);
}

function sendDailyExercises(chatId) {
  const numExercises = 3;
  const selectedExercises = getRandomExercises(exercises, numExercises);

  let message = "Ecco gli esercizi di oggi:\n\n";

  selectedExercises.forEach((exercise, index) => {
    message += `${index + 1}. ${exercise.name}\n   Serie: ${
      exercise.sets
    }\n   Ripetizioni: ${exercise.reps}\n   Recupero: ${
      exercise.rest
    } secondi\n\n`;
  });

  bot.sendMessage(chatId, message);
} */
