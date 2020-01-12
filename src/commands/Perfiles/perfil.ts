import { WumpusCommand } from '../../utils/WumpusCommand';
import { CommandStore, KlasaMessage, KlasaUser } from 'klasa';
import { Canvas, BufferOrImage } from 'canvas-constructor';
import fetch from 'node-fetch';
import { readFile } from 'fs-nextra';
import { join } from 'path';

const CLASSES: any = {
	mago: [
		[0, 'MAGO TORPE'],
		[10, 'MAGO PRINCIPIANTE'],
		[20, 'MAGO PROMEDIO'],
		[30, 'MAGO HÁBIL'],
		[40, 'MAGO EXPERTO'],
		[50, 'MAGO LEGENDARIO']
	],
	caballero: [
		[0, 'CABALLERO TORPE'],
		[10, 'CABALLERO PRINCIPIANTE'],
		[20, 'CABALLERO PROMEDIO'],
		[30, 'CABALLERO HÁBIL'],
		[40, 'CABALLERO EXPERTO'],
		[50, 'CABALLERO LEGENDARIO']
	]
};

export default class extends WumpusCommand {

	public template: Buffer;
	public potion: Buffer;
	public clans: any;

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			requiredPermissions: ['ATTACH_FILES'],
			cooldown: 5,
			description: language => language.get('COMMANDS_PERFIL_DESCRIPTION'),
			extendedHelp: language => language.get('COMMANDS_PERFIL_EXTENDED'),
			usage: '[usuario:user]'
		});
		this.template = Buffer.alloc(0);
		this.potion = Buffer.alloc(0);
		this.clans = { 'balance': null, 'brillantez': null, 'bravura': null, 'null': null };
	}

	public generate(user: KlasaUser, image: BufferOrImage) {
		const classname = (user.settings.get('class') as string);
		const coins = (user.settings.get('coins') as number);
		const victories = (user.settings.get('victories') as number);
		const defeats = (user.settings.get('defeats') as number);
		const reputation = (user.settings.get('reputation') as number);
		const experience = (user.settings.get('experience') as number);
		const clan = (user.settings.get('clan') as string);
		const level = (user.settings.get('level') as number);

		const previousLevel = Math.floor((level / 0.2) ** 2);
		const nextLevel = Math.floor(((level + 1) / 0.2) ** 2);
		const progressBar = Math.round(((experience - previousLevel) / (nextLevel - previousLevel)) * 326);

		const canvas = new Canvas(624, 372)
			.addImage(this.template, 0, 0, 624, 372)

			// Under avatar
			.setTextAlign('center')
			.setShadowColor('#FFFFFF')
			.setShadowOffsetX(1)
			.setTextFont('24px whitney-medium')
			.addResponsiveText(user.tag, 112, 187, 200)
			.setTextFont('19px whitney-blacksc')
			.addText(this.findLevel(classname, level), 112, 225)
			.setTextFont('19px whitney-medium')
			.addText(`NIVEL ${level}`, 112, 262)
			.setShadowOffsetX(0)

			// Right deck
			.setTextAlign('left')
			.setTextFont('24px whitney-booksc')
			.addText(`MONEDAS: ${coins}`, 345, 87)
			.addText(`VICTORIAS: ${victories}`, 345, 119)
			.addText(`DERROTAS: ${defeats}`, 345, 150)

			// Progress bar
			.save()
			.createBeveledPath(262, 328, progressBar, 13, 8)
			.setColor('#44b674')
			.fill()
			.restore()

			// Right bottom
			.setTextAlign('center')
			.setTextFont('20px whitney-blacksc')
			.setShadowOffsetX(1)
			.addText(`REP+${reputation}`, 423, 312)
			.setShadowOffsetX(0)
			.setTextFont('20px whitney-booksc')
			.addText(`exp: ${experience}/${nextLevel}`, 423, 339)
			.addImage(this.potion, 246, 300, 53, 55)

			.addImage(image, 60, 59, 103, 103, { radius: 103 / 2, type: 'round', restore: true });

		// Add canvas image
		if (clan) canvas.addImage(this.clans[clan], 237, 21, 375, 26);

		// Render
		return canvas.toBufferAsync();
	}

	public findLevel(classname: string, level: number) {
		if (!classname) return '';
		const assets = CLASSES[classname];
		for (const [lvl, name] of assets) {
			if (level >= lvl) return name;
		}

		return '';
	}

	public async run(message: KlasaMessage, [user]: [KlasaUser]) {
		if (!user) {
			user = message.author;
		}
		const image = await fetch(user.displayAvatarURL({ format: 'png', size: 128 })).then(result => result.buffer());
		await user.settings.sync(false);
		return this.generate(user, image).then(attachment => message.channel.sendFile(attachment, 'profile.png'));
	}

	public async init() {
		const ASSETS = join(__dirname, '..', '..', '..', '..', 'assets');
		[this.template, this.potion, this.clans.balance, this.clans.brillantez, this.clans.bravura] = await Promise.all([
			readFile(join(ASSETS, 'images', 'background-perfil.png')),
			readFile(join(ASSETS, 'images', 'potion.png')),
			readFile(join(ASSETS, 'images', 'balance.png')),
			readFile(join(ASSETS, 'images', 'brillantez.png')),
			readFile(join(ASSETS, 'images', 'bravura.png'))
		]);
	}

}

