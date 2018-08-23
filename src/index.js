const { KlasaClient } = require('klasa');
const { Canvas } = require('canvas-constructor');
const { join } = require('path');

Canvas
	.registerFont(join(__dirname, '..', 'assets', 'fonts', 'unisans-heavy.otf'), 'unisans-heavy')
	.registerFont(join(__dirname, '..', 'assets', 'fonts', 'whitney-blacksc.otf'), 'whitney-blacksc')
	.registerFont(join(__dirname, '..', 'assets', 'fonts', 'whitney-bold.otf'), 'whitney-bold')
	.registerFont(join(__dirname, '..', 'assets', 'fonts', 'whitney-booksc.otf'), 'whitney-booksc')
	.registerFont(join(__dirname, '..', 'assets', 'fonts', 'whitney-medium.otf'), 'whitney-medium');

KlasaClient.defaultUserSchema
	.add('class', 'string', { configurable: false })
	.add('coins', 'Integer', { configurable: false, default: 0 })
	.add('victories', 'Integer', { configurable: false, default: 0 })
	.add('defeats', 'Integer', { configurable: false, default: 0 })
	.add('reputation', 'Integer', { configurable: false, default: 0 })
	.add('experience', 'Integer', { configurable: false, default: 0 })
	.add('level', 'Integer', { configurable: false, default: 0 })
	.add('clan', 'string', { configurable: false });

new KlasaClient({ prefix: '+', language: 'es-ES', ownerID: '242043489611808769' })
	.login(require('../config').token);
