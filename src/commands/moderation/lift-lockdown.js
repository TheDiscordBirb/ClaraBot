const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { permRoles, staffChannel, mainServer, claraRed } = require("../../../config.json");
const { lockdownLiftHandler } = require("../../utils/lockdownChannelOrServer.js")

module.exports = {
    name: 'lift-lockdown',
    description: "Lifts the lockdown from a channel or the server.",
    options:
    [
        {
            name: "scope",
            description: "The scope of the lockdown.",
            type: ApplicationCommandOptionType.String,
            choices:
            [
                {
                    name: "server",
                    value: "server"
                },
                {
                    name: "channel",
                    value: "channel"
                }
            ],
            required: true,
        }
    ],

    callback: async (client, interaction) => 
    {
        if(interaction.member.roles.cache.find(r => r.id === permRoles[0]))
        {
            lockdownLiftHandler(client, interaction);
            interaction.reply({ content: "Lockdown lifted!", ephemeral: true });
        }
        else if(interaction.member.roles.cache.find(r => r.id === permRoles[1]))
        {
            interaction.reply({ content: "Lockdown lift conformation sent!", ephemeral: true });
            const guild = client.guilds.cache.find(g => g.id === mainServer);
            const staffChannelToSendEmbed = guild.channels.cache.find(ch => ch.id === staffChannel);

            const actionBuilderForForLockdownEmbed = new ActionRowBuilder();
                actionBuilderForForLockdownEmbed.components.push(
                    new ButtonBuilder()
                        .setCustomId("Approve")
                        .setEmoji("<:ClaraApproved_CM:1119951048111571096>")
                        .setLabel("Approve")
                        .setStyle(ButtonStyle.Primary)
                )
                
                let confirmEmbed = new EmbedBuilder()
                    .setColor(claraRed)
                    .setAuthor(({name: "Lockdown"}))
                    .setDescription(`${interaction.user.username} wants to initiate a lockdown.\nScope: ${interaction.options.get("scope").value}`)
        
                const confirmationMessageForLockdownEmbed = staffChannelToSendEmbed.send({content: `<@&${permRoles[0]}> <@&${permRoles[1]}`, embeds: [confirmEmbed], components: [actionBuilderForForLockdownEmbed]});
        
                const collectorFilterForLockdownEmbed = i => i.user.id !== interaction.user.id;

                try 
                {
                    const confirmationForLockdownEmbed = (await confirmationMessageForLockdownEmbed).awaitMessageComponent({ filter: collectorFilterForLockdownEmbed, time: 60000 });
                    if((await confirmationForLockdownEmbed).customId === "Approve")
                    {
                        lockdownLiftHandler(client, interaction);
                        (await confirmationMessageForLockdownEmbed).delete();
                        interaction.channel.send("This channel is now under lockdown!");
                    }
                }
                catch(e)
                {}
        }
        else
        {
            interaction.reply({ content: "You do not have permission to use this!", ephemeral: true });
        }
    },
};