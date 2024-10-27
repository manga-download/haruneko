import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'utoon',
        title: 'Utoon'
    },
    container: {
        url: 'https://utoon.net/manga/absolute-martial-arts/',
        id: JSON.stringify({ post: '3404', slug: '/manga/absolute-martial-arts/'}),
        title: 'Absolute Martial Arts',
    },
    child: {
        id: '/manga/absolute-martial-arts/chapter-142/',
        title: 'Chapter 142'
    },
    entry: {
        index: 0,
        size: 1_108_272,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();