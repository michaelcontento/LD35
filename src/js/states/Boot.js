import { State, ScaleManager } from 'phaser';

export default class extends State {
    create() {
        this.game.scale.scaleMode = ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        this.state.start('Splash');
    }

    preload() {
        this.load.json('game', 'game/game.json');
    }
}
