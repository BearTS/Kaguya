const Event = require('../../structures/Event');

module.exports = class Ready extends Event {
	constructor(...args) {
		super(...args, {
			once: true
		});
	};

	async run() {
		try {
			let slashCommands = this.client.commands.filter(command => command.slashCommand);
			let data = [];

			for (const [key, value] of slashCommands) {
				data.push({
					name: key,
					description: value.description,
					options: value.commandOptions
				});
			};
			await this.client.application.commands.set(data);
			console.log(`${this.client.user.username} is ready!`);

		} catch (error) {
			console.error(error);
		};
	};
};