const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_CLASE_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_CLASE_EXTENDED'),
			usage: '<mago|caballero>'
		});

		this.embeds = {
			mago: new MessageEmbed()
				.setColor(0x9b59b6)
				.setDescription('<:varita:482166616633901066> Has elegido la clase **Mago**.'),
			caballero: new MessageEmbed()
				.setColor(0x607d8b)
				.setDescription('<:espada:482168215623958548> Has elegido la clase **Caballero**.')
		};
	}

	async run(message, [type]) {
		if (message.author.settings.class) throw message.language.get('COMMAND_CLASE_CHOSEN');
		await message.author.settings.update('class', type);
		return message.sendEmbed(this.embeds[type]);
	}

};
