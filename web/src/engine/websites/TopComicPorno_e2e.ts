import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'topcomicporno',
        title: 'Top Comic Porno'
    },
    container: {
        url: 'https://topcomicporno.com/manga/netorare-manga-no-kuzu-otoko-ni-tensei-shita-hazu-ga-heroine-ga-yottekuru-ken/',
        id: JSON.stringify({ post: '13977', slug: '/manga/netorare-manga-no-kuzu-otoko-ni-tensei-shita-hazu-ga-heroine-ga-yottekuru-ken/' }),
        title: 'Netorare Manga no Kuzu Otoko ni Tensei shita Hazu ga Heroine ga Yottekuru Ken'
    },
    child: {
        id: '/manga/netorare-manga-no-kuzu-otoko-ni-tensei-shita-hazu-ga-heroine-ga-yottekuru-ken/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 3,
        size: 319_468,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());