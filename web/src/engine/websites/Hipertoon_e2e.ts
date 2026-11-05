import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hipertoon',
        title: 'Hipertoon'
    },
    container: {
        url: 'https://hipertoon.com/manga/martial-master-asumi',
        id: '19/martial-master-asumi',
        title: 'Asumi Kakeru'
    },
    child: {
        id: '32.5',
        title: '32.5'
    },
    entry: {
        index: 2,
        size: 227_102,
        type: 'image/webp'
    }
}).AssertWebsite();
