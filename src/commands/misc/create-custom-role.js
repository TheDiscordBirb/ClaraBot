const {
    ApplicationCommandOptionType,
  } = require('discord.js');
const { roleCreateRole, boosterRole } = require("../../../config.json");
const { readPermanent, writePermanent, getRole } = require("../../utils/managePermanent.js");
  
module.exports = {
    name: 'create-custom-role',
    description: 'Used for making custom roles.',
    options:
    [
        {
            name: "name",
            description: "Name of the custom role",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "color",
            description: "The color of the code (use hex codes like ff0000 without the #)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },/*
        {
            name: "emote",
            description: "Custom emote for the role, only works with emotes from THIS server",
            type: ApplicationCommandOptionType.String,
            required: true,
        },*/
    ],

    callback: async (client, interaction) => {
        try
        {
            let roleCount = 0;
            let allRoles = 0;
            let hasRole = false;
            interaction.member.roles.cache.some(rl => {
                if(roleCreateRole == rl.id || boosterRole == rl.id)
                {
                    const name = interaction.options.get("name").value;
                    const color = interaction.options.get("color").value;/*
                    const emote = interaction.options.get("emote").value;*/

                    if(color.length != 6)
                    {
                        interaction.reply({ content: 'There was a problem with the color you provided', ephemeral: true });
                    }/*
                    else if(!emote.startsWith("<:") || !emote.endsWith(">"))
                    {
                        interaction.reply({ content: 'There was a problem with the emote you provided', ephemeral: true });
                    }*/

                    const guild = interaction.guild;


                    const role = getRole(interaction.member.id, "custom-role-list.json");
                    if(role)
                    {
                        interaction.reply({ content: 'You already have a custom role!', ephemeral: true });
                        hasRole = true;
                    }
                    else
                    {
                        guild.roles.create(
                            {
                                    name: name,
                                    color: color,
                                    //icon: emote,
                            }
                        )
                            .then(r => 
                                {
                                    interaction.member.roles.add(r);

                                    const vanityPos = interaction.guild.roles.cache.find(r => r.id === "1064185542511698053").position;
                                    r.setPosition(vanityPos-1);
    
                                    const customRoleList = readPermanent("custom-role-list.json");
                                    if(!customRoleList)
                                    {
                                        console.log("CustomRoleList not found!");
                                        return;
                                    }
    
                                    customRoleList.roles.push(
                                        {
                                            "uid": interaction.member.id,
                                            "role_uid": r.id
                                        }
                                    );
    
                                    var newData = JSON.stringify(customRoleList, null, 2);
                                    writePermanent("custom-role-list.json", newData);
                                });
                    }
                }
                else
                {
                    roleCount++;
                }
            });
            interaction.member.roles.cache.each(role => {allRoles++});
            if(allRoles == roleCount)
            {
                interaction.reply({ content: 'You do not have permission to create a role!', ephemeral: true });
            }
            else
            {
                if(hasRole == false)
                {
                    interaction.reply({ content: 'Role created successfully!', ephemeral: true });
                }
                if(interaction.member.roles.cache.some(r => r.id === roleCreateRole))
                {
                    let role = interaction.member.roles.cache.find(r => r.id === roleCreateRole)
                    
                    interaction.member.roles.remove(role);
                }
            }
        }
        catch(error)
        {
            console.log(error);
            interaction.user.send({ content: "An error occured while you were setting up the custom role.\nBirb was too lazy to write detailed error msgs, so just dm/ping him with a screenshot of the command you tried to execute.\nThank you for your cooperation.", ephemeral: true });
        }
    },
};

