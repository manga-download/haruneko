import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentairead',
        title: 'HentaiRead'
    },
    container: {
        url: 'https://hentairead.com/hentai/meccha-kimochi-yokattassho/',
        id: JSON.stringify({ post: '63295', slug: '/hentai/meccha-kimochi-yokattassho/' }),
        title: 'Meccha Kimochi Yokattassho?'
    },
    child: {
        id: '/hentai/meccha-kimochi-yokattassho/english/?style=list',
        title: 'English'
    },
    entry: {
        index: 0,
        size: 185_694,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());