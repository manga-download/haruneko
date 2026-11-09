import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicland',
        title: 'ComicLand',
    },
    container: {
        url: 'https://comicland.org/comic/a-turning-point',
        id: 'a-turning-point',
        title: 'A Turning Point'
    },
    child: {
        id: '1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 594_404,
        type: 'image/jpeg'
    }
}).AssertWebsite();