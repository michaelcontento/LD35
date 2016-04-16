import { Camera, State } from 'phaser';

import { totalSections } from '../config';

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

        this.boat = this.game.add.text(start_x, start_y , 'B');
        this.boat.anchor.x = 0.5;
        this.boat.speed = 1;

        this.game.camera.follow(this.boat, Camera.FOLLOW_LOCKON);

        this.cursors = this.game.input.keyboard.createCursorKeys();
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
        if (this.cursors.up.isDown && !this.debounceUp) {
            this.boat.speed += 1;
            console.log('blub');
            this.debounceUp = true;
        } else if (this.cursors.up.isUp) {
            this.debounceUp = false;
        }
        if (this.boat.y > 10) {
            console.log(this.boat.x);
            console.log(this.boat.y);
            this.boat.y -= this.boat.speed;
        } else {
            // console.log("arrived at top");
        }
    }
}
