import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangabuff',
        title: 'MangaBuff',
    },
    container: {
        url: 'https://mangabuff.ru/manga/slezy-na-uvyadshih-cvetah',
        id: '/manga/slezy-na-uvyadshih-cvetah',
        title: 'Слезы на увядших цветах'
    },
    child: {
        id: '/manga/slezy-na-uvyadshih-cvetah/1/68',
        title: '68'
    },
    entry: {
        index: 2,
        size: 407_133,
        type: 'image/jpeg'
    }
}).AssertWebsite();