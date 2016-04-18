import { Sprite, Physics } from 'phaser';

export default class Obstacle extends Sprite {
    constructor(...args) {
        super(...args);

        this.game.physics.enable(this, Physics.ARCADE);
        this.body.immovable = true;
    }
}
