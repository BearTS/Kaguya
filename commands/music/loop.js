const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { QueueRepeatMode } = require("discord-player");

module.exports = class loop extends Command {
    constructor(...args) {
        super(...args, {
            name: 'loop',
            description: 'Loop the Current Queue',
            category: 'Music',
            usage: '',
            accessableby: 'Everyone',
            slashCommand: true,
            commandOptions: [{
                name: 'type',
                type: 'STRING',
                description: 'What to Loop',
                required: true,
                choices: [

                    {
                        name: 'song',
                        value: 'true'
                    },
                    {
                        name: 'queue',
                        value: 'false'
                    }
                ]
            }]
        });
    };

    async interactionRun(interaction) {
        try {
            await interaction.deferReply();
            const queue = this.client.player.getQueue(interaction.guildId);
            if (!queue || !queue.playing) return interaction.editReply(`No music currently playing... try again ? ❌`);
            const type = interaction.options.getString('type');
            if (type === 'true') {
                if (queue.repeatMode === 2) return interaction.editReply(`You must first disable the current queue in the loop mode ... try again ? ❌`, { ephemeral: true });

                const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);

                return interaction.editReply(success ? `Repeat mode **${queue.repeatMode === 0 ? 'disabled' : 'enabled'}** the current music will be repeated endlessly (you can loop the queue with the <queue> option) 🔂` : `Something went wrong... try again ? ❌`);

            } else if (type === 'false') {
                if (queue.repeatMode === 1) return interaction.editReply(`You must first disable the current music in the loop mode ... try again ? ❌`, { ephemeral: true });

                const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

                return interaction.editReply(success ? `Repeat mode **${queue.repeatMode === 0 ? 'disabled' : 'enabled'}** the whole queue will be repeated endlessly 🔁` : `Something went wrong ... try again ? ❌`);
            }

        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`, { ephemeral: true });
        };
    };
};