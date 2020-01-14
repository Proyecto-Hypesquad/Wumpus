import { WumpusCommand } from '../../utils/WumpusCommand';
import { MessageEmbed, RoleResolvable } from 'discord.js';
import { CommandStore, KlasaMessage } from 'klasa';

export default class extends WumpusCommand {

	public embeds: any;

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			cooldown: 5,
			description: language => language.get('COMMAND_CLASE_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_CLASE_EXTENDED'),
			usage: '<mago|caballero>'
		});
		this.spam = true;
		this.embeds = {
			mago: new MessageEmbed()
				.setColor(0x9b59b6)
				.setDescription('<:varita:482166616633901066> Has elegido la clase **Mago**.'),
			caballero: new MessageEmbed()
				.setColor(0x607d8b)
				.setDescription('<:espada:482168215623958548> Has elegido la clase **Caballero**.')
		};
	}

	public async run(message: KlasaMessage, [type]: [string]) {
		if (message.author.settings.get('class')) throw message.language.get('COMMAND_CLASE_CHOSEN');
		await message.author.settings.update('class', type);
		const role = message.guildSettings.get(`clases.${type}`);
		message.member?.roles.add(role as RoleResolvable, 'Clase actualizada').catch(() => {});
		return message.sendEmbed(this.embeds[type]);
	}

}

