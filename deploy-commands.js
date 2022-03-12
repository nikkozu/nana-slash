require("dotenv").config();
const { readdirSync } = require("fs");

const CLIENT_ID = process.env["CLIENT_ID"];
const GUILD_ID = process.env["GUILD_ID"];
const TOKEN_ID = process.env["DISCORD_TOKEN"];
const APP_ENV = process.env["APP_ENV"];

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const rest = new REST({ version: "9" }).setToken(TOKEN_ID);

(async () => {
  try {
    // Check if APP_ENV only `production` or `development`
    if (APP_ENV !== "production" && APP_ENV !== "development")
      throw `App Environment for "${APP_ENV}" is not available!`;

    // Build commands array list from `commands` folder
    const commands = [];
    const commandFiles = readdirSync("./commands").filter((file) =>
      file.endsWith(".js")
    );
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);

      // Add [GUILD] prefix to description, if App environment is Development
      if (APP_ENV === "development") {
        // Check if command have options, then add [GUILD] prefix to the description
        if (command.data.options.length)
          command.data.options.forEach((option) => (option.description = `[GUILD] ${option.description}`));

        Object.assign(command.data, { description: `[GUILD] ${command.data.description}` });
      }

      // Adding commands data into commands collection
      commands.push(command.data.toJSON());
    }

    if (APP_ENV === "development") {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
      console.log("Successfully registered application commands for dev guild");
    } else {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
      console.log("Successfully registered application commands globally");
    }
  } catch (error) {
    if (error) console.error(`Whoops: ${error}`);
  }
})();
