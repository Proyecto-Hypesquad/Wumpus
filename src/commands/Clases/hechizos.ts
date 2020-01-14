import { WumpusCommand } from '../../utils/WumpusCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { IndexKlasaClient } from '@root/src';
import { Hechizos } from '@root/src/utils/Constants';

export default class extends WumpusCommand {

	public client: IndexKlasaClient;

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			cooldown: 5,
			description: language => language.get('COMMAND_HECHIZOS_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_HECHIZOS_EXTENDED'),
			usage: ''
		});
		this.client = store.client as IndexKlasaClient;
	}

	public async run(message: KlasaMessage) {
		if (!message.author.settings.get('class') || message.author.settings.get('class') !== 'mago') throw message.language.get('COMMAND_CLASE_CHOSEN');

		const entries = await this.client.queries.fetchHechizosFromUser(message.author.id) as Hechizos[];

		let messageContent = '';
		for (const entrytmp of entries) {
			for (const entry of entrytmp.array) {
				messageContent = `${messageContent}hechizo: ${entry.name} ciclo: ${entry.ciclo}\n`;
			}
		}

		return message.sendMessage(messageContent === '' ? `<@${message.author.id}> Todavía no tienes hechizos.` : messageContent);
	}

}

