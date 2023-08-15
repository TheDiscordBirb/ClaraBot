const {
    ApplicationCommandOptionType
  } = require('discord.js');
const { picRestrictRole, permRoles } = require("../../../config.json");

module.exports = {
    name: 'pic-mute',
    description: "Takes away a user's ability to send pictures or other file attachments.",
    options:
    [
        {
            name: "user",
            description: "User to mute",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "time",
            description: "Time to mute the user for (measured in minutes, default is permanent)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],

    callback: (client, interaction) => 
    {
        if(interaction.member.roles.cache.find(r => r.id === permRoles[0]) || interaction.member.roles.cache.find(r => r.id === permRoles[1]))
        {
            if(interaction.options.get("time"))
            {
                const mutedUser = interaction.guild.members.cache.find(u => u.id === interaction.options.get("user").value);
                const picMuteRole = interaction.guild.roles.cache.find(r => r.id === picRestrictRole);
                mutedUser.roles.add(picMuteRole);
    
                interaction.reply({ content: `${mutedUser.user.username} has been restricted from sending files for ${interaction.options.get("time").value} minute(s).`, ephemeral: true });
    
                setTimeout( function() 
                {
                    try
                    {
                        mutedUser.roles.remove(picMuteRole);
                    }
                    catch(e)
                    {}
                }, interaction.options.get("time").value*60*1000);
            }
            else
            {
                const mutedUser = interaction.guild.members.cache.find(u => u.id === interaction.options.get("user").value);
                const picMuteRole = interaction.guild.roles.cache.find(r => r.id === picRestrictRole);
                mutedUser.roles.add(picMuteRole);
    
                interaction.reply({ content: `${mutedUser.user.username} has been restricted from sending files.`, ephemeral: true });
            }

        }
        else
        {
            interaction.reply({ content: "You do not have permission to use this!", ephemeral: true });
        }
    },
};