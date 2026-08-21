import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nicomanga',
        title: 'NicoManga',
    },
    container: {
        url: 'https://nicomanga.com/manga140/073b43f5.html',
        id: '/manga140/073b43f5.html',
        title: 'To Be a Power in the Shadows!',
    },
    child: {
        id: '/manga140/073b43f5/chapter-c10.2i6837.html',
        title: 'Chapter 10.2',
    },
    entry: {
        index: 0,
        size: 265_875,
        type: 'image/jpeg',
    }
}).AssertWebsite();