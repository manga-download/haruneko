import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'merlinscans',
        title: 'Merlin Scans'
    },
    container: {
        url: 'https://merlinscans.com/manga/akademinin-dehasi/',
        id: '/manga/akademinin-dehasi/',
        title: 'Akademinin Dehası'
    },
    child: {
        id: '/akademinin-dehasi-bolum-65/',
        title: 'Bölüm 65'
    },
    entry: {
        index: 1,
        size: 553_600,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();