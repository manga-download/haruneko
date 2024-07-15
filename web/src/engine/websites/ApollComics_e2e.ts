import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'apollcomics',
        title: 'Apoll Comics',
        timeout: 60_000
    },
    container: {
        url: 'https://apollcomics.es/manga/the-girls-nest/',
        id: JSON.stringify({ post: '1168', slug: '/manga/the-girls-nest/' }),
        title: 'The Girls Nest'
    },
    child: {
        id: '/manga/the-girls-nest/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 0,
        size: 172_565,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());