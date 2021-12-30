const Command = require('../../structures/Command');
const { MessageEmbed, MessageButton } = require('discord.js');
module.exports = class stop extends Command {
    constructor(...args) {
        super(...args, {
            name: 'stop',
            description: 'Stop Music',
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
            queue.destroy();
            let row = [];
            row[0] = new MessageButton().setLabel('Github Repository').setStyle('LINK').setURL('https://github.com/bears/Kaguya');

            let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setAuthor({
                    name: 'Kaguya Bot',
                    iconURL: 'http://cdn.mai.gg/bots/music/play.png',
                    url: 'https://mai.gg/'
                })
                .setDescription(`Stopped music`)
                .setFooter(`Thank You For Using Kaguya`);

            await interaction.editReply({
                embeds: [embed],
                components: [{
                    type: 1,
                    components: [row[0]]
                }]

            });

        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`, { ephemeral: true });
        };
    };
};