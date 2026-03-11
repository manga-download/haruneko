import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'retsu',
        title: 'Retsu'
    },
    container: {
        url: 'https://retsu.org/manga/ano-hi-chikyuu-ni-dungeon-ga-shutsugen-shita/',
        id: JSON.stringify({ post: '10938', slug: '/manga/ano-hi-chikyuu-ni-dungeon-ga-shutsugen-shita/'}),
        title: 'Ano Hi Chikyuu ni Dungeon ga Shutsugen Shita'
    },
    child: {
        id: '/manga/ano-hi-chikyuu-ni-dungeon-ga-shutsugen-shita/chapter-2-2/',
        title: 'Chapter 2.2'
    },
    entry: {
        index: 1,
        size: 291_864,
        type: 'image/jpeg'
    }
}).AssertWebsite();