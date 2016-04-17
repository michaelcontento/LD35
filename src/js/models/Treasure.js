import { Sprite, Physics } from 'phaser';

export default class Treasure extends Sprite {
    constructor(...args) {
        super(...args);

        this.scale.setTo(0.33);
        this.anchor.setTo(0.5);

        this.game.physics.enable(this, Physics.ARCADE);
        this.body.immovable = true;
    }
}
