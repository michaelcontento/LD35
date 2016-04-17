import {  Physics, Sprite, Text } from 'phaser';

import * as Shapes from './Shapes'

export default class Boat extends Sprite {
    constructor(...args) {
        super(...args);

        this.scale.setTo(0.5);
        this.anchor.setTo(0.5);

        this.treasure = 0;
        this.shape = Shapes.SHAPE_CIRCLE;
        this.game.physics.enable(this, Physics.ARCADE);
        this.text = new Text(
            this.game,
            this.body.centerX,
            this.body.centerY,
            Symbol.keyFor(this.shape)
        );
        this.addChild(this.text);
    }

    update() {
        super.update();
        this.text.setText(Symbol.keyFor(this.shape));
    }
}
