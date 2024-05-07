import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'tukangkomik',
        title: 'TukangKomik'
    },
    container: {
        url: 'https://tukangkomik.id/manga/nano-m/',
        id: '/manga/nano-m/',
        title: 'Nano Machine',
        timeout: 10000
    },
    child: {
        id: '/nano-m-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 316_840,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());