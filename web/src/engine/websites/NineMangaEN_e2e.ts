import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-en',
        title: 'NineMangaEN'
    },
    container: {
        url: 'https://www.niadd.com/manga/Koakuma_Kyoushi_Psycho.html',
        id: '/manga/Koakuma_Kyoushi_Psycho.html',
        title: 'Koakuma Kyoushi Psycho',
    },
    child: {
        id: '/chapter/Koakuma_Kyoushi_Psycho_8/11885012/',
        title: '8',
    },
    entry: {
        index: 0,
        size: 266_124,
        type: 'image/webp'
    }
}).AssertWebsite();