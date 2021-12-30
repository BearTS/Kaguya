module.exports = class Command {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.description = options.description || 'No Description';
		this.category = options.category;
        this.usage = options.usage;
        this.accessableby = options.accessableby || 'Everyone';
		this.slashCommand = options.slashCommand || false;
		this.commandOptions = options.commandOptions || [];
	};

	async run(message, args) {
		throw new Error(`Command ${this.name} doesn't provide a run method!`);
	};

	async interactionRun(interaction) {
		throw new Error(`InteractionCommand ${this.name} doesn't provide a run method!`);
	}
};
