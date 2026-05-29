import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangalivre',
        title: 'ToonLivre'
    },
    container: {
        url: 'https://toonlivre.net/missoes-na-vida-real',
        id: JSON.stringify({ id: 'obra-f286b166', slug: 'missoes-na-vida-real' }),
        title: 'Missões na Vida Real'
    },
    child: {
        id: 'cap-047f0f0f-206',
        title: 'Capítulo 206'
    },
    entry: {
        index: 0,
        size: 523_032,
        type: 'image/webp'
    }
}).AssertWebsite();