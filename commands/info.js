const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get info about a user or a server!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Info about a user")
        .addUserOption((option) =>
          option.setName("target").setDescription("The user")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("server").setDescription("Info about the server")
    ),
  // Execute command
  async execute(client, interaction) {
    const getReply = generateReply(interaction);
    await interaction.reply(getReply);
  },
};

function generateReply(interaction) {
  const subCommand = interaction.options.getSubcommand();
  const user = interaction.options.getUser("target");

  if (subCommand === "user" && user)
    return `Username: ${user.username}\nID: ${user.id}`;
  if (subCommand === "server")
    return `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`;
  // else
  return `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`;
}
