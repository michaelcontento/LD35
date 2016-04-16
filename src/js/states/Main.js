import { State } from 'phaser';

import { totalSections } from '../config';

export default class extends State {
    create() {
        const sectionList = this._generateSectionList(4);
        this._loadSectionList(sectionList);
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
}
