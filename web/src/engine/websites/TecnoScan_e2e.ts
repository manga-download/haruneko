import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tecnoscan',
        title: 'Tecno Scan'
    },
    container: {
        url: 'https://eroxscans.xyz/manga/absolute-sword-sense/',
        id: '/manga/absolute-sword-sense/',
        title: 'Absolute Sword Sense'
    },
    child: {
        id: '/absolute-sword-sense-chapter-105-4/',
        title: 'Chapter 105.4'
    },
    entry: {
        index: 0,
        size: 1_240_942,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();