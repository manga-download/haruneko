import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'heavenmanga2',
        title: 'HeavenManga'
    },
    container: {
        url: 'https://heavenmanga.com/manga/black-clover',
        id: '/manga/black-clover',
        title: 'Black Clover'
    },
    child: {
        id: '/manga/leer/122619',
        title: 'Chapter 333'
    },
    entry: {
        index: 0,
        size: 1_055_197,
        type: 'image/jpeg'
    }
}).AssertWebsite();