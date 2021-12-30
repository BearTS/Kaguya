const Command = require('../../structures/Command');
const { MessageEmbed, MessageButton } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class queue extends Command {
    constructor(...args) {
        super(...args, {
            name: 'queue',
            description: 'Show current music queue',
            category: 'Music',
            usage: '',
            accessableby: 'Everyone',
            slashCommand: true
        });
    };

    async interactionRun(interaction) {
        try {
            await interaction.deferReply();
            const player = this.client.player;
            const queue = player.getQueue(interaction.guildId);
            if (!queue || !queue.playing) return interaction.editReply(`No music currently playing ... try again ? ❌`, { ephemeral: true });
            if (!queue.tracks[0]) return interaction.editReply(`No music in the queue after the current one ... try again ? ❌`, { ephemeral: true });
            const res = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURI(queue.current.title)}`).then(res => res.json()).catch(err => err);
            const emote = ['OFF', '🔁', '🔂'];
            const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy.username})`);
            const title = !res.error ? res.title : queue.current.title;
            const songs = queue.tracks.length;
            const nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)...` : `In the playlist **${songs}** song(s)...`;
            let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setAuthor({
                    name: `Server queue - ${emote[queue.repeatMode]}`,
                    iconURL: 'http://cdn.mai.gg/bots/music/play.png',
                    url: 'https://mai.gg/'
                })
                .setDescription(`Current ${title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`)
                .setFooter(`Thank You For Using Kaguya`);

            const pause = new MessageButton()
                .setCustomId('pause_player')
                .setStyle('SUCCESS')
                .setEmoji('925611625820618752');

            const stop = new MessageButton()
                .setCustomId('stop_player')
                .setStyle('DANGER')
                .setEmoji(`925594941600702504`);

            const link = new MessageButton()
                .setLabel('Youtube Link')
                .setStyle('LINK')
                .setURL(queue.current.url);

            const vote = new MessageButton()
                .setLabel('Github Repository')
                .setStyle('LINK')
                .setURL('https://github.com/bearts/Kaguya');

            const row = [pause, stop, link, vote];


            return interaction.editReply({
                embeds: [embed],
                components: [{
                    type: 1,
                    components: [row[0]]
                }],
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
        };
    };
};