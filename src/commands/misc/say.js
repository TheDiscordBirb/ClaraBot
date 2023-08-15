const { ApplicationCommandOptionType } = require('discord.js');
const { permRoles } = require('../../../config.json');

module.exports = {
    name: 'say',
    description: 'Makes Clara say something.',
    options:
    [
        {
        name: "text",
        description: "The thing you want Clara to say.",
        type: ApplicationCommandOptionType.String,
        required: true,
        },
    ],

    callback: (client, interaction) => {
        let alreadyRun = false;
        interaction.member.roles.cache.forEach(role => {
            if(permRoles.includes(role.id) && !alreadyRun)
            {
                interaction.reply({ content: 'Command ran successfully', ephemeral: true });
                let channel = client.channels.cache.get("1064185544160059478");
                interaction.channel.send(interaction.options.get("text").value)
                    .then(i => 
                    {
                        channel.send(`${interaction.user.username} made Clara say ${interaction.options.get("text").value}\nLink: ${i.url}`);
                    });
        
                alreadyRun = true;
                return;
            }
        });
        if(!alreadyRun)
        {
            interaction.reply({ content: "You can't use this", ephemeral: true });
        }
    },
};