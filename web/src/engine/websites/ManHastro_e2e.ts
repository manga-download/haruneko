import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhastro',
        title: 'ManHastro'
    }, /* Need Login for everything
    container: {
        url: 'https://manhastro.net/manga/47401',
        id: '47401',
        title: 'Yohan Loves Tite'
    },
    child: {
        id: '461708',
        title: 'Capitulo 1'
    },
    entry: {
        index: 2,
        size: 5_026,
        type: 'image/avif'
    }*/
}).AssertWebsite();