import { join } from 'path';

export default (json) => {
    const map = {};
    const recurse = (child, path) => {
        const object = json.objects[child.objectId];
        if (!object) {
            console.error(`[Devi] ERROR: Missing objectId ${child.objectId}`);
            return;
        }

        const name = join(path, object.name);
        map[name] = child.objectId;
        object.children.forEach((child) => recurse(child, name));
    };

    json.children.forEach((child) => recurse(child, '/'));
    return map;
}
