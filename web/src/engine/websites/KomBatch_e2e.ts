import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'kombatch',
        title: 'KomBatch'
    },
    container: {
        url: 'https://kombatch.cc/manga/a-turning-point/',
        id: '/manga/a-turning-point/',
        title: 'A Turning Point'
    },
    child: {
        id: '/a-turning-point-chapter-57/',
        title: 'Chapter 57',
    },
    entry: {
        index: 0,
        size: 133_399,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();