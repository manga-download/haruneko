import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-en',
        title: 'NineMangaEN'
    },
    container: {
        url: 'https://www.ninemanga.com/manga/Koakuma+Kyoushi+Psycho.html',
        id: '/manga/Koakuma+Kyoushi+Psycho.html',
        title: 'Koakuma Kyoushi Psycho',
    },
    child: {
        id: '/chapter/Koakuma%20Kyoushi%20Psycho/11885012.html',
        title: '8',
    },
    entry: {
        index: 0,
        size: 266_124,
        type: 'image/webp'
    }
}).AssertWebsite();