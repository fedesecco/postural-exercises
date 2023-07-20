// tsc --watch

export enum Messages {
    Intro = `Ciao! Sono un bot che selezionerà per te degli esercizi specifici da fare ogni giorno! Gli esercizi sono a cura del dott. Alessandro Mantoan, chinesiologo. Il messaggio arriverà ogni giorno alle 9!`,
    Help = 'Nessun aiuto a ancora disponibile.',
    Esercizi1 = 'Se ci fossero esericizi, io ora li avrei inviati!',
}
/** `L'esercizio da fare oggi è: ${name}! Fin'ora è stato estratto ${times} volte.` */
export function exercisesMessage(name: string, times: number) {
    if (times > 0) {
        return `L'esercizio da fare oggi è: ${name}! Fin'ora è stato estratto ${times} volte.`;
    } else return `L'esercizio da fare oggi è: ${name}! Non era mai uscito prima!`;
}

export enum Chats {
    ChatAleFedeBot = -956704196,
    ChannelTest = -1001859807156,
    ChannelProduction = '',
    Fede = '',
    Ale = '',
    Bot = '',
}

export enum People {}
