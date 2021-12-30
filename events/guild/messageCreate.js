const Event = require('../../structures/Event');

module.exports = class messageCreate extends Event {
	async run(message) {
		try {
			if (message.mentions.users.has(this.client.user.id) && message.content === `<@!${this.client.user.id}>`) return message.channel.send(`Prefix For This Server Is \`${this.client.prefix}\``);

			if (!message.guild || message.author.bot || !message.content.startsWith(this.client.prefix)) return;

			const [cmd, ...args] = message.content.slice(this.client.prefix.length).split(/ +/g);

			const command = this.client.commands.get(cmd.toLowerCase());
			if (command && !command.slashCommand) command.run(message, args);
		} catch (error) {
			console.error(error);
		};
	};
};