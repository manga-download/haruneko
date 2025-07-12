import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangareadersite',
        title: 'MangaReaderSite',
    },
    container: {
        url: 'https://mangareader.site/manga/nukoduke',
        id: 'nukoduke',
        title: 'Nukoduke!'
    },
    child: {
        id: '1',
        title: 'Ch.1 - Chapter 1'
    },
    entry: {
        index: 1,
        size: 131_004,
        type: 'image/jpeg'
    }
}).AssertWebsite();