import { Camera, State, Text, Keyboard, Sprite, Group, Point, Physics} from 'phaser';

import { totalSections } from '../config';

const SHAPE_CROSS = Symbol.for('+');
const SHAPE_CIRCLE = Symbol.for('o');

class Boat extends Text {
    constructor(...args) {
        super(...args);

        this.speed = 0;
        this.shape = SHAPE_CROSS;

        this.game.physics.enable(this, Physics.ARCADE);
    }

    update() {
        super.update();
        this.setText(`B\n${Symbol.keyFor(this.shape)}\nB`);
    }
}

class Attractor extends Text {
    constructor(shape, ...args) {
        super(...args);

        this.shape = shape;
        this.setText(Symbol.keyFor(shape));
        this.strength = 100;
    }
}

export default class extends State {
    create() {
        // const sectionList = this._generateSectionList(4);
        // this._loadSectionList(sectionList);

        this.game.physics.startSystem(Physics.ARCADE);

        this.stage.backgroundColor = '#63D1F4';

        for (var i = 0; i < this.game.world.height; i += 100)
        {
            this.game.add.text(1, i, i, {fill: 'lightgray'});
        }

        let start_x = this.game.world.centerX;
        let start_y = (this.game.world.height / 10) * 9;

        this.boat = this.game.add.existing(
            new Boat(this.game, start_x, start_y, 'B')
        );
        this.boat.anchor.x = 0.5;

        this.game.camera.follow(this.boat, Camera.FOLLOW_LOCKON);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spaceBar = this.game.input.keyboard.addKey(Keyboard.SPACEBAR);
        this.debounceUp = false;
        this.debounceSpace = false;

        this.attractors = [
            this.game.add.existing(
                new Attractor(SHAPE_CROSS, this.game, 32, 450, '?')
            ),
            this.game.add.existing(
                new Attractor(SHAPE_CIRCLE, this.game, 368, 250, '?')
            )
        ]
    }

    _generateSectionList(len = 1) {
        const sections = ['start'];
        while (sections.length <= len) {
            const nbr = this.rnd.integerInRange(1, totalSections);
            sections.unshift(`section-${nbr}`);
        }
        return sections;
    }

    _loadSectionList(sectionList) {
        let lastLayerPosY = 0;
        for (const sectionName of sectionList) {
            const map = this.game.add.tilemap(sectionName);
            map.addTilesetImage('roguelikeSheet_transparent', 'roguelikeSheet_transparent');

            const layer = map.createLayer(map.layer.name);
            layer.fixedToCamera = false;
            layer.y = lastLayerPosY;

            lastLayerPosY += map.height * 16 - 1;
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

    update() {
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


        // if (this.cursors.up.isDown && !this.debounceUp) {
        //     console.log('ACCELERATE');
        //     this.boat.speed += 1;
        //     this.debounceUp = true;
        // } else if (this.cursors.up.isUp && this.debounceUp) {
        //     this.debounceUp = false;
        // }

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
            this.boat.body.velocity.x = 0;
            this.boat.body.velocity.y = 0;
        }
    }

    render() {
        this.game.debug.text('space bar to shift shape', 32, 32);
        // this.game.debug.text('cursor up (repeatedly) to accelerate', 32, 64);
    }
}
