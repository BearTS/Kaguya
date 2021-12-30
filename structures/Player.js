const { MessageButton, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const wait = require('util').promisify(setTimeout);

module.exports.playerEvents = (player) => {

    player.on("error", (queue, error) => {
        console.log(`(${queue.guild.name}) error: ${error.message}`);
    });
    player.on("connectionError", (queue, error) => {
        console.log(`(${queue.guild.name}) connectionError: ${error.message}`);
    });

    player.on("trackEnd", (queue, track) => {
        return null;

    });
    player.on("trackStart", async (queue, track) => {

        if (queue.pmessage) {
            queue.pmessage.delete().catch(error => {});
        }
        const progress = queue.createProgressBar();
        let embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Now Playing: ${track.title}`)
            .setThumbnail(track.thumbnail)
            .setDescription(`\`\`\`${progress}\`\`\``)
            .addFields({
                name: 'Link',
                value: `[CLick Me](${track.url})`,
                inline: true,
            }, {
                name: 'Requested By',
                value: `${track.requestedBy}`,
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
            .setFooter(`Made with <3 by Bear#3437`, track.requestedBy.avatarURL());

        let row = []
        row[0] = new MessageButton().setCustomId(`previous_song`).setLabel(`Previous ⏮️`).setStyle(`SECONDARY`);
        row[1] = new MessageButton().setCustomId(`pauseplay_song`).setLabel('Pause ⏯︎').setStyle(`SECONDARY`);
        row[2] = new MessageButton().setCustomId('stop_player').setStyle('DANGER').setEmoji(`⏹`);
        row[3] = new MessageButton().setCustomId(`skip_song`).setLabel(`Skip ⏭️`).setStyle(`SECONDARY`);
        row[4] = new MessageButton().setCustomId(`shuffle_song`).setLabel(`Shuffle 🔀`).setStyle(`SECONDARY`);
        row[5] = new MessageButton().setCustomId(`repeat_song`).setLabel(`Repeat 🔁`).setStyle(`SECONDARY`);
        row[6] = new MessageButton().setCustomId(`queue_song`).setLabel(`Queue 📑`).setStyle(`SECONDARY`);
        row[7] = new MessageButton().setCustomId(`lyrics_song`).setLabel(`Lyrics 🎤`).setStyle(`SECONDARY`);
        row[8] = new MessageButton().setLabel(`Github Repository`).setURL(`https://github.com/bearts/kaguya`).setStyle(`LINK`);


        return queue.metadata.channel.send({
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
        }).then((msg) => {
            queue.pmessage = msg;
        });
    });


    player.on("trackAdd", (queue, track) => {
        let embed = new MessageEmbed().setTitle(`Added to Queue: ${track.title}`).setDescription(`Requested by ${track.requestedBy}`, track.requestedByAvatar);
        return queue.metadata.channel.send({
            embeds: [embed]
        }).then(async (msg) => {
            await wait(5000);
            msg.delete();
        });
    });

    player.on("tracksAdd", (queue, tracks) => {
        return queue.metadata.channel.send({
            embeds: [{
                description: `Queued **${tracks.length}** tracks from [${tracks[0].playlist.title}](${tracks[0].playlist.url})`,
                color: 0x44b868
            }]
        }).then(async (msg) => {
            await wait(5000);
            msg.delete();
        });
    });

    player.on("botDisconnect", (queue) => {
        if (queue.pmessage) {
            queue.pmessage.delete().catch(error => {});
        }
        return queue.metadata.channel.send("❌ | I was manually disconnected from the voice channel, clearing queue!")
    });

    player.on("channelEmpty", (queue) => {
        if (queue.pmessage) {
            queue.pmessage.delete().catch(error => {});
        }
        return queue.metadata.channel.send("❌ | Nobody is in the voice channel, leaving...")
    });

    player.on("queueEnd", (queue) => {
        if (queue.pmessage) {
            queue.pmessage.delete().catch(error => {});
        }
        let row = []
        row[0] = new MessageButton().setLabel(`Github Repository`).setURL(`https://github.com/bearts/kaguya`).setStyle(`LINK`);
        return queue.metadata.channel.send("✅ | Queue finished!",{
            components: [{
                type: 1,
                components: [row[0]]
            }]
        })
    })

};