import { IHakuNeko, HakuNeko } from './engine/HakuNeko';
import { IFrontendController, FrontendController } from './frontend/FrontendController';

declare global {
    interface Window {
        HakuNeko: IHakuNeko;
        Frontend: IFrontendController;
    }
    const nw: any
}

//const gui = require('nw.gui');
//gui.Window.get().
nw.Window.get().showDevTools();

window.HakuNeko = new HakuNeko();
window.Frontend = new FrontendController();

// +++ PLAYGROUND +++

setTimeout(async () => {
    let uri = new URL('https://postman-echo.com/get');
    let request = new Request(uri.href, {
        method: 'GET',
        referrer: 'https://hakuneko.download',
        headers: {
            'user-agent': 'Mozilla/5.0 (HakuNeko; Intel Mac OS X 10.15.3)',
            'referer': 'https://hakuneko.download',
            'origin': 'hakuneko.download',
            'cookie': 'adult=1',
            //'X-Foo': 'bar',
            'x-foo': 'bar'
        }
    });
    let data = await window.HakuNeko.RequestProvider.FetchJSON(request);
    console.log('FetchJSON:', data);
}, 1000);