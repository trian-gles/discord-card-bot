const Discord = require('discord.js');
const client = new Discord.Client();

var decks = {};

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function Deck(id) {
  let myid = id;
  let deckCards = [];
  let spentCards = [];

  this.addCards = function(newCards) {
    deckCards = deckCards.concat(newCards);
  }

  this.drawCard = function() {
    if (deckCards.length > 0) {
    let drawnCard = deckCards.shift();
    spentCards.unshift(drawnCard);
    return drawnCard
    }
  }

  this.listCards = function() {
    return deckCards
  }

  this.shuffle = function() {
    deckCards = shuffle(deckCards);
  }

  this.reset = function() {
    deckCards = spentCards.concat(deckCards);
    spentCards = [];
  }
}

const COMMANDREG = /^\$/;
const CARDREG = /^card\s/i;
const LISTREG = /^list/i;
const ADDREG = /^add\s/i;
const DRAWREG = /^draw/i;
const SHUFFLEREG = /^shuffle/i;
const RESETREG = /^reset/i;

const NEWCARDSREG = /".+?"/g;

client.on('ready', () => {
  console.log("Connected as " + client.user.tag);
})

client.on('message', message => {
  if (!decks.hasOwnProperty(message.guild.id)) {
    console.log(`registering new guild ${message.guild.id}`);
    decks[message.guild.id] = new Deck(message.guild.id);
  }
  if (COMMANDREG.test(message.content)) {
    let command = message.content.replace(COMMANDREG, "");
    if (CARDREG.test(command)) {
      let card_cmd = command.replace(CARDREG, "");
      console.log(`New card command ${card_cmd}`);
      if (LISTREG.test(card_cmd)) {
        console.log("Listing all cards")
        if (decks[message.guild.id].listCards().length > 0) {
          message.channel.send(decks[message.guild.id].listCards());
        }
        else {
          message.channel.send("Your deck is empty");
        }

      }
      else if (ADDREG.test(card_cmd)) {
        console.log("Adding new card(s)");
        let cards = card_cmd.match(NEWCARDSREG);
        decks[message.guild.id].addCards(cards);
        message.channel.send("Adding the following cards: " + cards)
      }
      else if (DRAWREG.test(card_cmd)) {
        let drawnCard = decks[message.guild.id].drawCard();
        if (drawnCard){
          message.channel.send(drawnCard);
        }
        else {
          message.channel.send("Your deck is empty");
        }
      }
      else if (SHUFFLEREG.test(card_cmd)){
        decks[message.guild.id].shuffle();
        message.channel.send("Shuffling deck");
      }
      else if (RESETREG.test(card_cmd)){
        decks[message.guild.id].reset();
        message.channel.send("Resetting deck");
      }
      else {
        message.channel.send(`Invalid command "${card_cmd}"`)
      }
    }
  }
})

client.login("ODAwMDQzODI0Mzk5MTIyNDQz.YAMY3w.G9xypn5SJlZ8gL5U8kvG1pnG0K4")
