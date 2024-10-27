import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
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
        id: '/reader?cid=64f300af38575&sk=1',
        title: 'Volume 1 - Free Preview'
    },
    entry: {
        index: 0,
        size: 1_709_465,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();