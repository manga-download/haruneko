import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'orimanga',
        title: 'OriManga'
    },
    container: {
        url: 'https://orimanga.net/manga/the-extras-academy-survival-guide/',
        id: '/manga/the-extras-academy-survival-guide/',
        title: 'The Extra’s Academy Survival Guide'
    },
    child: {
        id: '/manga/the-extras-academy-survival-guide/bolum-117/',
        title: 'Bölüm 117',
    },
    entry: {
        index: 7,
        size: 953_906,
        type: 'image/webp'
    }
}).AssertWebsite();