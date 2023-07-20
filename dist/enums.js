"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.People = exports.Chats = exports.exercisesMessage = exports.Messages = void 0;
var Messages;
(function (Messages) {
    Messages["Intro"] = "Ciao! Sono un bot che selezioner\u00E0 per te degli esercizi specifici da fare ogni giorno! Gli esercizi sono a cura del dott. Alessandro Mantoan, chinesiologo. Il messaggio arriver\u00E0 ogni giorno alle 9!";
    Messages["Help"] = "Nessun aiuto a ancora disponibile.";
    Messages["Esercizi1"] = "Se ci fossero esericizi, io ora li avrei inviati!";
})(Messages = exports.Messages || (exports.Messages = {}));
function exercisesMessage(name, times) {
    if (times > 0) {
        return `L'esercizio da fare oggi è: ${name}! Fin'ora è stato estratto ${times} volte.`;
    }
    else
        return `L'esercizio da fare oggi è: ${name}! Non era mai uscito prima!`;
}
exports.exercisesMessage = exercisesMessage;
var Chats;
(function (Chats) {
    Chats[Chats["ChatAleFedeBot"] = -956704196] = "ChatAleFedeBot";
    Chats[Chats["ChannelTest"] = -1001859807156] = "ChannelTest";
    Chats["ChannelProduction"] = "";
    Chats["Fede"] = "";
    Chats["Ale"] = "";
    Chats["Bot"] = "";
})(Chats = exports.Chats || (exports.Chats = {}));
var People;
(function (People) {
})(People = exports.People || (exports.People = {}));
