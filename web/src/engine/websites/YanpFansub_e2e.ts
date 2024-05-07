import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yanpfansub',
        title: 'YanpFansub',
    },
    container: {
        url: 'https://yanpfansub.com/mangas/my-gentle-giant/',
        id: JSON.stringify({ post: '3784', slug: '/mangas/my-gentle-giant/' }),
        title: 'My gentle giant'
    },
    child: {
        id: '/mangas/my-gentle-giant/capitulo-1/',
        title: 'Capítulo 1 - o charme'
    },
    entry: {
        index: 0,
        size: 63_519,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());