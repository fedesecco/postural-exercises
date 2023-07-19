import { Bot, webhookCallback } from 'grammy';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { Messages, Chats } from './enums';
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


// TELEGRAM BOT INIT
const token = process.env.TELEGRAM_TOKEN;
if(!token){console.error("No token!")};
const bot = new Bot(token);

//FIREBASE REALTIME DATABASE INIT
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const activeChats = [Chats.ChannelTest];

// start
bot.command('start', (ctx) => {
    console.log('/start triggered');
    ctx.reply(Messages.Intro, {
        parse_mode: 'HTML',
    });
});
// PEhelp
bot.command('help', (ctx) => {
    console.log('/help triggered');
    ctx.reply(Messages.Help, {
        parse_mode: 'HTML',
    });
});
// test
bot.command('test', (ctx) => {
    console.log('/test triggered');
    ctx.reply(`Ci sono ci sono`, {
        parse_mode: 'HTML',
    });
});

const logRequest = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' && req.path === '/sendExercises') {
        console.log(`sendExercises triggered`);
        activeChats.forEach(chat=>{
            bot.api.sendMessage(chat, Messages.Esercizi1);
        });
    }
    next();
};

//deploy
if (process.env.NODE_ENV === 'production') {
    // Use Webhooks for the production server
    const app = express();
    app.use(express.json());
    app.use(logRequest);
    app.use(webhookCallback(bot, 'express'));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}}`);
    });
} else {
    // Use Long Polling for development
    console.log(`Bot working on localhost`);
    bot.start();
}
