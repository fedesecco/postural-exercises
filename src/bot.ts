import { Bot, webhookCallback } from 'grammy';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { Messages, Chats, exercisesMessage } from './enums';
import { createClient } from '@supabase/supabase-js';
import { randomNumber } from './utils';
import session from 'express-session';

// TELEGRAM BOT INIT
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    console.error('No token!');
}
const bot = new Bot(token);
let storage: any;

// SUPABASE DATABASE INIT
const app = express();
app.use(
    session({
        secret: 'sdgsdgsdgdsg',
        resave: false,
        saveUninitialized: true,
    })
);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
if (supabase.storage) {
    console.log(`Login successful.`);
}

const activeChats = [Chats.ChannelTest];

// start
bot.command('start', (ctx) => {
    console.log('/start triggered');
    ctx.reply(Messages.Intro, {
        parse_mode: 'HTML',
    });
});
// help
bot.command('help', (ctx) => {
    console.log('/help triggered');
    ctx.reply(Messages.Help, {
        parse_mode: 'HTML',
    });
});
// test
bot.command('test', async (ctx) => {
    console.log('/test triggered');
    let { data: exercises, error } = await supabase.from('exercises').select('*');
    if (error) {
        console.log('Error on select(): ', error);
    }
    console.log('exercises: ', exercises);
    const numberOfExercises = exercises.length;
    console.log('exercises[0]: ', exercises[0]);
    const numberOfTheDay = randomNumber(0, numberOfExercises);
    const exerciseOfTheDay = exercises[numberOfTheDay];
    ctx.reply('exercise of the day: ' + JSON.stringify(exerciseOfTheDay), {
        parse_mode: 'HTML',
    });
});

const logRequest = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' && req.path === '/sendExercises') {
        console.log(`sendExercises triggered`);
        let { data: exercises, error } = await supabase.from('exercises').select('*');
        const numberOfExercises = exercises.length;
        const numberOfTheDay = randomNumber(0, numberOfExercises);
        const exerciseOfTheDay = exercises[numberOfTheDay];
        let timesUsed = exerciseOfTheDay.timesUsed;
        activeChats.forEach((chat) => {
            bot.api.sendMessage(chat, exercisesMessage(exerciseOfTheDay.name, timesUsed));
        });
        timesUsed++;
        await supabase.from('exercises').update({ timesUsed: timesUsed }).eq('id', numberOfTheDay);
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
