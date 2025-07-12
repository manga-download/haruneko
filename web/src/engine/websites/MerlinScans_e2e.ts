import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'merlinscans',
        title: 'Merlin Scans'
    },
    container: {
        url: 'https://merlinscans.com/series/akademinin-dehasi',
        id: '/series/akademinin-dehasi',
        title: 'Akademinin Dehası'
    },
    child: {
        id: '/series/akademinin-dehasi/chapter-65.00',
        title: '65. Bölüm'
    },
    entry: {
        index: 2,
        size: 553_600,
        type: 'image/webp'
    }
}).AssertWebsite();