import { MessageEmbed, TextChannel } from 'discord.js';
import { Event, EventStore, KlasaClient } from 'klasa';
import { WSGuildMemberRemove } from '../utils/DiscordAPI';

export default class extends Event {

	public constructor(client: KlasaClient, store: EventStore, file: string[], directory: string) {
		super(client, store, file, directory, { name: 'GUILD_MEMBER_REMOVE', emitter: store.client.ws });
	}

	public async run(data: WSGuildMemberRemove) {
		const guild = this.client.guilds.get(data.guild_id);
		if (!guild || !guild.available) return;

		const channel = guild.channels.find(chan => chan.name === 'entrada-salida');
		if (!channel) return;

		await (channel as TextChannel).send(`<@${data.user.id}>`, new MessageEmbed()
			.setColor(0x7289DA)
			.setDescription([
				`¡Hasta otra!`,
				`¡${data.user.username} ha salido de la **${guild}**!`,
				`Al traspasar la barrera mágica sus roles han desaparecido.`
			].join('\n\n'))
			.setImage('https://cdn.discordapp.com/attachments/480396475981889536/481209963998347277/2018-08-20_22-59-24.gif')
			.setTimestamp());
	}

}

