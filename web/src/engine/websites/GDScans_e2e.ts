import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gdscans',
        title: 'GD Scans'
    },
    container: {
        url: 'https://gdscans.com/manga/peerless/',
        id: JSON.stringify({ post: '692', slug: '/manga/peerless/' }),
        title: 'Peerless Reincarnated Demon Lord in Hero Academy'
    },
    child: {
        id: '/manga/peerless/volume-1/ch-1/',
        title: 'Ch.1 - Demon Lord, Reincarnates'
    },
    entry: {
        index: 0,
        size: 114_342,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());