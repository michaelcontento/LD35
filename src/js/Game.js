import Phaser from 'phaser';

import BootState from './states/Boot';
import SplashState from './states/Splash';
import MainState from './states/Main';

export default class Game extends Phaser.Game {
    constructor() {
        let width = 400;
        let height = 734;

        super({ width, height, renderer: Phaser.AUTO, parent: 'content', resolution: window.devicePixelRatio });

        this.state.add('Boot', BootState, false);
        this.state.add('Splash', SplashState, false);
        this.state.add('Main', MainState, false);

        this.state.start('Boot');
    }
}
