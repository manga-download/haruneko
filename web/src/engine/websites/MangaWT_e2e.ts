import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangawt',
        title: 'MangaWT'
    },
    container: {
        url: 'https://mangawt.com/manga/bir-dagda-baslamak',
        id: '69c09a4127377f7079b75ead',
        title: 'Bir Dağda Başlamak'
    },
    child: {
        id: '0',
        title: 'Bölüm 0',
    },
    entry: {
        index: 1,
        size: 530_593,
        type: 'image/jpeg'
    }
}).AssertWebsite();