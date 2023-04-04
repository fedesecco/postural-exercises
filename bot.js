"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const express_1 = __importDefault(require("express"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const bot = new grammy_1.Bot(process.env.TELEGRAM_TOKEN || "");
//wiki messages
const introductionMessage = `Ciao! Sono un bot che selezionerà per te degli esercizi specifici da fare ogni giorno! Gli esercizi sono a cura del dott. Alessandro Mantoan, laureato in bla bla bla. Il messaggio arriverà ogni giorno alle 9!`;
const helpMessage = `Nessun aiuto a ancora disponibile.`;
//commands
bot.command("start", (ctx) => {
    ctx.reply(introductionMessage, {
        parse_mode: "HTML",
    });
});
bot.command("help", (ctx) => {
    ctx.reply(introductionMessage, {
        parse_mode: "HTML",
    });
});
//scheduled message
const message9Am = `Buongiorno, sono le 9! Ed io puntuale invio un messaggio. Domani invece invierò esercizi anzichè questo messaggino del cazzo!`;
//groupID mio ale e bot
const testGroupID = -956704196;
//scheduler
const scheduledFunction = node_schedule_1.default.scheduleJob("0 9 * * *", function () {
    bot.api.sendMessage(testGroupID, message9Am);
});
//deploy
if (process.env.NODE_ENV === "production") {
    // Use Webhooks for the production server
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, grammy_1.webhookCallback)(bot, "express"));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}`);
    });
}
else {
    // Use Long Polling for development
    bot.start();
}
