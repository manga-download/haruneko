import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'voidscans',
        title: 'Hive Scans'
    },
    container: {
        url: 'https://hivetoon.com/series/99-reinforced-wooden-stick',
        id: JSON.stringify({ slug: '99-reinforced-wooden-stick', id: '119' }),
        title: '+99 Reinforced Wooden Stick'
    },
    child: {
        id: '/series/99-reinforced-wooden-stick/chapter-1',
        title: '1'
    },
    entry: {
        index: 1,
        size: 608_634,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();