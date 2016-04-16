import { State } from 'phaser';

export default class extends State {
    create() {
        this.stage.backgroundColor = '#3171CA';
        this.game.add.text(0, 0, 'Hallo Welt');
    }
}
