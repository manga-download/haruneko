import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aniverse',
        title: 'Aniverse',
    },
    container: {
        url: 'https://aniverse.fr/manga/the-promised-neverland',
        id: 'the-promised-neverland',
        title: 'The Promised Neverland'
    },
    child: {
        id: 'c57d4d35-04a7-4a7f-ac2c-093662668a92',
        title: 'Chapitre 183'
    },
    entry: {
        index: 0,
        size: 239_931,
        type: 'image/jpeg'
    }
}).AssertWebsite();