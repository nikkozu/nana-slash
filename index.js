require("dotenv").config();

const { readdirSync } = require("fs");
const { Client, Intents, Collection } = require("discord.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ]
});

// Load Commands
client.commands = new Collection();
const commandFiles = readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Load Events
const eventFiles = readdirSync("./events").filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.data.once) {
    client.once(event.data.name, (...args) => event.execute(client, ...args));
    continue;
  }
  client.on(event.data.name, (...args) => event.execute(client, ...args));
}

client.login(process.env["DISCORD_TOKEN"]);
