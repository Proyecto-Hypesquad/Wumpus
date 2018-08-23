const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

	async run(member) {
		const channel = member.guild.channels.find(chan => chan.name === 'entrada-salida');
		if (!channel) return;

		await channel.send(member.toString(), new MessageEmbed()
			.setColor(0x7289DA)
			.setDescription([
				`¡Bienvenid@!`,
				`Has entrado a la **${member.guild}**.`,
				`Preséntate en la #salacomún y pide tu rol al Ministerio de la Brillantez.`
			].join('\n\n'))
			.setImage('https://cdn.discordapp.com/attachments/480419711302107136/480788908821577758/2018-08-19_19-22-55.gif')
			.setTimestamp()
		);
	}

};
