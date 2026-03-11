import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'atsumaru',
        title: 'Atsumaru'
    },
    container: {
        url: 'https://atsu.moe/manga/XLD5S',
        id: 'XLD5S',
        title: '+Anima'
    },
    child: {
        id: 'CKjlYQaj',
        title: 'Chapter 44'
    },
    entry: {
        index: 0,
        size: 179_770,
        type: 'image/webp'
    }
}).AssertWebsite();