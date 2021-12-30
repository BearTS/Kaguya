const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
module.exports = class previous extends Command {
    constructor(...args) {
        super(...args, {
            name: 'previous',
            description: 'Go back to the previous song',
            category: 'Music',
            usage: '',
            accessableby: 'Everyone',
            slashCommand: true
        });
    };

    async interactionRun(interaction) {
        try {
            const queue = this.clientplayer.getQueue(interaction.guildId);
            if (!queue || !queue.playing) return interaction.editReply(`No music currently playing... try again ? ❌`, { ephemeral: true });
            if (!queue.previousTracks[1]) return interaction.editReply(`There was no music played before ... try again ? ❌`, { ephemeral: true });
            await queue.back();
            return interaction.editReply(`Previous Song: **${queue.current.title}**`);
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`, { ephemeral: true });
        };
    };
};