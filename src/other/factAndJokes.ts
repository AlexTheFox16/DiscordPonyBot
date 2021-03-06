import { Message } from 'discord.js';
import { prefix } from './guildPrefix';

const facts = require('../../factAndJokes/facts.json');
const hiddenFacts = require('../../factAndJokes/hiddenFacts.json');
let jokes = require('../../factAndJokes//jokes.json');

randomize();

//randomize jokes
function randomize() {
    let jokekeys = Object.keys(jokes);
    for (let i = 0; i < jokekeys.length; i++) {
        jokes[jokekeys[i]].sort(() => Math.random() - 0.5);
    }
}

export function factAndJokes(message: Message) {


    const p = prefix(message).toLowerCase();
    if (!p) return false;
    if (!p.startsWith('fact') && !p.startsWith('joke')) return false;

    if (p === 'fact' || p === 'facts') return randomFact(message);
    if (p === 'joke' || p === 'joke') return randomJoke(message);

    let msg = p.replace(/  +/g, ' ').toLowerCase().slice(p.indexOf(' ')).trim();
    if (p.startsWith('fact ') || p.startsWith('facts ')) return fact(message, msg);
    if (p.startsWith('joke ') || p.startsWith('jokes ')) return joke(message, msg);

    return true;
}

function randomFact(message: Message) {
    const factKeys = Object.keys(facts);
    const type = factKeys[ranIntAry(factKeys.length)];
    const fact = ranIntAry(facts[type].length);
    //@ts-ignore
    message.channel.send(`${facts[type][fact]}`).then(x => { x.react("👓").catch(() => { }); }).catch(() => { });
    return true;
}

function randomJoke(message: Message) {
    const jokeKeys = Object.keys(jokes);
    const type = jokeKeys[ranIntAry(jokeKeys.length)];
    const joke = ranIntAry(jokes[type].length);
    //@ts-ignore
    message.channel.send(`${jokes[type][joke]}`).then(x => { x.react("😄").catch(() => { }); }).catch(() => { });
    return true;
}

//get joke from
function joke(message: Message, msg: string) {
    let jokeKeys = Object.keys(jokes);


    if (jokeKeys.includes(msg)) {
        let joke = ranIntAry(jokes[msg].length);
        let jokeFullName = capitalize(msg);

        message.channel.send(`${jokeFullName} joke: ${jokes[msg][joke]}`)
            //@ts-ignore
            .then(m => m.react('😄').catch(() => { }))
            .catch(() => { });
    } else if (msg === 'list') {
        message.channel.send(`I have jokes about: \`${jokeKeys.join(', ')}\``)
            //@ts-ignore
            //@ts-ignore
            .then(m => m.react('🔍').catch(() => { }))
            .catch(() => { });
    }
    else {
        message.channel.send(`Cannot find jokes about: \`${msg}\``)
            .catch(() => { });
    }
    return true;
}

function fact(message: Message, msg: string) {
    let factKeys = Object.keys(facts);
    let factHiddenKeys = Object.keys(hiddenFacts);

    if (factKeys.includes(msg)) {
        let fact = ranIntAry(facts[msg].length);
        let factFullName = capitalize(msg);


        message.channel.send(`${factFullName} fact: ${facts[msg][fact]}`)
            //@ts-ignore
            .then(m => m.react('👓'))
            .catch(() => { });
    } else if (factHiddenKeys.includes(msg)) {
        let fact = ranIntAry(hiddenFacts[msg].length);
        let name = msg.split(' ')
        for (let word in name) {
            name[word] = capitalize(name[word])
        }
        let factFullName = name.join(' ');
        message.channel.send(`${factFullName} fact: ${hiddenFacts[msg][fact]}`)
            //@ts-ignore
            .then(m => m.react('👀').catch(() => { }))
            .catch(() => { });
    }
    else if (msg === 'list') {
        message.channel.send(`I have jokes about: \`${factKeys.join(', ')}\``)
            //@ts-ignore
            .then(m => m.react('🔍').catch(() => { }))
            .catch(() => { });
    }
    else {
        message.channel.send(`Cannot find jokes about: \`${msg}\``).catch(() => { });
    }
    return true;
}


function ranIntAry(max: number) {
    return Math.floor(Math.random() * max);
}

function capitalize(word: string) {
    if (typeof word !== 'string') return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}
