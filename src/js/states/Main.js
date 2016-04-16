import { Camera, State, Text, Keyboard, Sprite, Group} from 'phaser';

import { totalSections } from '../config';

const SHAPE_CROSS = Symbol('+');
const SHAPE_CIRCLE = Symbol('o');

class Boat extends Text {
    constructor(...args) {
        super(...args);

        this.speed = 0;
        this.shape = SHAPE_CROSS;
    }

    update() {
        super.update();

        if (this.shape === SHAPE_CROSS) {
            this.setText('B\n+\nB');
        } else if (this.shape === SHAPE_CIRCLE) {
            this.setText('B\no\nB');
        }
    }
}

export default class extends State {
    create() {
        const sectionList = this._generateSectionList(4);
        this._loadSectionList(sectionList);

        this.stage.backgroundColor = '#ef3d47';

        for (var i = 0; i < this.game.world.height; i += 100)
        {
            this.game.add.text(1, i, i);
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

        if (this.cursors.up.isDown && !this.debounceUp) {
            console.log('ACCELERATE');
            this.boat.speed += 1;
            this.debounceUp = true;
        } else if (this.cursors.up.isUp && this.debounceUp) {
            this.debounceUp = false;
        }
        // console.log(this.boat.x);
        // console.log(this.boat.y);
        if (this.boat.y > 10) {
            this.boat.y -= this.boat.speed;
        // } else {
        //     console.log("arrived at top");
        }
    }

    render() {
        this.game.debug.text('space bar to shift shape', 32, 32);
    }
}
