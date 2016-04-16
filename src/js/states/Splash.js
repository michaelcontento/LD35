import { State } from 'phaser';

export default class extends State {
    preload() {
    }

    create() {
        this.state.start('Main');
    }
}
