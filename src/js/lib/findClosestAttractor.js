export default (boat, attractors) => {
    if (attractors.length == 0 ) {
        return null;
    }

    const relevant = attractors.map(
        (attractor) => (
            { distance: boat.body.center.distance(attractor), attractor }
        )
    ).filter(
        ({attractor}) => attractor.y < boat.y
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
