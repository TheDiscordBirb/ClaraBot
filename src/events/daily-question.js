const {
    EmbedBuilder
  } = require('discord.js');
const { claraRed } = require('../../config.json');
const questionsPath = require("../utils/qotd-questions.json");
const { mainServer } = require("../../config.json");

module.exports =
{
    name: "daily-question",
    description: "Idk, an event for qotd",
    dailyQuestion(client, channels = [])
    {
        const jan1 = new Date("1/1/2023");
        const currentDate = new Date();
        const daysFromJan1 = Math.round((currentDate.getTime() - jan1.getTime()) / (1000*60*60*24));
        
        let testEmbed = new EmbedBuilder()
            .setColor(claraRed)
            .setAuthor(({name: "Question of the day."}))
            .setDescription(questionsPath.questions[daysFromJan1])

        channels.forEach(async c =>
        {   
            if(c == "1126173141115346996")
            {
                const guild = await client.guilds.fetch(mainServer);
                const channelToSendEmbedTo = guild.channels.cache.find(ch => ch.id === c);
                channelToSendEmbedTo.send({ content: "<@&1126173968970305650>", embeds: [testEmbed] });
            }
            else
            {
                const guild = await client.guilds.fetch(mainServer);
                const channelToSendEmbedTo = guild.channels.cache.find(ch => ch.id === c);
                channelToSendEmbedTo.send({ embeds: [testEmbed] });
            }
        })
    }
}