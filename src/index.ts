import { KlasaClient, KlasaClientOptions } from 'klasa';
import { Canvas } from 'canvas-constructor';
import { join } from 'path';
import { config, token } from '../config';

Canvas
	.registerFont(join(__dirname, '..', '..', 'assets', 'fonts', 'unisans-heavy.otf'), { family: 'unisans-heavy' })
	.registerFont(join(__dirname, '..', '..', 'assets', 'fonts', 'whitney-blacksc.otf'), { family: 'whitney-blacksc' })
	.registerFont(join(__dirname, '..', '..', 'assets', 'fonts', 'whitney-bold.otf'), { family: 'whitney-bold' })
	.registerFont(join(__dirname, '..', '..', 'assets', 'fonts', 'whitney-booksc.otf'), { family: 'whitney-booksc' })
	.registerFont(join(__dirname, '..', '..', 'assets', 'fonts', 'whitney-medium.otf'), { family: 'whitney-medium' });

export class IndexKlasaClient extends KlasaClient {

	public constructor(options: KlasaClientOptions) {
		super(options);
	}

}

KlasaClient.defaultUserSchema.add('class', 'string', { configurable: false })
	.add('coins', 'Integer', { 'default': 0, 'configurable': false })
	.add('victories', 'Integer', { 'configurable': false, 'default': 0 })
	.add('defeats', 'Integer', { 'configurable': false, 'default': 0 })
	.add('reputation', 'Integer', { 'configurable': false, 'default': 0 })
	.add('experience', 'Integer', { 'configurable': false, 'default': 0 })
	.add('level', 'Integer', { 'configurable': false, 'default': 0 })
	.add('clan', 'String', { configurable: false });

const client = new IndexKlasaClient(config);
client.login(token)
	.catch(error => { client.console.error(error); });
