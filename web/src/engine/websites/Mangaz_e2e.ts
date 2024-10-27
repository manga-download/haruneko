import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangaz',
        title: 'Manga Library Z (マンガ図書館Z)'
    },
    container: {
        url: 'https://www.mangaz.com/series/detail/207781',
        id: '/series/detail/207781',
        title: '海底軍艦'
    },
    child: {
        id: 'https://vw.mangaz.com/virgo/view/207781/i:0',
        title: '1'
    },
    entry: {
        index: 7,
        size: 704_362,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();