const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class skip extends Command {
    constructor(...args) {
        super(...args, {
            name: 'skip',
            description: 'skip the Current song',
            category: 'Music',
            usage: '',
            accessableby: 'Everyone',
            slashCommand: true
        });
    };

    async interactionRun(interaction) {
        try {
            await interaction.deferReply();
            const queue = this.client.player.getQueue(interaction.guildId);
            if (!queue || !queue.playing) return interaction.editReply(`No music currently playing ... try again ? ❌`, { ephemeral: true });
            const success = queue.skip();

            return interaction.editReply(success ? `Current music ${queue.current.title} skipped ✅` : `Something went wrong... try again ? ❌`);

        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`, { ephemeral: true });
        };
    };
};