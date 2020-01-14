import { CommonQuery, JsonProvider } from './CommonQuery';
import { Client } from 'discord.js';
import { Hechizos, Hechizo } from '../utils/Constants';

const test: Hechizo = {
	id: '1',
	name: 'test_hechizo',
	ciclo: 1,
	mejora: 0
};

export class JsonCommonQuery implements CommonQuery {
	private client: Client;
	private get provider() {
		return this.client.providers.get('json') as JsonProvider;
	}

	public constructor(client: Client) {
		this.client = client;
	}

	public async insertHechizo(userId: string, hechizo: Hechizo) {
		const keys = await this.provider.getKeys('hechizos');
		const filteredKeys = keys.filter(key => key.startsWith(userId));
		if (filteredKeys.length === 0) {
			const tmp: Hechizos = {
				array: [
					hechizo
				]
			};
			return this.provider.create('hechizos', `${userId}`, tmp);
		}

		const data = await this.provider.getAll('hechizos', filteredKeys) as Hechizos[];
		data[0].array.push(hechizo);
		return this.provider.update('hechizos', `${userId}`, data[0]);
	}

	public insertHechizo2(userId: string) {
		return this.insertHechizo(userId, test);
	}

	public async fetchHechizosFromUser(userId: string) {
		const keys = await this.provider.getKeys('hechizos');
		const filteredKeys = keys.filter(key => key.startsWith(userId));
		if (filteredKeys.length === 0) return [];

		return this.provider.getAll('hechizos', filteredKeys) as Promise<Hechizos[]>;
	}

	public async updateHechizo(userId: string, hechizoId: string, hechizo: Hechizo) {
		const keys = await this.provider.getKeys('hechizos');
		const filteredKeys = keys.filter(key => key.startsWith(userId));
		if (filteredKeys.length === 0) {
			const tmp: Hechizos = {
				array: [
					hechizo
				]
			};
			return this.provider.create('hechizos', `${userId}`, tmp);
		}

		const data = await this.provider.getAll('hechizos', filteredKeys) as Hechizos[];
		let i = 0;
		for (const entry of data[0].array) {
			if (entry.id === hechizoId) {
				data[0].array[i] = hechizo;
			}
			i++;
		}
		return this.provider.update('hechizos', `${userId}`, data[0]);
	}

}
