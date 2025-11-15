import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaowlio',
        title: 'MangaOwl.io'
    },
    container: {
        url: 'https://mangaowl.io/read-1/the-newbie-is-too-strong/',
        id: JSON.stringify({ post: '9493', slug: '/read-1/the-newbie-is-too-strong/' }),
        title: 'The Newbie is Too Strong'
    },
    child: {
        id: '/read-1/the-newbie-is-too-strong/chapter-120/',
        title: 'Chapter 120'
    },
    entry: {
        index: 0,
        size: 1_711_912,
        type: 'image/jpeg'
    }
}).AssertWebsite();