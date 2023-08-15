const {
    ApplicationCommandOptionType
  } = require('discord.js');
const { picRestrictRole, permRoles } = require("../../../config.json");

module.exports = {
    name: 'pic-unmute',
    description: "Takes away the pic mute role from a user.",
    options:
    [
        {
            name: "user",
            description: "User to unmute",
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],

    callback: (client, interaction) => 
    {
        if(interaction.member.roles.cache.find(r => r.id === permRoles[0]) || interaction.member.roles.cache.find(r => r.id === permRoles[1]))
        {
            try
            {
                const mutedUser = interaction.guild.members.cache.find(u => u.id === interaction.options.get("user").value);
                const picMuteRole = interaction.guild.roles.cache.find(r => r.id === picRestrictRole);
                mutedUser.roles.remove(picMuteRole);
        
                interaction.reply({ content: `${mutedUser.user.username} has been unrestricted from sending files.`, ephemeral: true });
            }
            catch(e)
            {
                interaction.reply({ content: "Ping birb with a screenshot of this and a screenshot of what you wanted to do, cause the code did an oopsie. \n(Or you just tried to unmute someone who isnt muted)"})
            }
        }
        else
        {
            interaction.reply({ content: "You do not have permission to use this!", ephemeral: true });
        }
    },
};