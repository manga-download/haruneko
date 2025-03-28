import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tempestscans',
        title: 'Tempest Scans'
    },
    container: {
        url: 'https://tempestmangas.com/manga/solo-leveling-ragnarok/',
        id: '/manga/solo-leveling-ragnarok/',
        title: 'Solo Leveling: Ragnarok'
    },
    child: {
        id: '/solo-leveling-ragnarok-13/',
        title: 'Bölüm 13',
    },
    entry: {
        index: 0,
        size: 759_969,
        type: 'image/avif'
    }
}).AssertWebsite();