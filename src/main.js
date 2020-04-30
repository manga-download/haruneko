const path = require('path');

/*
"node-remote": [
    "*://localhost/*",
    "https://manga-download.github.io/hakuneko/*"
],
"window": {
    "title": "HakuNeko",
    "icon": "img/logo.ico",
    "position": "center",
    "width": 1280,
    "height": 720
}
*/

const params = {
    title: 'HakuNeko',
    position: 'center',
    width: 1280,
    height: 720,
};

function getApplicationURL() {
    // from command line args (e.g. development)
    //return path.join('..', 'build.web', 'index.html');
    return 'http://localhost:5000';
    // for production
    //return 'https://hakuneko.app';
}

nw.Window.open(getApplicationURL(), params, win => {
    //win.showDevTools();
});