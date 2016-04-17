import { State, Tilemap, Sprite } from 'phaser';

import { totalSections } from '../config';
import DeviLoader from '../lib/devi-phaser';
import gameJson from '../../game/game.json';

class Example extends Sprite {
    constructor(...args) {
        super(...args);

        this.alpha = 0;
        this.game.add
            .tween(this)
            .to({ alpha: 1 }, 2000, undefined, true);
    }
}

export default class extends State {
    preload() {
        this.load.tilemap('start', 'maps/start.json', null, Tilemap.TILED_JSON);
        this.load.image('roguelikeSheet_transparent', 'images/roguelikeSheet_transparent.png');

        for (let i = 1; i <= totalSections; i++) {
            this.load.tilemap(`section-${i}`, `maps/section-${i}.json`, null, Tilemap.TILED_JSON);
        }

        this.load.image('boat', 'images/boat.png');
        this.load.image('circle', 'images/circle.png');
        this.load.image('cross', 'images/cross.png');
        this.load.image('finishline', 'images/finishline.png');
        this.load.image('mountain', 'images/mountain.png');
        this.load.image('plus', 'images/plus.png');
        this.load.image('poo', 'images/poo.png');
        this.load.image('restart', 'images/restart.png');
        this.load.image('treasure', 'images/treasure.png');
        this.load.image('volcano', 'images/volcano.png');
        this.load.image('wifi', 'images/wifi.png');

        const devi = new DeviLoader(this.game, 'game', gameJson);
        devi.preload();
    }

    create() {
        const devi = new DeviLoader(this.game, 'game', gameJson);
        devi.setClass('ship', Example);
        devi.getRoot();
        // this.state.start('Main');
    }
}
