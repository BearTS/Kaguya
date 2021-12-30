const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class shuffle extends Command {
    constructor(...args) {
        super(...args, {
            name: 'shuffle',
            description: 'Shuffle the Current Queue',
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
            if (!queue.tracks[0]) return interaction.editReply(`No music in the queue after the current one ... try again ? ❌`, { ephemeral: true });
            await queue.shuffle();
            return interaction.editReply(`Queue shuffled **${queue.tracks.length}** song(s) ! ✅`);
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`, { ephemeral: true });
        };
    };
};