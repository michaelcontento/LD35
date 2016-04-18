import { Camera, State, Text, Physics } from 'phaser';
import DeviLoader from 'devi-phaser';

import findClosestAttractor from '../lib/findClosestAttractor';
import Attractor from '../models/Attractor';
import Boat from '../models/Boat';
import Obstacle from '../models/Obstacle';
import * as Shapes from '../models/Shapes'
import Treasure from '../models/Treasure';
import gameJson from '../../game/game.json';

const COLOUR_WATER = '#63D1F4';
const COLOUR_WON = '#4CBB17';
const COLOUR_LOST = '#992D2D';

export default class extends State {
    create() {
        this.stage.backgroundColor = COLOUR_WATER;
        this.game.physics.startSystem(Physics.ARCADE);
        this.game.time.advancedTiming = true;

        const devi = new DeviLoader(this.game, gameJson);
        devi.setClass('ship', Boat);
        devi.setClass('section-*/shape-*', Attractor);
        devi.setClass('section-*/obstacle-*', Obstacle);
        devi.getRoot();

        this.attractors = devi.get('section-*/shape-*');
        this.obstacles = devi.get('section-*/obstacle-*');

        this.boat = devi.get('ship')[0];
        this.game.camera.follow(this.boat, Camera.FOLLOW_LOCKON);

        // add distance markers
        for (var i = 0; i < this.game.world.height; i += 100) {
            this.game.add.text(1, i, i, {fill: 'lightgray', fontSize: 16});
        }

        const finishLine = this.game.add.group();
        const left = this.game.add.sprite(0, 0, 'finishline');
        const middle = this.game.add.sprite(this.game.world.centerX, 0, 'finishline');
        middle.anchor.x = 0.5;
        const right = this.game.add.sprite(this.game.world.width, 0, 'finishline');
        right.anchor.x = 1;

        finishLine.addMultiple([left, middle, right]);
        finishLine.setAll('scale.x', 0.33);
        finishLine.setAll('scale.y', 0.33);

        // TODO this makes up the "level", refactor out?!
        this.treasures = [
            this.game.add.existing(
                new Treasure(this.game, this.game.world.width * 0.7, 200, 'treasure')
            ),
            this.game.add.existing(
                new Treasure(this.game, this.game.world.centerX, 480, 'treasure')
            ),
        ]

        this.treasureCount = this.game.add.text(
            this.game.width * 0.75, this.game.height * 0.95, `${this.boat.treasure}`
        );
        this.treasureCount.anchor.setTo(0.5);

        const treasureCountSprite = this.game.add.sprite(50, 0, 'treasure');
        treasureCountSprite.scale.setTo(0.33);
        treasureCountSprite.anchor.setTo(0.5);
        this.treasureCount.addChild(treasureCountSprite);

        this.helpText = this.game.add.text(
            this.game.world.width * 0.1, this.game.world.height * 0.92,
            'the shapes attract you!\ntap to shift active shape',
            {align: 'left', fill: 'white', fontSize: 18},
        );

        this.game.input.onTap.add(::this._toggleShape);

        // TODO pause only physics instead?
        this.game.paused = true;
        this.game.input.onTap.addOnce(
            () => this.game.paused = false,
            this
        );
    }

    _addDistanceMarkers(game) {
        for (var i = 0; i < game.world.height; i += 100) {
            game.add.text(1, i, i, {fill: 'lightgray', fontSize: 16});
        }
    }

    _GameOver(backgroundColor, message) {
        // this.game.paused = true;
        this.game.physics.arcade.isPaused = true;

        this.game.stage.backgroundColor = backgroundColor;

        // TODO align text properly
        const _message = this.game.add.text(
            this.game.world.centerY,
            this.game.world.centerY,
            `${message}\n- tap anywhere to restart -`,
            {align: 'center'}
        );
        _message.anchor.x = 1;

        this.game.input.onTap.addOnce(::this.game.state.restart);
    }

    _toggleShape() {
        if (this.boat.shape === Shapes.SHAPE_CROSS) {
            this.boat.shape = Shapes.SHAPE_CIRCLE;
        } else {
            this.boat.shape = Shapes.SHAPE_CROSS;
        }
    }

    update() {
        // handle "harmful" collisions first :(
        const collidesAttr = this.game.physics.arcade.collide(
            this.boat,
            this.attractors
        );
        const collidesObst = this.game.physics.arcade.collide(
            this.boat,
            this.obstacles
        );
        if (collidesAttr || collidesObst) {
            this._GameOver(COLOUR_LOST, 'DESTROYED BY IMPACT :(');
        }

        // ... then benefical ones :)
        this.game.physics.arcade.collide(
            this.boat,
            this.treasures,
            (boat, treasure) => {
                boat.treasure += 1;
                treasure.kill();
                this.treasureCount.setText(this.boat.treasure);
            }
        );

        // inactivate all attractors (re-active the closest one later)
        this.attractors.forEach(
            (attr) => attr.active = false
        );

        const closestAttractor = findClosestAttractor(this.boat, this.attractors);

        // TODO use/fix rotation
        if (closestAttractor) {
            closestAttractor.active = true;
            // this.boat.rotation =
            this.game.physics.arcade.moveToXY(
                this.boat,
                closestAttractor.worldPosition.x,
                closestAttractor.worldPosition.y,
                closestAttractor.strength
            );
        } else if (this.boat.y > 10){
            // this.boat.rotation =
            this.game.physics.arcade.moveToXY(
                this.boat,
                this.boat.x,
                0,
                100
            );
        } else {
            this._GameOver(COLOUR_WON, 'YOU ARE A WINNER :)');
        }
    }

    render() {
        this.game.debug.text(`${this.game.time.fps}fps`, this.game.width - 50, 32);
    }
}
