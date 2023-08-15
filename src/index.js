require('dotenv').config();
const { Client, IntentsBitField, Partials } = require('discord.js');
const handlerHandler = require('./handlers/handlerHandler');
const cron = require("cron");
const { dailyQuestion }= require("./events/daily-question");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ]
});

let dailyQuestionJob = new cron.CronJob("0 12 * * *", () =>
{
  dailyQuestion(client, ["1124292639362142329"]);
});

dailyQuestionJob.start();

handlerHandler(client);

client.login(process.env.TOKEN);
