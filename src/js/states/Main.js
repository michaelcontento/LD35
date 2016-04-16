import { State } from 'phaser';

export default class extends State {
    create() {
        const map = this.game.add.tilemap('game');
        map.addTilesetImage('roguelikeSheet_transparent', 'roguelikeSheet_transparent');

        const block = map.createLayer('block-01');
        block.fixedToCamera = false;

        const layer = map.createLayer('start');
        layer.y = 303;
        layer.fixedToCamera = false;
    }
}
