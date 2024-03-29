import { Bot, webhookCallback } from 'grammy';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { Messages, Chats, exercisesMessage } from './enums';
import { createClient } from '@supabase/supabase-js';
import { randomNumber } from './utils';

// TELEGRAM BOT INIT
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    console.error('No token!');
}
const bot = new Bot(token);
let storage: any;

// SUPABASE DATABASE INIT
const app = express();
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
    const message = await exercisesOfTheDay(4, false);
    ctx.reply(message, { parse_mode: 'HTML' });
});

const logRequest = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' && req.path === '/sendExercises') {
        console.log(`sendExercises triggered`);
        const message = await exercisesOfTheDay(4, true);
        activeChats.forEach((chat) => {
            bot.api.sendMessage(chat, message, { parse_mode: 'HTML' });
        });
    }
    next();
};

// functions

async function exercisesOfTheDay(exerN: number, updateTable: boolean) {
    console.log('exercisesOfTheDay begin');
    let { data: exercises, error } = await supabase.from('exercises').select();
    if (error) {
        console.log('Error on select(): ', error);
    }
    const exIDs = [];
    const IDsOfTheDay = [];
    const exercisesOfTheDay = [];
    let message = `Buongiorno! i ${exerN} esercizi da fare oggi sono:\n`;
    for (let i = 0; i < 138; i++) {
        exIDs.push(i);
    }
    console.log('exIDs: ', exIDs);

    for (let i = 0; i < exerN; i++) {
        IDsOfTheDay.push(exIDs.splice(randomNumber(0, exIDs.length), 1)[0]);
    }
    console.log('IDsOfTheDay: ', IDsOfTheDay);

    IDsOfTheDay.forEach((id) => {
        exercises.forEach((ex) => {
            if (id === ex.id) {
                exercisesOfTheDay.push(ex);
            }
        });
    });
    console.log('exercisesOfTheDay: ', exercisesOfTheDay);

    exercisesOfTheDay.forEach((ex) => {
        message += `\n<tg-spoiler><b>${ex.name}</b>!</tg-spoiler>`;
    });
    console.log('message: ', message);

    message += '\n';
    exercisesOfTheDay.forEach((ex) => {
        if (ex.timesUsed === 0) {
            message += `\n<tg-spoiler>${ex.name}</tg-spoiler> è un nuovo esercizio`;
        } else {
            message += `\n<tg-spoiler>${ex.name}</tg-spoiler> è un esercizio già visto passato, ${ex.timesUsed} volte!`;
        }
    });
    message +=
        '\n\nCi vediamo domani per altri esercizi! Per ogni dubbio chiedete ad Alessandro Mantoan, dottore in tutto, mega esperto della motoria, portatore di gelati a Magalini Medica ;)';

    if (updateTable) {
        await addTimesUsed(exercisesOfTheDay);
    }

    return message;
}

async function addTimesUsed(exs: any[]) {
    exs.forEach(async (ex) => {
        let used = ex.timesUsed;
        used++;
        await supabase.from('exercises').update({ timesUsed: used }).eq('id', ex.id);
    });
}

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
