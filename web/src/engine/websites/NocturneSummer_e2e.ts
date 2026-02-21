import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nocturnesummer',
        title: 'Nocturne Summer'
    },
    container: {
        url: 'https://nocfsb.com/manga/ellie-and-victoria-bitten-by-magic/',
        id: JSON.stringify({ post: '4069', slug: '/manga/ellie-and-victoria-bitten-by-magic/' }),
        title: 'Ellie and Victoria - Bitten By Magic'
    },
    child: {
        id: '/manga/ellie-and-victoria-bitten-by-magic/capitulo-17/',
        title: 'Capitulo 17'
    },
    entry: {
        index: 1,
        size: 161_769,
        type: 'image/jpeg'
    }
}).AssertWebsite();