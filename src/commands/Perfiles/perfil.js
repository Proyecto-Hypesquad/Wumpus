const { Command } = require('klasa');
const { Canvas } = require('canvas-constructor');
const fetch = require('node-fetch');
const { join } = require('path');

const ASSETS = join(__dirname, '..', '..', '..', 'assets');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text', 'dm', 'group'],
			requiredPermissions: ['ATTACH_FILES'],
			cooldown: 10,
			description: language => language.get('COMMANDS_PERFIL_DESCRIPTION'),
			extendedHelp: language => language.get('COMMANDS_PERFIL_EXTENDED'),
			usage: '[usuario:user]'
		});

		this.template = null;
		this.potion = null;
		this.clans = { balance: null, brillantez: null, bravura: null, null: null };
	}

	async run(message, [user = message.author]) {
		const image = await fetch(user.displayAvatarURL({ format: 'png', size: 128 })).then(result => result.buffer());
		await user.settings.sync(false);
		return this.generate(user, image).then(attachment => message.channel.sendFile(attachment, 'profile.png'));
	}

	generate(user, image) {
		const { coins, victories, defeats, reputation, experience, clan } = user.settings;
		const canvas = new Canvas(624, 372)
			.addImage(this.template, 0, 0, 624, 372)
			.addImage(image, 60, 59, 103, 103, { radius: 103 / 2, type: 'round', restore: true })

			// Under avatar
			.setTextAlign('center')
			.setShadowColor('#FFFFFF')
			.setShadowOffsetX(1)
			.setTextFont('24px whitney-medium')
			.addResponsiveText(user.tag, 112, 187, 200)
			.setTextFont('19px whitney-blacksc')
			.addText('MAGO PRINCIPIANTE', 112, 225)
			.setTextFont('19px whitney-medium')
			.addText('NIVEL 1', 112, 262)
			.setShadowOffsetX(0)

			// Right deck
			.setTextAlign('left')
			.setTextFont('24px whitney-booksc')
			.addText(`MONEDAS: ${coins}`, 345, 87)
			.addText(`VICTORIAS: ${victories}`, 345, 119)
			.addText(`DERROTAS: ${defeats}`, 345, 150)

			// Progress bar
			.save()
			.createBeveledPath(262, 328, 326, 13, 8)
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
			.addText(`exp: ${experience}/1000`, 423, 339)
			.addImage(this.potion, 246, 300, 53, 55);

		// Add canvas image
		if (clan) canvas.addImage(this.clans[clan], 237, 21, 375, 26);

		// Render
		return canvas.toBufferAsync();
	}

	async init() {
		const { readFile } = require('fs-nextra');
		[this.template, this.potion, this.clans.balance, this.clans.brillantez, this.clans.bravura] = await Promise.all([
			readFile(join(ASSETS, 'images', 'background-perfil.png')),
			readFile(join(ASSETS, 'images', 'potion.png')),
			readFile(join(ASSETS, 'images', 'balance.png')),
			readFile(join(ASSETS, 'images', 'brillantez.png')),
			readFile(join(ASSETS, 'images', 'bravura.png'))
		]);
	}

};
