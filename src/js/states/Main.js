import { State } from 'phaser';

export default class extends State {
    create() {
        this.game.add.text(0, 0, 'Hallo Welt');
    }
}
