import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangacrab',
        title: 'Manga Crab'
    },
    container: {
        url: 'https://mangacrab.org/series/mi-sistema-es-muy-serio/',
        id: '/series/mi-sistema-es-muy-serio/',
        title: 'Mi Sistema Es Muy serio'
    },
    child: {
        id: '/series/mi-sistema-es-muy-serio/capitulo-19/',
        title: 'Capitulo 19'
    },
    entry: {
        index: 1,
        size: 769_088,
        type: 'image/jpeg'
    }
}).AssertWebsite();