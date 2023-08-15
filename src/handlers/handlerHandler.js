const eventHandler = require('./eventHandler');
const dmTicketHandler = require("./dmTicketHandler");
const ticketChannelHandler = require('./ticketChannelHandler');
const starBoardHandler = require('./starBoardHandler');
const dmProfilePicHandler = require('./dmProfilePicHandler');
const banShareHandler = require('./banShareHandler');


module.exports = (client) =>
{
    dmTicketHandler(client);

    ticketChannelHandler(client);

    eventHandler(client);

    dmProfilePicHandler(client);

    banShareHandler(client);
}