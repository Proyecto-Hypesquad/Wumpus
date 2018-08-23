const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

	async run(member) {
		const channel = member.guild.channels.find(chan => chan.name === 'entrada-salida');
		if (!channel) return;

		await channel.send(new MessageEmbed()
			.setColor(0x7289DA)
			.setDescription([
				`¡Hasta otra!`,
				`¡${member.user.username} ha salido de la **${member.guild}**!`,
				`Al traspasar la barrera mágica sus roles han desaparecido.`
			].join('\n\n'))
			.setImage('https://cdn.discordapp.com/attachments/480396475981889536/481209963998347277/2018-08-20_22-59-24.gif')
			.setTimestamp()
		);
	}

};
