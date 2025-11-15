import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nitromanga',
        title: 'Nitro Manga'
    },
    container: {
        url: 'https://nitroscans.net/series/the-all-knowing-cultivator/',
        id: JSON.stringify({ post: '9062', slug: '/series/the-all-knowing-cultivator/' }),
        title: 'The All-Knowing Cultivator'
    },
    child: {
        id: '/series/the-all-knowing-cultivator/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 286_264,
        type: 'image/jpeg'
    }
}).AssertWebsite();