var macy = Macy({
    container: '#macy-container',
    trueOrder: true,
    waitForImages: false,
    useOwnImageLoader: true,
    margin: { x: 20, y: 0 },
    columns: 2,
    breakAt: {
        1200: 2,
        940: 2,
        520: 1,
        400: 1
    }
});