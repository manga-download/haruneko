import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'turkmanga',
        title: 'TurkManga'
    },
    container: {
        url: 'https://turk-manga.com/manga/just-twilight',
        id: '/manga/just-twilight',
        title: 'Just Twilight'
    },
    child: {
        id: 'bolum-1',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 1_188_107,
        type: 'image/jpeg'
    }
}).AssertWebsite();