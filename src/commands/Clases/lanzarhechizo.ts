import { WumpusCommand } from '../../utils/WumpusCommand';
import { CommandStore, KlasaMessage, KlasaUser } from 'klasa';
import { IndexKlasaClient } from '@root/src';
import { Hechizos } from '@root/src/utils/Constants';

export default class extends WumpusCommand {

	public client: IndexKlasaClient;

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			cooldown: 5,
			description: language => language.get('COMMAND_HECHIZOS_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_HECHIZOS_EXTENDED'),
			usage: '<hechizo:string> [usuario:user] ',
			usageDelim: ' '
		});
		this.client = store.client as IndexKlasaClient;
	}

	public async run(message: KlasaMessage, [hechizo, usuario]: [string, KlasaUser]) {
		if (!message.author.settings.get('class') || message.author.settings.get('class') !== 'mago') throw message.language.get('COMMAND_CLASE_CHOSEN');

		const entries = await this.client.queries.fetchHechizosFromUser(message.author.id) as Hechizos[];

		for (const entrytmp of entries) {
			for (const entry of entrytmp.array) {
				if (entry.name === hechizo && usuario) {
					const tempBool = (Math.random() * 100) < entry.mejora;
					entry.mejora += Math.random() * (0.5 - 0.1);
					await this.client.queries.updateHechizo(message.author.id, entry.id, entry);
					if (tempBool) {
						await message.delete();
						return message.sendMessage(`> <:varita:482166616633901066> ${message.member?.nickname ? message.member?.nickname : message.member?.user.username} le lanzó ${hechizo} a ${usuario.username}`);
					}
					await message.delete();
					return message.sendMessage(`> <:denegado:666004380935389194> ${message.member?.nickname ? message.member?.nickname : message.member?.user.username}  Ha fallado al lanzar el hechizo`);
				} else if (entry.name === hechizo) {
					await message.delete();
					return message.sendMessage(`> ${message.member?.nickname ? message.member?.nickname : message.member?.user.username} lanzó un hechizo al aire, bien tiene un retraso bien gordo o es un hechizo cosmético.`);
				}
			}
		}

		await message.delete();
		return message.sendMessage(`Todavía no posees ese hechizo.`);
	}

}
