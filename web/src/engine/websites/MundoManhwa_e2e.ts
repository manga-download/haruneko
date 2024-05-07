import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mundomanhwa',
        title: 'Mundo Manhwa'
    },
    container: {
        url: 'https://mundomanhwa.com/manga/mi-casa-es-tu-casa/',
        id: JSON.stringify({ post: '2737', slug: '/manga/mi-casa-es-tu-casa/' }),
        title: 'Mi casa es tu casa'
    },
    child: {
        id: '/manga/mi-casa-es-tu-casa/capitulo-74/',
        title: 'Capitulo 74'
    },
    entry: {
        index: 0,
        size: 462_175,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());