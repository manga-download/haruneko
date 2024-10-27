import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaruhu',
        title: 'MangaRuhu'
    },
    container: {
        url: 'https://mangaruhu.com/manga/hunter-academys-strongest-battle-god/',
        id: JSON.stringify({ post: '81', slug: '/manga/hunter-academys-strongest-battle-god/' }),
        title: `Avcı Akademisi'nin En Güçlü Savaş Tanrısı`
    },
    child: {
        id: '/manga/hunter-academys-strongest-battle-god/bolum-7/',
        title: 'Bölüm 7'
    },
    entry: {
        index: 0,
        size: 822_846,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();