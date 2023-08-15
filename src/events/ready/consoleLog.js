module.exports = (client) => {
  console.log(`${client.user.tag} is online.`);
  client.user.setActivity("DMs for modmail", {type: 2});
};
