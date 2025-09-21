import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'titanmanga',
        title: 'Titan Manga'
    },
    container: {
        url: 'https://titanmanga.net/manga/hajime-no-ippo/',
        id: '/manga/hajime-no-ippo/',
        title: 'Hajime no Ippo'
    },
    child: {
        id: '/hajime-no-ippo-bolum-1482/',
        title: 'Bölüm 1482'
    },
    entry: {
        index: 1,
        size: 542_370,
        type: 'image/webp'
    }
}).AssertWebsite();