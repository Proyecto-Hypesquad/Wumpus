import { PermissionResolvable, Permissions } from 'discord.js';
import { Command, CommandOptions, CommandStore, KlasaMessage, KlasaClient, util } from 'klasa';

export abstract class WumpusCommand extends Command {

	public spam: boolean;
	public requiredGuildPermissions: Permissions;

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string, options: WumpusCommandOptions = {}) {
		super(client, store, file, directory, util.mergeDefault({ spam: false, requiredGuildPermissions: 0 }, options));
		this.spam = options.spam!;
		this.requiredGuildPermissions = new Permissions(options.requiredGuildPermissions);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public run(message: KlasaMessage, _params: any[]): any { return message; }

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public inhibit(_message: KlasaMessage): Promise<boolean> | boolean {
		return false;
	}

}

export interface WumpusCommandOptions extends CommandOptions {
	spam?: boolean;
	requiredGuildPermissions?: PermissionResolvable;
}
