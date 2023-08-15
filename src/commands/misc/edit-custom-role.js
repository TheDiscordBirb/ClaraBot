const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    GuildMemberRoleManager
  } = require('discord.js');
const { getRole } = require("../../utils/managePermanent.js");
  
module.exports = {
    name: 'edit-custom-role',
    description: 'Used for editing custom roles.',
    options:
    [
        {
        name: "new-name",
        description: "New name of the custom role",
        type: ApplicationCommandOptionType.String,
        required: true,
        },
        {
        name: "new-color",
        description: "New color of the code (use hex codes like ff0000 without the #)",
        type: ApplicationCommandOptionType.String,
        required: true,
        },/*
        {
        name: "new-emote",
        description: "New custom emote for the role, only works with emotes from THIS server",
        type: ApplicationCommandOptionType.String,
        required: true,
        },*/
    ],

    callback: async (client, interaction) => {
        try
        {
            const newName = interaction.options.get("new-name").value;
            const newColor = interaction.options.get("new-color").value;/*
            const newEmote = interaction.options.get("new-emote").value;*/

            if(newColor.length != 6)
            {
                interaction.reply({ content: 'There was a problem with the color you provided', ephemeral: true });
            }/*
            else if(!newEmote.startsWith("<:") || !newEmote.endsWith(">"))
            {
                interaction.reply({ content: 'There was a problem with the emote you provided', ephemeral: true });
            }*/

            const guild = interaction.guild;

            const role = getRole(interaction.member.id, "custom-role-list.json");
            if(!role)
            {
                interaction.reply({ content: 'You do not have a custom role!', ephemeral: true });
                return;
            }
            
            const newRole = guild.roles.cache.find(r => r.id === role.role_uid);
            if(!newRole)
            {
                interaction.reply({ content: 'Role not found!', ephemeral: true });
                return;
            }

            newRole.edit(
                {
                    name: newName,
                    color: newColor,
                    //icon: newEmote,
                }
            );

            interaction.reply({ content: 'Role edited successfully!', ephemeral: true });
        }
        catch(error)
        {
            interaction.user.send({ content: "An error occured while you were editing the custom role.\nBirb was too lazy to write detailed error msgs, so just dm/ping him with a screenshot of the command you tried to execute.\nThank you for your cooperation.", ephemeral: true });
        }
    },
};