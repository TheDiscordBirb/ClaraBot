const pmc = require("../../rpg/rpg-character-base-stats/phys-main-character.json");
const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "create-profile",
    description: "Used for creating a profile for the rpg game.",
    options:
    [
        {
            name: "gender",
            description: "The gender of the main character.",
            type: ApplicationCommandOptionType.String,
            choices:
            [
                {
                    name: "female",
                    value: "female"
                },
                {
                    name: "male",
                    value: "male"
                }
            ],
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) =>
    {
        try
        {
            
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
                interaction.reply({ content: "You already have a profile", ephemeral: true })
                return;
            }
            else
            {
                const profile = 
                {
                    "username": interaction.user.username,
                    "gender": interaction.options.get("gender").value,
                    "inventory":
                    {},
                    "characters":
                    {
                        pmc,
                    }
                }

                let stringProfile = JSON.stringify(profile, null, 2);
                console.log(stringProfile);
                fs.writeFile(dest, stringProfile, function(err, result) {
                    if(err) console.log('error', err);
                  });
               
                interaction.reply({ content: "Profile created", ephemeral: true })
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
}