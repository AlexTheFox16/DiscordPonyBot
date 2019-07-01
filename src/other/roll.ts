import { Message, Channel } from 'discord.js';
import { prefix } from './guildPrefix';
import { DataBase } from './DataBase';

export function roll(message: Message): boolean {
    const p = prefix(message).toLowerCase();
    if (!p) return false
    if (p !== 'roll' && p !== 'rand' && p !== 'random' &&
        !p.startsWith('roll ') && !p.startsWith('rand ') && !p.startsWith('random ')) return false;

    let language = message.guild ? DataBase.getLang()[DataBase.getGuildLang(message.guild)].roll : DataBase.getLang()['en'].roll;

    let string = p.slice(p.indexOf(' ')).split('-');
    string[0] = string[0].trim();

    if (string[0] === "🍎") {
        message.channel.send(`:game_die: ${language.rolled} 🍎 ${language.of} 100`).catch(() => { });
        message.react("🍎");
        return true;
    }
    let number: number[] = [];
    number[0] = parseInt(string[0]);
    number[1] = parseInt(string[1]);

    if (isNaN(number[0])) {
        return actualRoll(language, message);
    } else {
        if (number[0] == 0) number[0] = 1;
        if (number[0] > 1000000) number[0] = 1000000;

        if (isNaN(number[1])) {
            return actualRoll(language, message, number[0]);
        } else {
            if (number[1] > 1000000) number[0] = 1000000;
            if (number[0] > number[1]) return actualRoll(language, message, number[0], number[0]);
            else return actualRoll(language, message, number[1], number[0]);
        }
    }
}

function actualRoll(language: any, message: Message, max = 100, min = 1): boolean {
    let oneNumber = true;
    if (min === 1) oneNumber = false;

    const roled = Math.floor((Math.random() * ((max - min) + 1)) + min);
    if (oneNumber) {
        message.channel.send(`:game_die: ${language.rolled}  ${roled} ${language.of} ${min}-${max}`).catch(() => { });
    } else {
        message.channel.send(`:game_die: ${language.rolled}  ${roled} ${language.of} ${max}`).catch(() => { });
    }
    message.react("🎲");
    return true;
}
