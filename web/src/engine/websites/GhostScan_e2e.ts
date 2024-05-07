import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ghostscan',
        title: 'Ghost Scan'
    },
    container: {
        url: 'https://ghostscan.com.br/manga/concubina/',
        id: JSON.stringify({ post: '1011', slug: '/manga/concubina/' }),
        title: 'O Convite da Concubina'
    },
    child: {
        id: '/manga/concubina/cap-3/',
        title: 'Cap 3'
    },
    entry: {
        index: 1,
        size: 596_272,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());