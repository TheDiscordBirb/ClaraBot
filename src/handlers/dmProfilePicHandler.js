const { admins } = require('../../config.json');

module.exports = (client) =>
{
    client.on("messageCreate", async message =>
    {
        if(!message.guild && message.author.id != client.user.id)
        {
            if(message.content == "pfp" && message.attachments.size >= 1 && admins.includes(message.author.id))
            {
                message.attachments.forEach(a => {client.user.setAvatar(a.url)});
                message.reply("Pfp set");
            }
        }
    })
}