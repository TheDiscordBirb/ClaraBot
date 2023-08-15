const pmc = require("../../rpg/rpg-character-base-stats/phys-main-character.json");
const { PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
require('dotenv').config();
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { claraRed } = require('../../../config.json');

module.exports = {
    name: "delete-profile",
    description: "Used for deleting a profile from the rpg game.",
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) =>
    {
        try
        {
            const actionBuilderForTicket = new ActionRowBuilder();
            actionBuilderForTicket.components.push(
                new ButtonBuilder()
                    .setCustomId("Yes")
                    .setEmoji("<:ClaraApproved_CM:1119951048111571096>")
                    .setLabel("Yes")
                    .setStyle(ButtonStyle.Primary)
                )
                    
            let confirmEmbed = new EmbedBuilder()
                .setColor(claraRed)
                .setAuthor(({name: "Delete profile."}))
                .setDescription("Do you want to delete your profile?")
    
            const confirmationMessageForProfileDelete = interaction.reply({embeds: [confirmEmbed], components: [actionBuilderForTicket], ephemeral: true });
    
            const collectorFilterForProfileDelete = i => i.user.id === interaction.user.id;
    
            try
            {
                const confirmationForProfileDelete = (await confirmationMessageForProfileDelete).awaitMessageComponent({ filter: collectorFilterForProfileDelete, time: 60000 });
                if((await confirmationForProfileDelete).customId == "Yes")
                {
                    let confirmedEmbed = new EmbedBuilder()
                        .setColor(claraRed)
                        .setAuthor(({name: "Profile deleted"}))
                        .setDescription("Your profile has been deleted.")

                    ;(await confirmationMessageForProfileDelete).delete();

                    const profileFolder = path.join(__dirname, "..", "..", "..", "..", "mnt", "profiles");
                    let dest = "";
                    if(fs.existsSync(profileFolder))
                    {
                        dest = path.join(profileFolder, `${interaction.user.id}.json`);
                    }
                    else
                    {
                        fs.mkdirSync(profileFolder);
                        dest = path.join(profileFolder, `${interaction.user.id}.json`);
                    }
            
                    if(fs.existsSync(dest))
                    {
                        fs.unlinkSync(dest, function (err)
                        {
                            console.log(err);   
                        });
                        interaction.user.send({embeds: [confirmedEmbed]});
                    }
                    else
                    {
                        interaction.user.send({ content: "You dont have a profile." })
                        ;(await confirmationMessageForProfileDelete).delete();
                    }
                }
            }
            catch(e)
            {
                (await confirmationMessageForProfileDelete).reply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
}