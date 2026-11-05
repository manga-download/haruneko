import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yukomik',
        title: 'Yukomik',
    },
    container: {
        url: 'https://v1.yukomik.com/manga/kuro-no-jiku/',
        id: '/manga/kuro-no-jiku/',
        title: 'Kuro no Jiku'
    },
    child: {
        id: '/manga/kuro-no-jiku/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 143_808,
        type: 'image/webp'
    }
}).AssertWebsite();