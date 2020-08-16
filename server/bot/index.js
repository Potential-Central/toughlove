/* eslint-disable consistent-return */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const Discord = require('discord.js');
const fs = require('fs');

// Initial load for discord bot client
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = require('./config.js');
client.logger = require('../middlewares/logger');

// Top level async loader for discord
const init = async () => {
  // This loop reads the ./commands folder and attaches each event file to the appropriate event.
  fs.readdir('./commands/', (err, files) => {
    if (err) client.logger.error(err);
    const jsfile = files
      .filter((f) => !f.includes('.test.'))
      .filter((f) => f.split('.').pop() === 'js');

    if (jsfile.length <= 0) {
      throw new Error('No commands loaded, check importing in index.js');
    } else {
      client.logger.log(`Loading a total of ${jsfile.length} commands.`);
      jsfile.forEach((okf) => {
        const myCommand = require(`./commands/${okf}`);
        client.logger.log(`Loading Command: ${myCommand.config.name}`);
        client.commands.set(myCommand.config.name, myCommand);
        myCommand.config.aliases.forEach((alias) => {
          client.aliases.set(alias, myCommand.config.name);
        });
      });
    }
  });

  // Same thing for events
  fs.readdir('./events/', (err, files) => {
    if (err) return client.logger.error(err);
    const jsfile = files
      .filter((f) => !f.includes('.test.'))
      .filter((f) => f.split('.').pop() === 'js');
    if (jsfile.length <= 0) {
      throw new Error('No events loaded, check importing in index.js');
    } else {
      client.logger.log(`Loading a total of ${jsfile.length} events.`);
      jsfile.forEach((okf) => {
        const eventName = okf.split('.')[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${okf}`);
        // Bind the client to any event, before the existing arguments
        client.on(eventName, event.bind(null, client));
      });
    }
  });

  // Generate a cache of client permissions for pretty perm names in commands.
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i += 1) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);
};

init().then(() => client.logger.ready('Bot is online.'));
