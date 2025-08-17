import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aquamanga',
        title: 'AquaManga'
    },
    container: {
        url: 'https://aquareader.net/manga/only-for-love/',
        id: JSON.stringify({ post: '3016', slug: '/manga/only-for-love/' }),
        title: 'Only for Love'
    },
    child: {
        id: '/manga/only-for-love/only-for-love/ch-53-chapter-53/',
        title: 'Ch. 53 - Chapter 53'
    },
    entry: {
        index: 0,
        size: 484_245,
        type: 'image/jpeg'
    }
}).AssertWebsite();