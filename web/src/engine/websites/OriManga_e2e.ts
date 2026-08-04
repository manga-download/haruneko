import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'orimanga',
        title: 'OriManga'
    },
    container: {
        url: 'https://orimanga.net/manga/akademide-hayatta-kalma-yollari/',
        id: '/manga/akademide-hayatta-kalma-yollari/',
        title: 'The Extra’s Academy Survival Guide'
    },
    child: {
        id: '/manga/akademide-hayatta-kalma-yollari/bolum-117/',
        title: 'Bölüm 117',
    },
    entry: {
        index: 7,
        size: 953_906,
        type: 'image/webp'
    }
}).AssertWebsite();