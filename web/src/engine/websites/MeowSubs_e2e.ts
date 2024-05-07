import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'meowsubs',
        title: 'MeowSubs'
    },
    container: {
        url: 'https://meowsubs.com/manga/the-killer-lives-next-door/',
        id: JSON.stringify({ post: '1914', slug: '/manga/the-killer-lives-next-door/' }),
        title: 'The Killer Lives Next Door'
    },
    child: {
        id: '/manga/the-killer-lives-next-door/3-bolum/',
        title: '3. Bölüm'
    },
    entry: {
        index: 1,
        size: 3_647_478,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());