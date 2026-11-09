import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangacrab',
        title: 'Manga Crab'
    },
    container: {
        url: 'https://es.mangacrab.org/series/mi-sistema-es-muy-serio/',
        id: '30840',
        title: 'Mi Sistema Es Muy serio'
    },
    child: {
        id: '25',
        title: 'Capitulo 19'
    },
    entry: {
        index: 1,
        size: 769_088,
        type: 'image/jpeg'
    }
}).AssertWebsite();