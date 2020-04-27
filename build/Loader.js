import HakuNeko from './engine/HakuNeko.js';
import Demo from './playground/Demo.js';
const frontend = {
    hook: '#hakuneko',
    path: ['.', 'frontend', 'classic', 'Initialize.js']
};
async function LoadFrontend() {
    try {
        // dynamically load and initialize the frontend (from settings)
        frontend.path[2] = 'playground';
        (await import(frontend.path.join('/'))).default(frontend.hook);
    }
    catch (error) {
        console.error('Failed to load frontend!', error);
    }
}
//const gui = require('nw.gui');
//gui.Window.get().
window.HakuNeko = new HakuNeko();
window.Demo = Demo;
nw.Window.get().showDevTools();
document.addEventListener('DOMContentLoaded', LoadFrontend);
//# sourceMappingURL=Loader.js.map