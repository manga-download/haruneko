import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhuaplus',
        title: 'ManhuaPlus',
    },
    container: {
        url: 'https://manhuaplus.org/manga/martial-peak01',
        id: '/manga/martial-peak01',
        title: 'Martial Peak',
    },
    child: {
        id: '/manga/martial-peak01/chapter-500',
        title: 'Chapter 500',
    },
    entry: {
        index: 0,
        size: 183_750,
        type: 'image/jpeg',
    }
}).AssertWebsite();