import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ikiru',
        title: 'Ikiru'
    },
    container: {
        url: 'https://09.ikiru.wtf/manga/martial-peak/',
        id: 'martial-peak',
        title: 'Martial Peak'
    },
    child: {
        id: '1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 131_040,
        type: 'image/webp'
    }
}).AssertWebsite();