export default (boat, attractors) => {
    if (attractors.length == 0 ) {
        return null;
    }

    const relevant = attractors.map(
        (attractor) => (
            { distance: boat.worldPosition.distance(attractor.worldPosition), attractor }
        )
    ).filter(
        ({attractor}) => attractor.worldPosition.y < boat.worldPosition.y
    ).filter(
        ({attractor}) => attractor.shape === boat.shape
    ).filter(
        ({distance, attractor}) => distance < attractor.range
    );

    if (relevant.length == 0) {
        return null;
    } else if (relevant.length == 1) {
        return relevant[0].attractor;
    }

    const sorted = attractors.sort(
        ({distance: distA}, {distance: distB}) => distA - distB
    ).map(
        ({attractor}) => attractor
    );

    return sorted[0];
}
