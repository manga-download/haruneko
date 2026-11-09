import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'loverstoon',
        title: 'Lovers Toon',
    },
    container: {
        url: 'https://loverstoon.net/#/comic/a-vida-de-um-passarinho',
        id: 'a-vida-de-um-passarinho',
        title: 'A Vida de Um Passarinho',
    },
    child: {
        id: '1775415666027656',
        title: 'Capítulo 1',
    },
    entry: {
        index: 0,
        size: 798_366,
        type: 'image/jpeg'
    }
}).AssertWebsite();