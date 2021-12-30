const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class seek extends Command {
    constructor(...args) {
        super(...args, {
            name: 'seek',
            description: 'seek the Current song',
            category: 'Music',
            usage: '[time]',
            accessableby: 'Everyone',
            slashCommand: true,
            commandOptions: [{
                name: 'time',
                type: 'STRING',
                description: 'How much time ',
                required: true
            }]
        });
    };

    async interactionRun(interaction) {
        try {
            await interaction.deferReply();
            const queue = this.client.player.getQueue(interaction.guildId);
            if (!queue || !queue.playing) return interaction.editReply(`No music currently playing ... try again ? ❌`, { ephemeral: true });
            const timeToMS = ms(interaction.options.getString('time'));

            if (timeToMS >= queue.current.durationMS) return interaction.editReply(`The indicated time is higher than the total time of the current song... try again ? ❌\n*Try for example a valid time like **5s, 10s, 20 seconds, 1m**...*`, { ephemeral: true });

            await queue.seek(timeToMS);

            return interaction.editReply(`Time set on the current song **${ms(timeToMS, { long: true })}** ✅`);
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`, { ephemeral: true });
        };
    };
};