const Command = require("../../structures/Command");
const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs')

module.exports = class Help extends Command {
    constructor(...args) {
        super(...args, {
            name: 'help',
            category: 'Utility',
            description: 'Displays A List Of Commands Available',
            usage: '[name] (optional)',
            accessableby: 'Everyone',
            slashCommand: true,
            commandOptions: [{
                name: 'command',
                type: 'STRING',
                description: 'Command for Details',
                required: false
            }]
        });
    };

    async interactionRun(interaction) {
        try {
            const command = interaction.options.getString('command');

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setAuthor(`${interaction.guild.me.displayName} Help`, interaction.guild.iconURL({
                    dynamic: true
                }))
                .setThumbnail(this.client.user.displayAvatarURL({
                    dynamic: true
                }));

            if (!command) {
                const categories = readdirSync("./commands/");
                embed
                    .setDescription(`**These Are the Available Commands For ${interaction.guild.me.displayName}\n\nFor Help Related To A Particular Command Type -\n\`\\help [command name]\`**`)
                    .setFooter(`${interaction.guild.me.displayName} | Total Commands - ${this.client.commands.size}`, this.client.user.displayAvatarURL({
                        dynamic: true
                    }));

                categories.forEach(category => {
                    const dir = this.client.commands.filter(command => command.category.toLowerCase() === category.toLowerCase());
                    const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
                    try {
                        embed.addField(` ${capitalise} [${dir.size}] - `, dir.map(c => `\`${c.name}\``).join(", "))
                    } catch (error) {
                        console.error(error);
                        return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
                    };
                });
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            } else {
                let cmd = this.client.commands.get(command.toLowerCase());
                if (!cmd) return interaction.reply({
                    embeds: [embed.setTitle("**Invalid Command!**").setDescription(`**Do \`${this.client.prefix}help\` For the List Of the Commands!**`)]
                })

                embed
                    .setDescription(`**The Bot's Prefix Is \`${this.client.prefix}\`**\n
                                ** Name -** ${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1)}\n
                                ** Description -** ${cmd.description || "No Description provided."}\n
                                ** Slash Command -** ${cmd.slashCommand}\n
                                ** Category -** ${cmd.category}\n
                                ** Usage -** ${cmd.usage ? `\`${this.client.prefix}${cmd.name} ${cmd.usage}\`` : `\`${this.client.prefix}${cmd.name}\``}\n
                                ** Accessible by -** ${cmd.accessableby || "everyone"}\n`)
                    .setFooter(interaction.guild.name, interaction.guild.iconURL({
                        dynamic: true
                    }))
                    .setTimestamp();

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            };
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
        };
    };
};