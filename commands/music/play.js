require('dotenv').config();
const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { QueryType } = require("discord-player");
const wait = require('util').promisify(setTimeout);

module.exports = class play extends Command {
    constructor(...args) {
        super(...args, {
            name: 'play',
            description: 'Play Music',
            category: 'Music',
            usage: '[song Name]',
            accessableby: 'Everyone',
            slashCommand: true,
            commandOptions: [{
                name: 'query',
                type: 'STRING',
                description: 'Play a Song',
                required: true
            }, ]
        });
    };

    async interactionRun(interaction) {
        try {
            let embed = new MessageEmbed()
                .setDescription(`Searching Your Song...`);

            await interaction.reply({
                embeds: [embed]
            });
            const player = this.client.player;
            const query = interaction.options.get("query").value;
            const searchResult = await player
                .search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                .catch(() => {});
            if (!searchResult || !searchResult.tracks.length) return interaction.editReply({
                content: "No results were found!"
            });

            const queue = await player.createQueue(interaction.guild, {
                metadata: interaction,
                leaveOnEnd: true,
                leaveOnStopx: true,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 100000,
            });

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                player.deleteQueue(interaction.guildId);
                return void interaction.followUp({
                    content: "Could not join your voice channel!"
                });
            }

            searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
            if (!queue.playing) await queue.play();
            embed
                .setDescription(`Found ${queue.current.title}`)
                .setColor('#0099ff')
                .setFooter(`Made with <3 by Bear#3437`)
                .setThumbnail(queue.current.thumbnail);

            return interaction.editReply({
                embeds: [embed]
            }).then(async (msg) => {
                await wait(3000);
                msg.delete();
            });

        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`, { ephemeral: true });
        };
    };
};