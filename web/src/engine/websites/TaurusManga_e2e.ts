import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'taurusmanga',
        title: 'Taurus Manga',
    },
    container: {
        url: 'https://lectortaurus.com/manga/la-ascension-del-rey-demonio-elfo/',
        id: '/manga/la-ascension-del-rey-demonio-elfo/',
        title: 'La Ascensión del Rey Demonio Elfo',
    },
    child: {
        id: '/manga/la-ascension-del-rey-demonio-elfo/capitulo-8/',
        title: 'Capitulo 8',
    },
    entry: {
        index: 0,
        size: 337_269,
        type: 'image/jpeg',
    },
}).AssertWebsite();