import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'brainrotcomics',
        title: 'BrainRotComics'
    },
    container: {
        url: 'https://brainrotcomics.com/manga/dust-2/',
        id: JSON.stringify({ post: '254', slug: '/manga/dust-2/' }),
        title: 'Dust'
    },
    child: {
        id: '/manga/dust-2/chapter-10/',
        title: 'Chapter 10'
    },
    entry: {
        index: 0,
        size: 1_800_603,
        type: 'image/jpeg'
    }
}).AssertWebsite();