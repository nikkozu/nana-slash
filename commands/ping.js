const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!🏓"),
  // Execute command
  async execute(client, interaction) {
    const API = client.ws.ping;
    await interaction.reply(`Pong!🏓 ${API}ms`);
  },
};
