import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'arothscans',
        title: 'Aroth Scans'
    },
    container: {
        url: 'https://arothscans.com/manga/silah-ustasi/',
        id: '/manga/silah-ustasi/',
        title: 'Silah Ustası'
    },
    child: {
        id: '/silah-ustasi-bolum-27/',
        title: 'Bölüm 27'
    },
    entry: {
        index: 0,
        size: 181_012,
        type: 'image/jpeg'
    }
}).AssertWebsite();