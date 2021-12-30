require('dotenv').config();
const { Client, Collection } = require('discord.js');
const Util = require('./Util');
const { playerEvents } = require("./Player.js")
const { Player } = require("discord-player");

module.exports = class KaguyaClient extends Client {
    constructor() {
        super({
            partials: ['MESSAGE', 'REACTION'],
            presence: {
                status: 'online',
                activities: [{
                    name: 'Tamako Tech',
                    type: 'WATCHING'
                }]
            },
            intents: [
                'GUILDS',
                'GUILD_MEMBERS',
                'GUILD_MESSAGES',
                'GUILD_VOICE_STATES'
            ]
        });

        this.player = new Player(this);
        playerEvents(this.player);
        this.commands = new Collection();
        this.events = new Collection();
        this.utils = new Util(this);
        this.token = process.env.TOKEN;
        this.prefix = process.env.PREFIX;


    };

    async start(token = this.token) {
        this.utils.loadCommands();
        this.utils.loadEvents();
        super.login(token);
    };
};