require('dotenv').config();
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { claraRed, mainServer, checkMark, partnerIcon } = require('../../config.json');
const { default: axios } = require('axios');
const path = require("path");
const fs = require("fs");

module.exports = (client) =>
{
    client.on("messageCreate", async message =>
    {
        if(!message.guild && message.author.id != client.user.id && message.content != "pfp")
        {
            const guild = client.guilds.cache.find(g => g.id = mainServer);
            const ticketChannel = guild.channels.cache.find(ch => ch.name === `${message.author.id}s-ticket`);
            let pingedRole = "";
            let ticketLogDir = path.join(__dirname, "..", "..", "..", "mnt", "tickets");
            let ticketJson = "";

            if(!ticketLogDir)
            {
                fs.mkdirSync(ticketLogDir);
            }

            ticketJson = path.join(ticketLogDir, `${message.author.id}s-ticket.json`);


            if(!ticketChannel)
            {
                try
                {
                    fs.unlinkSync(ticketJson, function (err)
                    {
                        console.log(err);   
                    });

                }
                catch(e)
                {

                }

                const actionBuilderForTicket = new ActionRowBuilder();
                actionBuilderForTicket.components.push(
                    new ButtonBuilder()
                        .setCustomId("Yes")
                        .setEmoji(checkMark)
                        .setLabel("Yes")
                        .setStyle(ButtonStyle.Primary)
                )
                
                let confirmEmbed = new EmbedBuilder()
                    .setColor(claraRed)
                    .setAuthor(({name: "Open a ticket"}))
                    .setDescription("Do you want to open a ticket?")
        
                const confirmationMessageForTicket = message.author.send({embeds: [confirmEmbed], components: [actionBuilderForTicket]});
        
                const collectorFilterForTicket = i => i.user.id === message.author.id;

                try {
                    const confirmationForTicket = (await confirmationMessageForTicket).awaitMessageComponent({ filter: collectorFilterForTicket, time: 60000 });
                    if((await confirmationForTicket).customId === "Yes")
                    {
                        let partnerOrOther = new EmbedBuilder()
                            .setColor(claraRed)
                            .setAuthor(({name: "Choose one."}))
                            .setDescription("Is this a ticket for partnership or other reasons?")
            
                        const actionBuilderForPartnerOrOther = new ActionRowBuilder();
                        actionBuilderForPartnerOrOther.components.push(
                            new ButtonBuilder()
                                .setCustomId("Partnership")
                                .setEmoji(partnerIcon)
                                .setLabel("Partnership")
                                .setStyle(ButtonStyle.Primary)
                        )
                        actionBuilderForPartnerOrOther.components.push(
                            new ButtonBuilder()
                                .setCustomId("Other")
                                .setEmoji(checkMark)
                                .setLabel("Other")
                                .setStyle(ButtonStyle.Primary)
                        )

                        ;(await confirmationMessageForTicket).delete();

                        const confirmationMessageForPartnerOrOther = message.author.send({embeds: [partnerOrOther], components: [actionBuilderForPartnerOrOther]});

                        const collectorFilterForPartnerOrOther = i => i.user.id === message.author.id;

                        try
                        {
                            const confirmationForPartnerOrOther = (await confirmationMessageForPartnerOrOther).awaitMessageComponent({ filter: collectorFilterForPartnerOrOther, time: 60000 });
                            if((await confirmationForPartnerOrOther).customId === "Partnership")
                            {
                                let confirmedEmbed = new EmbedBuilder()
                                    .setColor(claraRed)
                                    .setAuthor(({name: "Ticket opened"}))
                                    .setDescription("Your ticket has been opened with pinging the admin in charge of partnerships.\nYou can start chatting with the staff here.")
                
                                ;(await confirmationMessageForPartnerOrOther).delete();
                
                                message.author.send({embeds: [confirmedEmbed]});
                
                                pingedRole = "480956116482785299";

                                const guild = client.guilds.cache.find(g => g.id === "1064185542138405006");
                                
                                guild.channels.create({name: `${message.author.id}s-ticket`, type: 0})
                                    .then(ch =>
                                    {
                                        let category = guild.channels.cache.find(c => c.id === "1064185543421861907");
                                        ch.setParent(category);
                    
                                        let pingEmbed = new EmbedBuilder()
                                            .setColor(claraRed)
                                            .setAuthor(({name: `${message.author.username}'s ticket`}))
                                            .setDescription(`This is a partnership ticket.`)
                    
                                        ch.send({content: `<@${pingedRole}>`, embeds: [pingEmbed]});
                                    })

                                

                            }
                            else if((await confirmationForPartnerOrOther).customId === "Other")
                            {
                                let confirmedEmbed = new EmbedBuilder()
                                    .setColor(claraRed)
                                    .setAuthor(({name: "One last step"}))
                                    .setDescription("Which staff role should be pinged for this ticket?")
                    
                                const actionBuilderForPings = new ActionRowBuilder();
                                actionBuilderForPings.components.push(
                                    new ButtonBuilder()
                                        .setCustomId("Admin")
                                        .setEmoji(checkMark)
                                        .setLabel("Admin")
                                        .setStyle(ButtonStyle.Primary)
                                )
                                actionBuilderForPings.components.push(
                                    new ButtonBuilder()
                                        .setCustomId("Moderator")
                                        .setEmoji(checkMark)
                                        .setLabel("Moderator")
                                        .setStyle(ButtonStyle.Primary)
                                )
        
                                ;(await confirmationMessageForPartnerOrOther).delete();
                                
                                const confirmationMessageForPing = message.author.send({embeds: [confirmedEmbed], components: [actionBuilderForPings]});
                    
                                const collectorFilterForPings = i => i.user.id === message.author.id;
                                try
                                {
                                    const confirmationForPing = (await confirmationMessageForPing).awaitMessageComponent({ filter: collectorFilterForPings, time: 60000 });
                            
                                    if((await confirmationForPing).customId == "Admin")
                                    {
                                        let confirmedEmbed = new EmbedBuilder()
                                            .setColor(claraRed)
                                            .setAuthor(({name: "Ticket opened"}))
                                            .setDescription("Your ticket has been opened with pinging the admins.\nYou can start chatting with the staff here.")
        
                                        ;(await confirmationMessageForPing).delete();
                        
                                        message.author.send({embeds: [confirmedEmbed]});
                        
                                        pingedRole = "1064185542557843517";
                                    }
                                    else if((await confirmationForPing).customId == "Moderator")
                                    {
                                        let confirmedEmbed = new EmbedBuilder()
                                            .setColor(claraRed)
                                            .setAuthor(({name: "Ticket opened"}))
                                            .setDescription("Your ticket has been opened with pinging the moderators.\nYou can start chatting with the staff here.")
                        
                                        ;(await confirmationMessageForPing).delete();
                                        
                                        message.author.send({embeds: [confirmedEmbed]});
                        
                                        pingedRole = "1120711995633717249";
                                    }
                        
                                    const guild = client.guilds.cache.find(g => g.id === "1064185542138405006");
                        
                                    guild.channels.create({name: `${message.author.id}s-ticket`, type: 0})
                                        .then(ch =>
                                        {
                                            let category = guild.channels.cache.find(c => c.id === "1064185543421861907");
                                            ch.setParent(category);
                        
                                            let pingEmbed = new EmbedBuilder()
                                                .setColor(claraRed)
                                                .setAuthor(({name: `${message.author.username}'s ticket`}))
                                                .setDescription(`${message.author.username} requested that <@&${pingedRole}> get pinged for this ticket.`)
                        
                                            ch.send({content: `<@&${pingedRole}>`, embeds: [pingEmbed]});
                                        })
                                }
                                catch(e)
                                {
                                    (await confirmationMessageForPing).reply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                                }
                            }
                        }
                        catch (e) 
                        {
                            (await confirmationMessageForPartnerOrOther).reply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                        }
                    }
                } 
                catch (e) 
                {
                    (await confirmationMessageForTicket).reply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                }

            }
            else
            {
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
                                    .setEmoji(checkMark)
                                    .setLabel("Close ticket")
                                    .setStyle(ButtonStyle.Primary)
                            )
                    
                    const closeTicketMessage = message.author.send({embeds: [ticketCloseEmbed], components: [actionBuilderForClose]});
                    
                    const collectorFilterForTicketClose = i => i.user.id === message.author.id;

                    try {
                        const closeTicket = (await closeTicketMessage).awaitMessageComponent({ filter: collectorFilterForTicketClose, time: 60000 });
                        if((await closeTicket).customId === "Close")
                        {
                            ticketChannel.setName(`${ticketChannel.name}-closed`);
                            let ticketClosedDmEmbed = new EmbedBuilder()
                                .setColor(claraRed)
                                .setAuthor(({name: "Closed ticket"}))
                                .setDescription("This ticket is now closed, making a ticket log right now.")
                            ;(await closeTicketMessage).delete();
                            message.author.send({embeds: [ticketClosedDmEmbed]});
                            let ticketClosedChannelEmbed = new EmbedBuilder()
                                .setColor(claraRed)
                                .setAuthor(({name: `${message.author.username} closed this ticket`}))
                                .setDescription("This ticket is now closed, making a ticket log right now.")
                            ticketChannel.send({embeds: [ticketClosedChannelEmbed]});

                            const ticketLogGuild = client.guilds.cache.find(g => g.id === "1064185542138405006");
                            const ticketLogChannel = ticketLogGuild.channels.cache.find(ch => ch.id === "1064185543669317753");

                            ticketLogChannel.send({files: [ticketJson]});
                            
                            setTimeout( function() 
                            {
                                ticketChannel.delete();
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
                    let embedForMessage = new EmbedBuilder()
                        .setAuthor({name: message.author.username, iconURL: message.author.avatarURL(), url: `https://discord.com/users/${message.author.id}`})
                        .setColor(bannerColor)
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
                                    
                                ticketChannel.send({content: "The above message was replied to:", embeds: [replyEmbed]});
                            })
                    }

                    let idStart;
                    let idEnd;
                    let pings = "";
                    for(let i = 0; i < message.content.length; i++)
                        {
                        if(message.content[i] != message.content.length)
                        {
                            if(message.content[i] == "<" && message.content[i+1] == "@")
                            {
                                idStart = i;
                                console.log(idStart);
                            }

                            if(message.content[i] == ">")
                            {
                                idEnd = i+1;
                                console.log(idEnd);
                            }

                            if(idStart || idStart == 0 && idEnd)
                            {
                                pings += `${message.content.substring(idStart, idEnd)} `;
                                console.log(pings);
                                idStart = undefined;
                                idEnd = undefined;
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

                        if(pings)
                        {
                            ticketChannel.send({content: pings, embeds: [embedForMessage]});
                        }
                        else
                        {
                            ticketChannel.send({embeds: [embedForMessage]});
                        }
                        ticketChannel.send({files: attachmentsToSend});
                        return;
                    }
                    if(pings)
                    {
                        ticketChannel.send({content: pings, embeds: [embedForMessage]});
                    }
                    else
                    {
                        ticketChannel.send({embeds: [embedForMessage]});
                    }
                    
                    const msgLog =
                    {
                        "user": message.author.username,
                        "content": message.content,
                        "from": "dm"
                    }

                    let stringMsgLog = JSON.stringify(msgLog, null, 2);
                    fs.appendFile(ticketJson, stringMsgLog+"\n", function(err, result) {
                        if(err) console.log('error', err);
                    });
                }
            }
        }
    }) 
}