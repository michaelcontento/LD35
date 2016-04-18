import { Sprite, Physics, Easing } from 'phaser';

import * as Shapes from './Shapes'

export default class Attractor extends Sprite {
    constructor(...args) {
        super(...args);

        this.active = true;
        this.strength = 100;
        this.range = 384

        this.game.physics.enable(this, Physics.ARCADE);
        this.body.immovable = true;
    }

    create() {
        if (this.name === 'shape-1') {
            this.shape = Shapes.SHAPE_CROSS;
        } else {
            this.shape = Shapes.SHAPE_CIRCLE;
        }

        // TODO: This should be handled by devi
        this.indicator = this.game.add.sprite(this.getBounds().centerX, this.height, 'wifi');
        this.indicator.scale.setTo(0.15);
        this.indicator.anchor.x = 0.5;
        this.indicator.alpha = 0.25;
        this.indicator.tween = this.game.add.tween(this.indicator).to(
             { alpha: 1 }, 400, Easing.Linear.None, true, 0, 1000, true
        );
        this.indicator.tween.pause();
        this.addChild(this.indicator);

        console.log(this.x, this.y, this.indicator.x, this.indicator.y);
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
