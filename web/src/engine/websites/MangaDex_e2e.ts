import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadex',
        title: 'MangaDex'
    },
    container: {
        url: 'https://mangadex.org/title/3878b229-f6c2-4ce5-b169-483f2568d7ec/oko-sama-box',
        id: '3878b229-f6c2-4ce5-b169-483f2568d7ec',
        title: 'Oko-sama Box'
    },
    child: {
        id: '5871af5e-4cb2-4dc1-ae7e-89124823a031',
        title: 'Vol.01 Ch.0005.5 - Extra (en) [Madam el LePoo Scanlations]'
    },
    entry: {
        index: 0,
        size: 877_439,
        type: 'image/png'
    }
}).AssertWebsite();