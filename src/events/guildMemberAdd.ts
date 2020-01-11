import { MessageEmbed, TextChannel } from 'discord.js';
import { Event, EventStore, KlasaClient } from 'klasa';
import { WSGuildMemberAdd } from '../utils/DiscordAPI';

export default class extends Event {

	public constructor(client: KlasaClient, store: EventStore, file: string[], directory: string) {
		super(client, store, file, directory, { name: 'GUILD_MEMBER_ADD', emitter: store.client.ws });
	}

	public async run(data: WSGuildMemberAdd) {
		const guild = this.client.guilds.get(data.guild_id);
		if (!guild || !guild.available) return;

		const channel = guild.channels.find(chan => chan.name === 'entrada-salida');
		if (!channel) return;

		await (channel as TextChannel).send(`<@${data.user.id}>`, new MessageEmbed()
			.setColor(0x7289DA)
			.setDescription([
				`¡Bienvenid@!`,
				`Has entrado a la **${guild}**.`,
				`Preséntate en la #salacomún y pide tu rol al Ministerio de la Brillantez.`
			].join('\n\n'))
			.setImage('https://cdn.discordapp.com/attachments/480419711302107136/480788908821577758/2018-08-19_19-22-55.gif')
			.setTimestamp());
	}

}

