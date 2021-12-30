const Command = require('../../structures/Command');
const { MessageEmbed, MessageButton } = require('discord.js');

module.exports = class nowplaying extends Command {
    constructor(...args) {
        super(...args, {
            name: 'nowplaying',
            description: 'Show Now Playing',
            category: 'Music',
            usage: '',
            accessableby: 'Everyone',
            slashCommand: true
        });
    };

    async interactionRun(interaction) {
        try {
            let embed = new MessageEmbed().setDescription(`Checking the Queue...`);
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            const queue = this.client.player.getQueue(interaction.guildId);
            // const progress = queue.createProgressBar(); 
            embed.setDescription(`No Music Playing...`);
            if (!queue || !queue.playing) return interaction.editReply({
                embeds: [embed],
                ephemeral: true
            });

            embed
                .setColor('#0099ff')
                .setTitle(`Now Playing: ${queue.current.title}`)
                .setThumbnail(queue.current.thumbnail)
                //    .editDescription(`\`\`\`${progress}\`\`\``)
                .addFields({
                    name: 'Link',
                    value: `[CLick Me](${queue.current.url})`,
                    inline: true,
                }, {
                    name: 'Requested By',
                    value: `${queue.current.requestedBy}`,
                    inline: true,
                }, {
                    name: 'Queue Length',
                    value: `${queue.tracks.length}`,
                    inline: true
                }, {
                    name: 'Volume',
                    value: `${queue.volume}%`,
                    inline: true
                }, {
                    name: 'Donation',
                    value: `[Click Here](https://paypal.me/JsBearr?country.x=IN&locale.x=en_GB/)`,
                    inline: true
                })
                .setFooter(`Made with <3 by Bear#3437`, queue.metadata.user.avatarURL());

            let row = [];
            row[0] = new MessageButton().setCustomId(`previous_song`).setLabel(`Previous ⏮️`).setStyle(`SECONDARY`);
            row[1] = new MessageButton().setCustomId(`pauseplay_song`).setLabel(queue.connection.paused ? 'Pause ⏯︎' : 'Resume ⏯︎').setStyle(`SECONDARY`);
            row[2] = new MessageButton().setCustomId('stop_player').setStyle('DANGER').setEmoji(`⏹`);
            row[3] = new MessageButton().setCustomId(`skip_song`).setLabel(`Skip ⏭️`).setStyle(`SECONDARY`);
            row[4] = new MessageButton().setCustomId(`shuffle_song`).setLabel(`Shuffle 🔀`).setStyle(`SECONDARY`);
            row[5] = new MessageButton().setCustomId(`repeat_song`).setLabel(`Repeat 🔁`).setStyle(`SECONDARY`);
            row[6] = new MessageButton().setCustomId(`queue_song`).setLabel(`Queue 📑`).setStyle(`SECONDARY`);
            row[7] = new MessageButton().setCustomId(`lyrics_song`).setLabel(`Lyrics 🎤`).setStyle(`SECONDARY`);
            row[8] = new MessageButton().setLabel(`Github Repository`).setURL(`https://github.com/bearts/kaguya`).setStyle(`LINK`);
            return interaction.editReply({
                embeds: [embed],
                components: [{
                        type: 1,
                        components: [row[0], row[1], row[2], row[3], row[4]]
                    },
                    {
                        type: 1,
                        components: [row[5], row[6], row[7], row[8]]
                    }
                ],
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`, { ephemeral: true });
        };
    };
};