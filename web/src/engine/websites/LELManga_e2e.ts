import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lelmanga',
        title: 'LELManga'
    },
    container: {
        url: 'https://www.lelmanga.com/manga/jujutsu-kaisen',
        id: '/manga/jujutsu-kaisen',
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/jujutsu-kaisen-1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 0,
        size: 577_995,
        type: 'image/jpeg'
    }
}).AssertWebsite();