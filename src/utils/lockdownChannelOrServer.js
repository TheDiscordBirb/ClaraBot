const { mainServer, onBoardingChannels } = require("../../config.json");

module.exports =
{
    async lockdownHandler(client, interaction)
    {
        const scope = interaction.options.get("scope").value;
        const everyone = interaction.guild.roles.cache.get(interaction.guild.id)
        if(scope == "channel")
        {
            interaction.channel.permissionOverwrites.edit(everyone,
                {
                    SendMessages: false
                }
            );
        }
        else
        {
            const guild = client.guilds.cache.find(g => g.id === mainServer);
            const channels = await guild.channels.fetch();
            channels.forEach(ch =>
            {
                if(!onBoardingChannels.includes(ch.id))
                {
                    ch.permissionOverwrites.edit(everyone,
                        {
                            SendMessages: false
                        }
                    );
                }
            })
        }
    },
    async lockdownLiftHandler(client, interaction)
    {
        const scope = interaction.options.get("scope").value;
        if(scope == "channel")
        {
            if(!onBoardingChannels.includes(interaction.channel.id))
            {
                try
                {
                    interaction.channel.lockPermissions();
                }
                catch(e)
                {}
            }
        }
        else
        {
            const guild = client.guilds.cache.find(g => g.id === mainServer);
            const channels = await guild.channels.fetch();
            channels.forEach(ch =>
            {
                if(!onBoardingChannels.includes(ch.id))
                {
                try
                {
                    interaction.channel.lockPermissions();
                }
                catch(e)
                {}
                }
            })
        }
    }
}