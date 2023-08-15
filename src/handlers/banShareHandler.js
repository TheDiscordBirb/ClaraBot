
module.exports = (client) =>
{
    client.on("messageCreate", async message =>
    {
        if(message.channel.id == "1131519586207019180" && message.author.id != client.user.id)
        {
            message.channel.send(message.content)
                .then(msg =>
                {
                    let regexExp = new RegExp(/(.*)User ID:(.*)\ ([0-9].*)/g);
                    let ids = msg.content.match(regexExp);
                    let guild = message.guild;

                    try
                    {
                        ids.forEach(id => 
                            {
                                let userId = id.slice(13);
                                guild.members.ban(userId)
                                    .then(message.reply(`Banned`));
                            })
                    }
                    catch(e)
                    {
                        message.reply("No ids");
                    }
                    
                    msg.delete();
                })
        }
    })
}