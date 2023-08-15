const {
    ApplicationCommandOptionType,
    EmbedBuilder
  } = require('discord.js');
const { permRoles, claraRed, devs } = require("../../../config.json");
  
module.exports = {
    name: 'ban',
    description: 'Used for banning people.',
    options:
    [
        {
            name: "user",
            description: "User you want to ban",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "dm",
            description: "Do you want to send the person the reason they got banned in dms?",
            type: ApplicationCommandOptionType.Boolean,
            required: true,
        },
        {
            name: "reason",
            description: "Reason for the ban",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: "media",
            description: "The media attached to the ban message",
            type: ApplicationCommandOptionType.Attachment,
            required: false,
        }
    ],

    callback: async (client, interaction) => {
        try
        {
            let guild = interaction.guild;
            let bannedUser = guild.members.cache.find(u => u.id === interaction.options.get("user").value);

            if(bannedUser.roles.cache.find(r => r.id === permRoles[0] || r.id === permRoles[1]))
            {
                interaction.reply("You cannot ban a moderator or administrator!");
            }
            else
            {
                if(interaction.member.roles.cache.find(r => r.id === permRoles[0] || r.id === permRoles[1]))
                {
                    
                    let birb = guild.members.cache.find(b => b.id === devs[0]);
                    if(interaction.options.get("dm"))
                    {
                        let banEmbed = new EmbedBuilder()
                            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL(), url: `https://discord.com/users/${interaction.user.id}`})
                            .setColor(claraRed)
                            .setFooter({text: `Uid: ${interaction.user.id}`})
                            .setTitle("You have been banned from Clara Mains | HSR.");
                        if(interaction.options.get("reason"))
                        {
                            banEmbed.setDescription(`Reason: \n${interaction.options.get("reason").value}`);
                        }
                        
                        if(interaction.options.get("media"))
                        {
                            try
                            {
                                banEmbed.setImage(interaction.options.get("media").attachment.attachment);
                            }
                            catch(e)
                            {
                                interaction.user.send("There was a problem with the attached media, it will not be included with the ban message.");
                            }
                        }
        
                        await bannedUser.send({embeds: [banEmbed]});
                        
                        banEmbed.setTitle(`${bannedUser.user.username} has been banned`);
        
                        birb.send({embeds: [banEmbed]});
                    }
                    
                    if(interaction.options.get("reason"))
                    {
                        guild.members.ban(interaction.options.get("user").value, {reason: interaction.options.get("reason").value});
                    }
                    else
                    {
                        guild.members.ban(interaction.options.get("user").value);
                    }
                }
            }
        }
        catch(e)
        {
            console.log(e);
        }
    },
};

