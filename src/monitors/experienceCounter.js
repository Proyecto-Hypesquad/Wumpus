const { Monitor } = require('klasa');
const { Canvas } = require('canvas-constructor');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, { ignoreOthers: false });
		this.cooldowns = new Set();
		this.template = null;
	}

	async run(message) {
		if (!message.guild || this.cooldown(message) || !message.author.settings.class) return;

		const previousLevel = message.author.settings.level;
		const experience = message.author.settings.experience + Math.round((Math.random() * 4) + 4);
		const level = Math.floor(0.2 * Math.sqrt(experience));
		await message.author.settings.update([['experience', experience], ['level', level]]);

		if ((level !== previousLevel))
			this.generate(message.author).then(attachment => message.channel.sendFile(attachment, 'levelup.png', message.author.toString()));
	}

	cooldown(message) {
		if (this.cooldowns.has(message.author.id)) return true;
		this.cooldowns.add(message.author.id);
		setTimeout(() => this.cooldowns.delete(message.author.id), 60000);
		return false;
	}

	generate(user) {
		return new Canvas(225, 192)
			.addImage(this.template, 0, 0, 225, 192)

			// Text
			.setTextAlign('center')
			.setShadowColor('#FFFFFF')
			.setShadowOffsetX(1)
			.setTextFont('19px whitney-blacksc')
			.addText('¡HAS SUBIDO AL', 112, 31)
			.setTextFont('19px whitney-medium')
			.setTextAlign('right')
			.addText(`NIVEL ${user.settings.level}`, 144, 53)
			.setTextAlign('left')
			.setTextFont('19px whitney-blacksc')
			.addText('!', 146, 53)
			.toBufferAsync();
	}

	async init() {
		const { readFile } = require('fs-nextra');
		const { join } = require('path');

		const ASSETS = join(__dirname, '..', '..', 'assets');
		this.template = await readFile(join(ASSETS, 'images', 'levelup.png'));
	}

};
