import { Bot, webhookCallback } from 'grammy';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { Messages, Chats, exercisesMessage } from './enums';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { randomNumber } from './utils';

// TELEGRAM BOT INIT
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    console.error('No token!');
}
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
    const exercises = ref(db, 'exercises');
    const numberOfExercises = Object.keys(exercises).length;
    const exerciseOfTheDay = exercises[randomNumber(1, numberOfExercises).toString()];
    ctx.reply(JSON.stringify(exerciseOfTheDay), {
        parse_mode: 'HTML',
    });
});

const logRequest = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' && req.path === '/sendExercises') {
        console.log(`sendExercises triggered`);
        const exercises = ref(db, 'exercises');
        const numberOfExercises = Object.keys(exercises).length;
        const numberOfTheDay = randomNumber(0, numberOfExercises).toString();
        const exerciseOfTheDay = exercises[numberOfTheDay];
        let timesUsed = exerciseOfTheDay.timesUsed;
        activeChats.forEach((chat) => {
            bot.api.sendMessage(chat, exercisesMessage(exerciseOfTheDay.name, timesUsed));
        });
        timesUsed++;
        set(ref(db, 'exercises/' + numberOfTheDay + '/timesUsed'), timesUsed);
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
