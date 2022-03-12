const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("react")
    .setDescription("Reacting to my own message!👍"),
  // Execute command
  async execute(client, interaction) {
    const message = await interaction.reply({
      content: "You can react with Unicode emojis!",
      fetchReply: "true"
    });
    message.react('👍').then(() => message.react('👎'));

    const filter = (reaction, user) => {
      return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
    };

    message.awaitReactions({
      filter,
      max: 1,
      time: 60000,
      errors: ['time']
    }).then(collected => {
      const reaction = collected.first();
      if (reaction.emoji.name === '👍') {
        message.reply("You reacted with a thumbs up");
        return;
      }
      // else
      message.reply("You reacted with a thumbs down");
    }).catch(collected => {
      message.reply("You reacted with neither a thumbs up, nor a thumbs down");
    });
  },
};
