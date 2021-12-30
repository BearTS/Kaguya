const Command = require('../../structures/Command');
const { MessageEmbed, } = require('discord.js');
const Genius = require("genius-lyrics");
module.exports = class lyrics extends Command {
    constructor(...args) {
        super(...args, {
            name: 'lyrics',
            description: 'Show the Lyrics of the Current song',
            category: 'Music',
            usage: '',
            accessableby: 'Everyone',
            slashCommand: true,
            commandOptions: [{
                name: 'song',
                type: 'STRING',
                description: 'Name of Song',
                required: false
            }]
        });
    };

    async interactionRun(interaction) {
        try {
            let queue = this.client.player.getQueue(interaction.guildId);
            if (!queue.playing) return interaction.reply(`No music currently playing ... try again ? ❌`, { ephemeral: true });

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
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
        };
    };
};