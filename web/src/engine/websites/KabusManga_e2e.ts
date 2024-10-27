import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'kabusmanga',
        title: 'Kabus Manga'
    },
    container: {
        url: 'https://kabusmanga.com/manga/tono-no-kanri-o-shite-miyou/',
        id: JSON.stringify({ post: '1990', slug: '/manga/tono-no-kanri-o-shite-miyou/'}),
        title: 'Tono no Kanri o Shite Miyou'
    },
    child: {
        id: '/manga/tono-no-kanri-o-shite-miyou/bolum-40/',
        title: 'Bölüm 40'
    },
    entry: {
        index: 1,
        size: 688_856,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();