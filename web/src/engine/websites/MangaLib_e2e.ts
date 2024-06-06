import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangalib',
        title: 'MangaLib'
    },
    container: {
        url: 'https://mangalib.org/toukyou-revengers',
        id: '/toukyou-revengers',
        title: 'Токийские мстители'
    },
    child: {
        id: '/toukyou-revengers/v1/c1',
        title: '1 - Reborn'
    },
    entry: {
        index: 1,
        size: 100_108,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());