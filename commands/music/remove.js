const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
module.exports = class remove extends Command {
    constructor(...args) {
        super(...args, {
            name: 'remove',
            description: 'remove song from queue',
            category: 'Music',
            usage: '',
            accessableby: 'Everyone',
            slashCommand: true,
            commandOptions: [{
                name: 'index',
                type: 'INTEGER',
                description: 'Index of the song',
                required: true
            }]
        });
    };

    async interactionRun(interaction) {
        try {
            await interaction.deferReply();
            const queue = this.client.player.getQueue(message.guild.id);
            if (!queue || !queue.playing) return interaction.editReply(`No music currently playing... try again ? ❌`, { ephemeral: true });
            if (!queue.removeTracks[1]) return message.channel.send(`There was no music played before ... try again ? ❌`, { ephemeral: true });
            const trackIndex = interaction.options.getInteger('index') - 1;
            const trackName = queue.tracks[trackIndex].title;
            queue.remove(trackIndex);
            return interaction.editReply(`Removed **${trackName}** from the queue`);
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`, { ephemeral: true });
        };
    };
};