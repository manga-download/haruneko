import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nemesisscans',
        title: 'Nemesis Scans'
    },
    container: {
        url: 'https://www.nemesisscans.com/series/53/the-apothecary-diaries',
        id: '/series/53/the-apothecary-diaries',
        title: 'The Apothecary Diaries',
        timeout: 10_000
    },
    child: {
        id: '/series/53/episode/81.2',
        title: 'Bölüm 81.2'
    },
    entry: {
        index: 0,
        size: 362_694,
        type: 'image/avif'
    }
}).AssertWebsite();