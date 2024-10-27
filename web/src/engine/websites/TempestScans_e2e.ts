import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'tempestscans',
        title: 'Tempest Scans'
    },
    container: {
        url: 'https://tempestscans.net/manga/solo-leveling-ragnarok/',
        id: '/manga/solo-leveling-ragnarok/',
        title: 'Solo Leveling Ragnarok'
    },
    child: {
        id: '/solo-leveling-ragnarok-13/',
        title: 'Bölüm: 13',
    },
    entry: {
        index: 0,
        size: 1_288_033,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();