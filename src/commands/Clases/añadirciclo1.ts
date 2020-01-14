import { WumpusCommand } from '../../utils/WumpusCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { IndexKlasaClient } from '@root/src';
import { Hechizo } from '../../utils/Constants';

const ciclo1: Hechizo[] = [
	{
		id: '1',
		name: 'test_hechizo',
		ciclo: 1,
		mejora: 0
	},
	{
		id: '2',
		name: 'Armadura reactiva',
		ciclo: 1,
		mejora: 0
	},
	{
		id: '3',
		name: 'Torpeza',
		ciclo: 1,
		mejora: 0
	},
	{
		id: '4',
		name: 'Crear comida',
		ciclo: 1,
		mejora: 0
	},
	{
		id: '5',
		name: 'Debilidad mental',
		ciclo: 1,
		mejora: 0
	},
	{
		id: '6',
		name: 'Curación',
		ciclo: 1,
		mejora: 0
	},
	{
		id: '7',
		name: 'Flecha mágica',
		ciclo: 1,
		mejora: 0
	},
	{
		id: '8',
		name: 'Debilidad',
		ciclo: 1,
		mejora: 0
	}
];

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

		for (const entry of ciclo1) {
			await this.client.queries.insertHechizo(message.author.id, entry);
		}

		return message.sendMessage('Se han añadido los hechizos del ciclo 1 a tu lista');
	}

}

