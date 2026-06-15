import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-fr',
        title: 'NineMangaFR'
    },
    container: {
        url: 'https://fr.niadd.com/manga/Lycoris_Recoil.html',
        id: '/manga/Lycoris_Recoil.html',
        title: 'Lycoris Recoil',
    },
    child: {
        id: '/chapter/Lycoris_Recoil_4/722483/',
        title: '4',
    },
    entry: {
        index: 1,
        size: 108_568,
        type: 'image/webp'
    }
}).AssertWebsite();