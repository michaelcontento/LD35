import { Sprite, Physics } from 'phaser';

import * as Shapes from './Shapes'

export default class Attractor extends Sprite {
    constructor(shape, game, x, y, key, ...args) {
        super(game, x, y, Shapes.SHAPE_MAP[shape], ...args);

        this.scale.setTo(0.33);
        this.anchor.setTo(0.5);

        this.shape = shape;
        this.strength = 100;

        this.game.physics.enable(this, Physics.ARCADE);
        this.body.immovable = true;
    }
}
