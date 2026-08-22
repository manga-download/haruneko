import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhatic',
        title: 'HentaiLek'
    },
    container: {
        url: 'https://hentailek.com/manga/a-pervert-s-daily-life',
        id: '/manga/a-pervert-s-daily-life',
        title: `A Pervert's Daily Life`,
    },
    child: {
        id: '/manga/a-pervert-s-daily-life/chapter-145',
        title: decodeURI('%D8%A7%D9%84%D9%81%D8%B5%D9%84%20145')
    },
    entry: {
        index: 1,
        size: 264_010,
        type: 'image/webp'
    }
}).AssertWebsite();