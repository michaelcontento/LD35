import { State, Tilemap } from 'phaser';

import { totalSections } from '../config';

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
        this.load.image('plus', 'images/plus.png');
        this.load.image('restart', 'images/restart.png');
    }

    create() {
        this.state.start('Main');
    }
}
