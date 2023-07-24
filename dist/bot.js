"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const enums_1 = require("./enums");
const supabase_js_1 = require("@supabase/supabase-js");
const utils_1 = require("./utils");
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    console.error('No token!');
}
const bot = new grammy_1.Bot(token);
let storage;
const app = (0, express_1.default)();
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
if (supabase.storage) {
    console.log(`Login successful.`);
}
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
bot.command('test', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('/test triggered');
    let { data: exercises, error } = yield supabase.from('exercises').select('*');
    if (error) {
        console.log('Error on select(): ', error);
    }
    console.log('exercises: ', exercises);
    const numberOfExercises = exercises.length;
    console.log('exercises[0]: ', exercises[0]);
    const numberOfTheDay = (0, utils_1.randomNumber)(0, numberOfExercises);
    const exerciseOfTheDay = exercises[numberOfTheDay];
    ctx.reply('exercise of the day: ' + JSON.stringify(exerciseOfTheDay), {
        parse_mode: 'HTML',
    });
}));
const logRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === 'POST' && req.path === '/sendExercises') {
        console.log(`sendExercises triggered`);
        let { data: exercises, error } = yield supabase.from('exercises').select('*');
        const numberOfExercises = exercises.length;
        const numberOfTheDay = (0, utils_1.randomNumber)(0, numberOfExercises);
        const exerciseOfTheDay = exercises[numberOfTheDay];
        let timesUsed = exerciseOfTheDay.timesUsed;
        activeChats.forEach((chat) => {
            bot.api.sendMessage(chat, (0, enums_1.exercisesMessage)(exerciseOfTheDay.name, timesUsed));
        });
        timesUsed++;
        yield supabase.from('exercises').update({ timesUsed: timesUsed }).eq('id', numberOfTheDay);
    }
    next();
});
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
