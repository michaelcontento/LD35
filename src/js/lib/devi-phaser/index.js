import { join } from 'path';

import adjustChildrenOrder from './lib/adjustChildrenOrder';
import createPathToObjectIdTable from './lib/createPathToObjectIdTable';
import ucfirst from './lib/ucfirst';

export default class {
    _root = null;
    _objectIdToInstance = {};
    _classMap = {};

    constructor(game, jsonName, json) {
        this._game = game;
        this._jsonName = jsonName;

        this._json = json ? json : game.cache.getJSON(jsonName);
        this._json = JSON.parse(JSON.stringify(this._json));

        // TODO: Delay the following code as long as possible
        adjustChildrenOrder(this._json);
        this._pathToObjectId = createPathToObjectIdTable(this._json);
    }

    preload(path) {
        path = path || this._jsonName;

        for (const objectId of Object.keys(this._json.objects)) {
            const object = this._json.objects[objectId];

            const func = '__preload' + ucfirst(object.type);
            if (this[func]) {
                this[func](path, object);
            }
        }
    }

    setClass(pathOrName, klass) {
        this._getObjectIdsForPath(pathOrName)
            .forEach((id) => this._classMap[id] = klass);
    }

    getRoot() {
        if (!this._root) {
            this._root = this._game.add.group();
            for (const child of this._json.children) {
                this._createChildren(this._root, child);
            }
        }

        return this._root;
    }

    get(pathOrName) {
        return this._getObjectIdsForPath(pathOrName)
            .map((id) => this._objectIdToInstance[id]);
    }

    _getObjectIdsForPath(pathOrName) {
        // Ensure that we're either a absolute (/..) or a wildcard (*..)
        // request. We convert requests like 'ship' to '*ship', as it makes
        // the users life easier. If he gets to much, he can limit it with
        // a more preceive pre- or postfix (e.g. 'gamescene/ship').
        const isAbsolute = /^(\*|\/)/.test(pathOrName);
        pathOrName = isAbsolute ? pathOrName : `*/${pathOrName}`;

        // Now we just need to convert the given request to a regex ...
        const checkRegex = pathOrName.replace(/\*/g, '.*');
        const regex = new RegExp(`^${checkRegex}$`);

        const result = [];
        for (const name of Object.keys(this._pathToObjectId)) {
            // ... and it's matching time!
            if (name.match(regex)) {
                const objectId = this._pathToObjectId[name];
                result.push(objectId);
            }
        }

        return result;
    }

    _createChildren(parent, children) {
        const objectId = children.objectId;
        const object = this._json.objects[objectId];
        if (!object) {
            console.error(`[Devi] ERROR: Missing objectId ${objectId}`);
            return;
        }

        const result = this._createObject(parent, object);
        if (!result) {
            return;
        }

        result.x = parseInt(children.position.x, 10);
        result.y = parseInt(children.position.y, 10);
        result.visible = children.visible;

        return result;
    }

    _createObject(parent, object) {
        const func = '__create' + ucfirst(object.type);
        if (!this[func]) {
            return null;
        }

        const customClass = this._classMap[object.id];
        const result = this[func](object, parent, customClass);
        this._objectIdToInstance[object.id] = result;

        for (const child of object.children) {
            this._createChildren(result, child);
        }

        return result;
    }

    __preloadSprite(path, object) {
        this._game.load.image(object.filename, join(path, object.filename));
    }

    __createSprite(object, parent, customClass) {
        let oldType;
        if (customClass) {
            oldType = this._game.world.classType;
            this._game.world.classType = customClass;
        }

        const result = this._game.add.sprite(0, 0, object.filename, parent);
        parent.addChild(result);

        if (oldType) {
            this._game.world.classType = oldType;
        }
        return result;
    }

    __createObject(object, parent, customClass) {
        return this._game.add.group(parent);
    }
}
