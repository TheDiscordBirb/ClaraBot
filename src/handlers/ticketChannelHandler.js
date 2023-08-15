require('dotenv').config();
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, escapeMarkdown, DataResolver } = require('discord.js');
const { default: axios } = require('axios');
const { claraRed } = require('../../config.json');
const path = require("path");
const fs = require("fs");

module.exports = (client) =>
{
    client.on("messageCreate", async message =>
    {
        if(message.guild)
        {
            if(message.author.id == client.user.id) return;
            let guildMembers = await message.guild.members.fetch();
            guildMembers.forEach(async (m) => {
                if(m.user.id + "s-ticket" == message.channel.name)
                {
                    let channelNameLenght = message.channel.name.length;
                    let dmUser = message.guild.members.cache.find(user => user.id === message.channel.name.substring(0, channelNameLenght-8));
                    let ticketLogDir = path.join(__dirname, "..", "..", "..", "mnt", "tickets");
                    
                    if(!ticketLogDir)
                    {
                        fs.mkdirSync(ticketLogDir);
                    }

                    let ticketJson = path.join(ticketLogDir, `${m.user.id}s-ticket.json`);

                    if(message.content == "close ticket")
                    {
                        let ticketCloseEmbed = new EmbedBuilder()
                            .setColor(claraRed)
                            .setAuthor(({name: "Close ticket"}))
                            .setDescription("Do you want to close this ticket?")

                        const actionBuilderForClose = new ActionRowBuilder();
                                actionBuilderForClose.components.push(
                                    new ButtonBuilder()
                                        .setCustomId("Close")
                                        .setEmoji("<:ClaraApproved_CM:1119951048111571096>")
                                        .setLabel("Close ticket")
                                        .setStyle(ButtonStyle.Primary)
                                )
                        
                        const closeTicketMessage = message.channel.send({embeds: [ticketCloseEmbed], components: [actionBuilderForClose]});
                        
                        const collectorFilterForTicketClose = i => i.user.id === message.author.id;

                        try {
                            const closeTicket = (await closeTicketMessage).awaitMessageComponent({ filter: collectorFilterForTicketClose, time: 60000 });
                            if((await closeTicket).customId === "Close")
                            {
                                message.channel.setName(`${message.channel.name}-closed`);
                                let ticketClosedEmbed = new EmbedBuilder()
                                    .setColor(claraRed)
                                    .setAuthor(({name: `${message.author.username} closed this ticket`}))
                                    .setDescription("This ticket is now closed, making a ticket log right now.")

                                dmUser.send({embeds: [ticketClosedEmbed]});
                                message.channel.send({embeds: [ticketClosedEmbed]});
                                (await closeTicketMessage).delete();

                                const ticketLogChannel = message.guild.channels.cache.find(ch => ch.id === "1064185543669317753");

                                ticketLogChannel.send({files: [ticketJson]});

                                setTimeout( function() 
                                {
                                    message.channel.delete();
                                }, 5000);
                            }
                        }
                        catch (e) 
                        {
                            console.log(e);
                            (await closeTicketMessage).reply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                        }
                    }
                    else
                    {
                        let bannerColor = "";
                        let embedForMessage = new EmbedBuilder()
                        if(message.content.length < 1 && message.attachments.size == 0)
                        {
                            message.reply({content: "Idk what you did (probably sent a sticker), but i did not like it", ephemeral: true });
                            return;
                        }
                        else
                        {
                            await axios.get(`https://discord.com/api/users/${message.author.id}`, 
                            {
                                headers:
                                {
                                    Authorization: `Bot ${process.env.TOKEN}`,
                                },
                            })
                                .then((res) => {
                                    bannerColor = res.data.banner_color;
                                })
                            embedForMessage = new EmbedBuilder()
                                .setAuthor({name: message.author.username, iconURL: message.author.avatarURL(), url: `https://discord.com/users/${message.author.id}`})
                                .setColor(bannerColor.substring(1))
                                .setFooter({text: `Uid: ${message.author.id}`})
    
                            if(message.content.length >= 1)
                            {
                                embedForMessage.setDescription(message.content);
                            }

                            if(message.reference)
                            {
                                message.channel.messages.fetch(message.reference.messageId)
                                    .then(async msg =>
                                    {
                                        let replyEmbed = new EmbedBuilder()
                                        if(msg.embeds[0])
                                        {
                                            
                                            replyEmbed.setAuthor({name: msg.embeds[0].data.author.name, iconURL: msg.embeds[0].data.author.icon_url, url: msg.embeds[0].data.author.url})
                                            replyEmbed.setColor(msg.embeds[0].data.color)
                                            replyEmbed.setFooter(msg.embeds[0].data.footer)

                                            if(msg.embeds[0].data.description)
                                            {
                                                replyEmbed.setDescription(msg.embeds[0].data.description)
                                            }
                                            if(msg.embeds[0].data.image)
                                            {
                                                replyEmbed.setImage(msg.embeds[0].data.image.url) 
                                            }
                                        }

                                        if(msg.content)
                                        {
                                            if(!msg.embeds[0])
                                            {
                                                let userBannerColor = "";
                                                await axios.get(`https://discord.com/api/users/${msg.author.id}`, 
                                                {
                                                    headers:
                                                    {
                                                        Authorization: `Bot ${process.env.TOKEN}`,
                                                    },
                                                })
                                                .then((res) => {
                                                    userBannerColor = res.data.banner_color;
                                                });

                                                replyEmbed.setAuthor({ name: msg.author.username, icon_URL: msg.author.avatarURL(), url: `https://discord.com/users/${msg.author.id}`});
                                                replyEmbed.setColor(userBannerColor);
                                                replyEmbed.setFooter({text: `Uid: ${msg.author.id}`})
                                            }

                                            replyEmbed.setTitle(msg.content);
                                        }
                                        
                                        dmUser.send({content: "The above message was replied to:", embeds: [replyEmbed]});
                                    })
                            }
                        }
                        
                        let idStart;
                        let idEnd;
                        let ping = "";
                        for(let i = 0; i < message.content.length; i++)
                            {
                            if(message.content[i] != message.content.length)
                            {
                                if(message.content[i] == "<" && message.content[i+1] == "@")
                                {
                                    idStart = i;
                                }
    
                                if(message.content[i] == ">")
                                {
                                    idEnd = i+1;
                                }
    
                                if(idStart && idEnd)
                                {
                                    if(message.content.substring(idStart, idEnd) == `<@${dmUser.id}>`)
                                    {
                                        ping += `${message.content.substring(idStart, idEnd)} `;
                                        idStart = undefined;
                                        idEnd = undefined;
                                    }
                                }
                            }
                        }
                        
                        if(message.attachments.size == 1)
                        {
                            embedForMessage.setImage(message.attachments.first().url);
                        }
                        else if(message.attachments.size > 1)
                        {
                            let attachmentsToSend = [];
                            message.attachments.forEach(a => {
                                attachmentsToSend.push(a);
                            })
                            if(ping)
                            {
                                dmUser.send({content: ping, embeds: [embedForMessage]});
                            }
                            else
                            {
                                dmUser.send({files: attachmentsToSend});
                            }
                            ticketChannel.send({files: attachmentsToSend});
                            return;
                        }
                        if(ping)
                        {
                            dmUser.send({content: ping, embeds: [embedForMessage]});
                        }
                        else
                        {
                            dmUser.send({embeds: [embedForMessage]});
                        }
                        
                        const msgLog =
                        {
                            "user": message.author.username,
                            "content": message.content,
                            "from": "ticket channel"
                        }
 
                        let stringMsgLog = JSON.stringify(msgLog, null, 2);
                        fs.appendFile(ticketJson, stringMsgLog+"\n", function(err, result) {
                            if(err) console.log('error', err);
                        });
                    }
                }
            })
        }
    })
}