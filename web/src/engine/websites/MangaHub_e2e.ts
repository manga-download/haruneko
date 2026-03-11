import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangahub',
        title: 'MangaHub',
    },
    container: {
        url: 'https://mangahub.io/manga/martial-peak',
        id: 'martial-peak',
        title: 'Martial Peak',
    },
    child: {
        id: '1',
        title: 'Ch.1',
    },
    entry: {
        index: 0,
        size: 229_847,
        type: 'image/jpeg',
    }
}).AssertWebsite();