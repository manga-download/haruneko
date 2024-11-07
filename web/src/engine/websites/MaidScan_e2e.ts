import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'maidscan',
        title: 'Maid Scan'
    },
    container: {
        url: 'https://empreguetes.site/manga/deus-tigre-de-jangsan/',
        id: JSON.stringify({ post: '1243', slug: '/manga/deus-tigre-de-jangsan/'}),
        title: 'Deus tigre de Jangsan'
    },
    child: {
        id: '/manga/deus-tigre-de-jangsan/capitulo-37/',
        title: 'Capítulo 37'
    },
    entry: {
        index: 0,
        size: 507_912,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();