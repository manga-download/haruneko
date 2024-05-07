import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'shootingstarscans',
        title: 'Shooting Star Scans'
    },
    container: {
        url: 'https://shootingstarscans.com/manga/aisha/',
        id: JSON.stringify({ post: '1845', slug: '/manga/aisha/'}),
        title: 'Aisha'
    },
    child: {
        id: '/manga/aisha/chapter-0/',
        title: 'chapter 0'
    },
    entry: {
        index: 0,
        size: 203_964,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());