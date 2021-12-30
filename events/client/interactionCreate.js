const Event = require('../../structures/Event');
const {MessageEmbed, MessageButton } = require('discord.js');
const fetch = require('node-fetch');
const { QueueRepeatMode } = require('discord-player');
const Genius = require("genius-lyrics");
const wait = require('util').promisify(setTimeout);
module.exports = class interactionCreate extends Event {
    constructor(...args) {
        super(...args)
    };

    async run(interaction) {
        if (interaction.isCommand()) {
            const command = this.client.commands.get(interaction.commandName.toLowerCase());
            if (command) command.interactionRun(interaction);
        };
        if (interaction.isButton()) {
            const queue = this.client.player.getQueue(interaction.guildId);
            const progress = queue.createProgressBar();
            if (queue || queue.playing) {
                let embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Now Playing: ${queue.current.title}`)
                    .setDescription(`\`\`\`${progress}\`\`\``)
                    .setThumbnail(queue.current.thumbnail)
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
                        name: 'Donation',
                        value: `[Click Here](https://paypal.me/JsBearr?country.x=IN&locale.x=en_GB/)`,
                        inline: true
                    })
                    .setFooter(`Requested by ${queue.metadata.user.username}`, queue.metadata.user.avatarURL());

                let row = []
                row[0] = new MessageButton().setCustomId(`previous_song`).setLabel(`Previous ⏮️`).setStyle(`SECONDARY`);
                row[1] = new MessageButton().setCustomId(`pauseplay_song`).setLabel(queue.connection.paused ? 'Pause ⏯︎' : 'Resume ⏯︎').setStyle(`SECONDARY`);
                row[2] = new MessageButton().setCustomId('stop_player').setStyle('DANGER').setEmoji(`⏹`);
                row[3] = new MessageButton().setCustomId(`skip_song`).setLabel(`Skip ⏭️`).setStyle(`SECONDARY`);
                row[4] = new MessageButton().setCustomId(`shuffle_song`).setLabel(`Shuffle 🔀`).setStyle(`SECONDARY`);
                row[5] = new MessageButton().setCustomId(`repeat_song`).setLabel(`Repeat 🔁`).setStyle(`SECONDARY`);
                row[6] = new MessageButton().setCustomId(`queue_song`).setLabel(`Queue 📑`).setStyle(`SECONDARY`);
                row[7] = new MessageButton().setCustomId(`lyrics_song`).setLabel(`Lyrics 🎤`).setStyle(`SECONDARY`);
                row[8] = new MessageButton().setLabel(`Github Repository`).setURL(`https://github.com/bearts/kaguys`).setStyle(`LINK`);

                switch (interaction.customId) {
                    case 'previous_song': {
                        if (!queue.previousTracks[1]) return interaction.reply({
                            content: `There was no music played before ... try again ? ❌`,
                            ephemeral: true
                        });
                        queue.back();
                        interaction.reply({
                            embeds: [{
                                title: `Player is now playing previous track`,
                            }],
                            components: [{
                                    type: 1,
                                    components: [row[0], row[1], row[2], row[3], row[4]]
                                },
                                {
                                    type: 1,
                                    components: [row[5], row[6], row[7], row[8]]
                                }
                            ]
                        })
                        await wait(4000);
                        interaction.deleteReply();
                    }

                    case 'pauseplay_song': {
                        queue.connection.paused ? queue.setPaused(false) : queue.setPaused(true)

                        let progress = queue.createProgressBar();

                        embed.setDescription(`\`\`\`${progress}\`\`\``)

                        return interaction.update({
                            embeds: [embed],
                            components: [{
                                    type: 1,
                                    components: [row[0], row[1], row[2], row[3], row[4]]
                                },
                                {
                                    type: 1,
                                    components: [row[5], row[6], row[7], row[8]]
                                }
                            ]
                        });
                    }

                    case 'stop_player': {
                        queue.destroy();
                        let emb = new MessageEmbed().setTitle('Music stopped 🔕').setColor('#ff0000').setFooter(`Requested by ${queue.metadata.user.username} | Made by Bear#3437`, queue.metadata.user.avatarURL());
                        return interaction.reply({
                            embeds: [emb],
                            components: [{
                                type: 1,
                                components: [row[8]]
                            }],
                            ephemeral: true
                        });
                    }

                    case 'skip_song': {
                        queue.skip();
                        return interaction.reply({
                            embeds: [{
                                title: `Skipped ${queue.current.title}`,
                            }],
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
                    }

                    case 'shuffle_song': {
                        queue.shuffle();
                        embed.setAuthor(`Queue Shuffled 🔀`);
                        return interaction.update({
                            embeds: [embed],
                            components: [{
                                    type: 1,
                                    components: [row[0], row[1], row[2], row[3], row[4]]
                                },
                                {
                                    type: 1,
                                    components: [row[5], row[6], row[7], row[8]]
                                }
                            ]
                        });
                    }
                    case 'repeat_song': {
                        queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);
                        embed.setAuthor(`Repeat Mode is now ${queue.repeatMode === 0 ? 'OFF' : 'ON'}`);
                        return interaction.update({
                            embeds: [embed],
                            components: [{
                                    type: 1,
                                    components: [row[0], row[1], row[2], row[3], row[4]]
                                },
                                {
                                    type: 1,
                                    components: [row[5], row[6], row[7], row[8]]
                                }
                            ]
                        });
                    }
                    case 'queue_song': {
                        let emb = new MessageEmbed()
                        let tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy.username})`);
                        let songs = queue.tracks.length;
                        let nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)...` : `In the playlist **${songs}** song(s)...`;
                        emb
                            .setFooter('Made with <3 by Bear#3437')
                            .setDescription(`Current ${queue.current.title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);

                        return interaction.reply({
                            embeds: [emb],
                            ephemeral: true
                        });

                    }
                    case 'lyrics_song': {
                        await interaction.reply({
                            content: `Searching lyrics for ${queue.current.title}...`,
                            ephemeral: true
                        });
                        let genius = new Genius.Client(process.env.GENIUS_TOKEN); // Scrapes if no key is provided
                        let searches = await genius.songs.search(queue.current.title);
                        let firstSong = searches[0];
                        let lyrics = await firstSong.lyrics();
                        let emb = new MessageEmbed()
                            .setThumbnail(firstSong.thumbnail)
                            .setURL(firstSong.url)
                            .setTitle(firstSong.fullTitle)
                            .setDescription(lyrics.length > 4095 ? lyrics.substring(0, 4092) + "..." : lyrics)
                            .setFooter('Made with <3 by Bear#3437')
                            .setColor(0xe620a4);
                        return interaction.editReply({
                            embeds: [emb],
                            ephemeral: true
                        });
                    }

                }
            }
        }
    };
};