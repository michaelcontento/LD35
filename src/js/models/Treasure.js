import { Sprite, Physics } from 'phaser';

export default class Treasure extends Sprite {
    constructor(...args) {
        super(...args);

        this.game.physics.enable(this, Physics.ARCADE);
        this.body.immovable = true;
    }
}
