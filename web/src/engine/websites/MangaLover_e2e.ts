import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangalover',
        title: '3asq (مانجا العاشق)'
    },
    container: {
        url: 'https://3asq.org/manga/shinobi-goto/',
        id: JSON.stringify({ post: '18972', slug: '/manga/shinobi-goto/' }),
        title: 'Shinobi Goto'
    },
    child: {
        id: '/manga/shinobi-goto/34/',
        title: '34 - كُن متأهِّبًا'
    },
    entry: {
        index: 1,
        size: 2_391_553,
        type: 'image/jpeg'
    }
}).AssertWebsite();