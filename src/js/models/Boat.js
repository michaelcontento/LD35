import {  Physics, Sprite, Text } from 'phaser';

import * as Shapes from './Shapes'

export default class Boat extends Sprite {
    constructor(...args) {
        super(...args);

        this.treasure = 0;
        this.shape = Shapes.SHAPE_CIRCLE;
        this.game.physics.enable(this, Physics.ARCADE);

        this.text = new Text(
            this.game,
            this.getBounds().centerX,
            this.getBounds().centerY - 25,
            Symbol.keyFor(this.shape),
            { fill: 'white' }
        );
        this.text.anchor.x = 0.5;
        this.addChild(this.text);
    }

    update() {
        super.update();
        this.text.setText(Symbol.keyFor(this.shape));
    }
}
