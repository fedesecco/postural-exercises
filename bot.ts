import { Bot, webhookCallback } from 'grammy';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Bot(process.env.TELEGRAM_TOKEN || '');

// Messages
const introductionMessage = `Ciao! Sono un bot che selezionerà per te degli esercizi specifici da fare ogni giorno! Gli esercizi sono a cura del dott. Alessandro Mantoan, laureato in bla bla bla. Il messaggio arriverà ogni giorno alle 9!`;
const helpMessage = `Nessun aiuto a ancora disponibile.`;
const scheduledMessage1 = `Se ci fossero esericizi, io ora li avrei inviati!`;

const chatIDs = {
    testGroup1: -956704196,
    //testChannel1: -1001859807156,
};

// start
bot.command('start', (ctx) => {
    console.log('/start triggered');
    ctx.reply(introductionMessage, {
        parse_mode: 'HTML',
    });
});
// PEhelp
bot.command('PEhelp', (ctx) => {
    console.log('/PEhelp triggered');
    ctx.reply(helpMessage, {
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

bot.command('sendExercises', (ctx) => {
    console.log(`sendExercises triggered`);
    Object.values(chatIDs).forEach((chatID) => {
        bot.api.sendMessage(chatID, scheduledMessage1);
    });
});

const logRequest = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' && req.path === '/sendExercises') {
        console.log(`sendExercises triggered`);
        Object.values(chatIDs).forEach((chatID) => {
            bot.api.sendMessage(chatID, scheduledMessage1);
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
