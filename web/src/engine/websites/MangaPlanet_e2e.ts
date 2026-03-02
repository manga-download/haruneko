import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaplanet',
        title: 'MangaPlanet'
    },
    container: {
        url: 'https://mangaplanet.com/comic/64eeceb86e1e3',
        id: '/comic/64eeceb86e1e3',
        title: 'Concerned About My Virginity: I Wanna Give It to My Boss!',
    },
    child: {
        id: '/reader?cid=64f300af38575',
        title: 'Volume 1 - Preview'
    },
    entry: {
        index: 0,
        size: 1_800_292,
        type: 'image/png'
    }
}).AssertWebsite();