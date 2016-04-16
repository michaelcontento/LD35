import { State, Tilemap } from 'phaser';

export default class extends State {
    preload() {
        this.load.tilemap('game', 'maps/game.json', null, Tilemap.TILED_JSON);
        this.load.image('roguelikeSheet_transparent', 'images/roguelikeSheet_transparent.png');
    }

    create() {
        this.state.start('Main');
    }
}
