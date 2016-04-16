import { Camera, State, Text, Keyboard, Sprite, Group, Point, Physics} from 'phaser';

const SHAPE_CROSS = Symbol.for('+');
const SHAPE_CIRCLE = Symbol.for('o');

const SHAPE_MAP = {
    [SHAPE_CROSS]: 'cross',
    [SHAPE_CIRCLE]: 'circle',
}

class Boat extends Sprite {
    constructor(...args) {
        super(...args);

        this.scale.setTo(0.5, 0.5);

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

        this.scale.setTo(0.5, 0.5);

        this.shape = shape;
        this.strength = 100;

        this.game.physics.enable(this, Physics.ARCADE);
        this.body.immovable = true;
    }
}

export default class extends State {
    create() {
        this.game.physics.startSystem(Physics.ARCADE);

        this.stage.backgroundColor = '#63D1F4';

        for (var i = 0; i < this.game.world.height; i += 100)
        {
            this.game.add.text(1, i, i, {fill: 'lightgray'});
        }

        let start_x = this.game.world.centerX;
        let start_y = (this.game.world.height / 10) * 9;

        this.boat = this.game.add.existing(
            new Boat(this.game, start_x, start_y, 'boat')
        );
        // this.boat.anchor.x = 0.5;

        this.game.camera.follow(this.boat, Camera.FOLLOW_LOCKON);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spaceBar = this.game.input.keyboard.addKey(Keyboard.SPACEBAR);
        this.debounceUp = false;
        this.debounceSpace = false;

        this.attractors = [
            this.game.add.existing(
                new Attractor(SHAPE_CROSS, this.game, 16, 450)
            ),
            this.game.add.existing(
                new Attractor(SHAPE_CIRCLE, this.game, 333, 250)
            )
        ]
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

    _restart() {
        this.state.start('Main');
    }

    _collisionHandler (obj1, obj2) {
        this.game.stage.backgroundColor = '#992d2d';
        const message = this.game.add.text(
            this.game.world.centerY,
            this.game.world.centerY,
            'DESTROYED BY IMPACT :(',
        );
        message.anchor.x = 1;
        const button = this.game.add.button(
            message.width * -0.5,
            message.height,
            'restart',
            this._restart,
            this
        );
        button.scale.setTo(0.3);
        message.addChild(button);
    }

    _winHandler() {
        this.game.stage.backgroundColor = '#4CBB17';
        const message = this.game.add.text(
            this.game.world.centerY,
            this.game.world.centerY,
            'YOU ARE A WINNER :)',
        );
        message.anchor.x = 1;
        const button = this.game.add.button(
            message.width * -0.5,
            message.height,
            'restart',
            this._restart,
            this
        );
        button.scale.setTo(0.3);
        message.addChild(button);

        this.boat.body.velocity.x = 0;
        this.boat.body.velocity.y = 0;
    }

    update() {
        this.game.physics.arcade.collide(this.boat, this.attractors, this._collisionHandler, null, this)

        if (this.spaceBar.isDown && !this.debounceSpace) {
            console.log('SHIFT');
            if (this.boat.shape === SHAPE_CROSS) {
                this.boat.shape = SHAPE_CIRCLE;
            } else {
                this.boat.shape = SHAPE_CROSS;
            }
            this.debounceSpace = true;
        } else if (this.spaceBar.isUp && this.debounceSpace) {
            this.debounceSpace = false;
        }

        const closestAttractor = this._closestAttractor(this.boat, this.attractors);

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
        this.game.debug.text('space bar to shift shape', 32, 32);
    }
}
