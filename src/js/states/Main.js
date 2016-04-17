import { Camera, State, Text, Keyboard, Sprite, Group, Point, Physics} from 'phaser';

const SHAPE_CROSS = Symbol.for('+');
const SHAPE_CIRCLE = Symbol.for('o');

const SHAPE_MAP = {
    [SHAPE_CROSS]: 'cross',
    [SHAPE_CIRCLE]: 'circle',
}

const COLOUR_WATER = '#63D1F4';
const COLOUR_WON = '#4CBB17';
const COLOUR_LOST = '#992D2D';

class Boat extends Sprite {
    constructor(...args) {
        super(...args);

        this.scale.setTo(0.5);
        this.anchor.setTo(0.5);

        this.shape = SHAPE_CROSS;
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

class Attractor extends Sprite {
    constructor(shape, game, x, y, key, ...args) {
        super(game, x, y, SHAPE_MAP[shape], ...args);

        this.scale.setTo(0.33);
        this.anchor.setTo(0.5);

        this.shape = shape;
        this.strength = 100;

        this.game.physics.enable(this, Physics.ARCADE);
        this.body.immovable = true;
    }
}

class Obstacle extends Sprite {
    constructor(...args) {
        super(...args);

        this.scale.setTo(0.5);
        this.anchor.setTo(0.5);

        this.game.physics.enable(this, Physics.ARCADE);
        this.body.immovable = true;
    }
}

export default class extends State {
    create() {
        this.game.physics.startSystem(Physics.ARCADE);
        this.game.time.advancedTiming = true;

        this.stage.backgroundColor = COLOUR_WATER;

        this._addDistanceMarkers(this.game);

        let start_x = this.game.world.centerX;
        let start_y = (this.game.world.height / 10) * 9;

        this.boat = this.game.add.existing(
            new Boat(this.game, start_x, start_y, 'boat')
        );

        this.game.camera.follow(this.boat, Camera.FOLLOW_LOCKON);

        this.attractors = [
            this.game.add.existing(
                new Attractor(SHAPE_CROSS, this.game, this.game.world.width * 0.1, 450)
            ),
            this.game.add.existing(
                new Attractor(SHAPE_CIRCLE, this.game, this.game.world.width * 0.9, 250)
            ),
        ]
        this.obstacles = [
            this.game.add.existing(
                new Obstacle(this.game, this.game.world.centerX, 150, 'volcano')
            ),
            this.game.add.existing(
                new Obstacle(this.game, this.game.world.centerX / 4, 150, 'volcano')
            ),
        ]

        const helpText = this.game.add.text(
            this.game.world.centerX, this.game.world.height - 33,
            'the shapes attract you!\ntap to shift active shape',
            {align: 'center', fill: 'white', fontSize: 18},
        );
        helpText.anchor.setTo(0.5);

        this.game.input.onTap.add(
            this._toggleShape,
            this
        );

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

    _closestAttractor(boat, attractors) {
        if (attractors.length == 0 ) {
            return null;
        }

        const relevant = attractors.filter(
            (attractor) => attractor.y < boat.y
        ).filter(
            (attractor) => attractor.shape === boat.shape
        );
        if (relevant.length == 0) {
            return null;
        } else if (relevant.length == 1) {
            return relevant[0];
        }

        const sorted = attractors.map(
            (attractor) => (
                { distance: boat.body.center.distance(attractor), attractor }
            )
        ).sort(
            ({distance: distA}, {distance: distB}) => distA - distB
        ).map(
            ({attractor}) => attractor
        );

        return sorted[0];
    }

    _restart(event) {
        this.game.paused = false;
        this.state.start('Main');
    }

    _collisionHandler () {
        console.log('_collisionHandler');
        this._GameOverMessage(COLOUR_LOST, 'DESTROYED BY IMPACT :(');
    }

    _winHandler() {
        console.log('_winHandler');
        this._GameOverMessage(COLOUR_WON, 'YOU ARE A WINNER :)');
    }

    _GameOverMessage(backgroundColor, message) {
        this.game.paused = true;
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

        this.game.input.onTap.addOnce(this._restart, this);
    }

    _toggleShape() {
        if (this.boat.shape === SHAPE_CROSS) {
            this.boat.shape = SHAPE_CIRCLE;
        } else {
            this.boat.shape = SHAPE_CROSS;
        }
    }

    update() {
        // TODO merge lists instead of calling twice...
        this.game.physics.arcade.collide(
            this.boat,
            this.attractors,
            this._collisionHandler,
            null,
            this
        );
        this.game.physics.arcade.collide(
            this.boat,
            this.obstacles,
            this._collisionHandler,
            null,
            this
        );

        const closestAttractor = this._closestAttractor(this.boat, this.attractors);

        // TODO use/fix rotation
        if (closestAttractor) {
            console.log(closestAttractor.shape);
            // this.boat.rotation =
            this.game.physics.arcade.moveToXY(
                this.boat,
                closestAttractor.x,
                closestAttractor.y,
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
            this._winHandler();
        }
    }

    render() {
        this.game.debug.text(`${this.game.time.fps}fps`, this.game.width - 50, 32);
    }
}
