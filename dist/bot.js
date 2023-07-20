"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const enums_1 = require("./enums");
const app_1 = require("firebase/app");
const database_1 = require("firebase/database");
const utils_1 = require("./utils");
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    console.error('No token!');
}
const bot = new grammy_1.Bot(token);
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, database_1.getDatabase)(app);
const activeChats = [enums_1.Chats.ChannelTest];
bot.command('start', (ctx) => {
    console.log('/start triggered');
    ctx.reply(enums_1.Messages.Intro, {
        parse_mode: 'HTML',
    });
});
bot.command('help', (ctx) => {
    console.log('/help triggered');
    ctx.reply(enums_1.Messages.Help, {
        parse_mode: 'HTML',
    });
});
bot.command('test', (ctx) => {
    console.log('/test triggered');
    const exercises = (0, database_1.ref)(db, 'exercises');
    const numberOfExercises = Object.keys(exercises).length;
    const exerciseOfTheDay = exercises[(0, utils_1.randomNumber)(1, numberOfExercises).toString()];
    ctx.reply(JSON.stringify(exerciseOfTheDay), {
        parse_mode: 'HTML',
    });
});
const logRequest = (req, res, next) => {
    if (req.method === 'POST' && req.path === '/sendExercises') {
        console.log(`sendExercises triggered`);
        const exercises = (0, database_1.ref)(db, 'exercises');
        const numberOfExercises = Object.keys(exercises).length;
        const numberOfTheDay = (0, utils_1.randomNumber)(0, numberOfExercises).toString();
        const exerciseOfTheDay = exercises[numberOfTheDay];
        let timesUsed = exerciseOfTheDay.timesUsed;
        activeChats.forEach((chat) => {
            bot.api.sendMessage(chat, (0, enums_1.exercisesMessage)(exerciseOfTheDay.name, timesUsed));
        });
        timesUsed++;
        (0, database_1.set)((0, database_1.ref)(db, 'exercises/' + numberOfTheDay + '/timesUsed'), timesUsed);
    }
    next();
};
if (process.env.NODE_ENV === 'production') {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(logRequest);
    app.use((0, grammy_1.webhookCallback)(bot, 'express'));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}}`);
    });
}
else {
    console.log(`Bot working on localhost`);
    bot.start();
}
