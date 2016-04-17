export default (json) => {
    json.children.reverse();

    for (const objectId of Object.keys(json.objects)) {
        const object = json.objects[objectId];
        object.children.reverse();
    }
}
