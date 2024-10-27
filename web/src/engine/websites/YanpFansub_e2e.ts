import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yanpfansub',
        title: 'YanpFansub',
    },
    container: {
        url: 'https://trisalyanp.com/manga/dear-door/',
        id: JSON.stringify({ post: '2707', slug: '/manga/dear-door/' }),
        title: 'Dear Door'
    },
    child: {
        id: '/manga/dear-door/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 183_068,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();