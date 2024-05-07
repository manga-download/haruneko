import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'stickhorse',
        title: 'Stick Horse'
    },
    container: {
        url: 'https://www.stickhorse.cl/manga/space-juggernaut/',
        id: JSON.stringify({ post: '2158', slug: '/manga/space-juggernaut/' }),
        title: 'Space Juggernaut'
    },
    child: {
        id: '/manga/space-juggernaut/1/1/',
        title: '1 - Amaranthine I'
    },
    entry: {
        index: 0,
        size: 541_992,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());