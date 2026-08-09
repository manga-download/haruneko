import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'vermangasporno',
        title: 'VerMangasPorno'
    },
    container: {
        url: 'https://vermangasporno.com/doujin/kusui-aruta-hayaoki-wa-oo-no-toku/',
        id: '/doujin/kusui-aruta-hayaoki-wa-oo-no-toku/',
        title: '[Kusui Aruta] Hayaoki wa OO no Toku'
    },
    child: {
        id: '/doujin/kusui-aruta-hayaoki-wa-oo-no-toku/',
        title: '[Kusui Aruta] Hayaoki wa OO no Toku'
    },
    entry: {
        index: 0,
        size: 285_875, //266_355
        type: 'image/jpeg'
    }
}).AssertWebsite();