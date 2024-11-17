import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hunterscan',
        title: 'Hunters Scan'
    },
    container: {
        url: 'https://hunterscomics.com/series/o-filho-mais-novo-do-mestre-espadachim/',
        id: JSON.stringify({ post: '9441', slug: '/series/o-filho-mais-novo-do-mestre-espadachim/' }),
        title: 'O Filho Mais Novo do Mestre Espadachim'
    },
    child: {
        id: '/series/o-filho-mais-novo-do-mestre-espadachim/capitulo-136/',
        title: 'Capítulo 136'
    },
    entry: {
        index: 0,
        size: 508_506,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();