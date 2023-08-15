require('dotenv').config();
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, escapeMarkdown, DataResolver } = require('discord.js');
const { default: axios } = require('axios');
const { claraRed } = require('../../config.json');
const path = require("path");
const fs = require("fs");

module.exports = (client) =>
{
    client.on("messageReactionAdd", async message =>
    {
        console.log(message);
    })
}