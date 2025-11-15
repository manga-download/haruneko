import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'noxscans',
        title: 'Nox Scans'
    },
    container: {
        url: 'https://www.noxscans.com/manga/dukun-suikastci-oglu/',
        id: '/manga/dukun-suikastci-oglu/',
        title: 'Dükün Suikastçı Oğlu'
    },
    child: {
        id: '/dukun-suikastci-oglu-bolum-40/',
        title: 'Bölüm 40'
    },
    entry: {
        index: 1,
        size: 381_002,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();