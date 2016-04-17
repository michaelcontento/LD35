import { Sprite, Physics, Easing } from 'phaser';

import * as Shapes from './Shapes'

export default class Attractor extends Sprite {
    constructor(shape, game, x, y, key, ...args) {
        super(game, x, y, Shapes.SHAPE_MAP[shape], ...args);

        this.scale.setTo(0.33);
        this.anchor.setTo(0.5);

        this.shape = shape;

        this.active = true;
        this.strength = 100;
        this.range = 384;

        this.indicator = game.add.sprite(this.centerX, this.height, 'wifi');
        this.indicator.scale.setTo(0.15);
        this.indicator.anchor.x = 0.5;
        this.indicator.alpha = 0;
        this.indicator.tween = this.game.add.tween(this.indicator).to(
             { alpha: 1 }, 400, Easing.Linear.None, true, 0, 1000, true
        );
        this.indicator.tween.pause()
        this.addChild(this.indicator);

        this.game.physics.enable(this, Physics.ARCADE);
        this.body.immovable = true;
    }

    update() {
        if (this.active) {
            this.indicator.tween.resume();
            this.indicator.visible = true;
        } else {
            this.indicator.tween.pause();
            this.indicator.visible = false;
        }
    }
}
