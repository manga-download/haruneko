const config = require('./package.json');

const params = {
    title: config.title,
    position: 'center',
    width: 1280,
    height: 720,
};

nw.Window.open(config.url, params, win => {
    //win.showDevTools();
});