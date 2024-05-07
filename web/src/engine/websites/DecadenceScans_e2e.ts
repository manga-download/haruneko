import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'decadencescans',
        title: 'Decadence'
    },
    container: {
        url: 'https://reader.decadencescans.com/manga/switch-girl/',
        id: JSON.stringify({ post: '1748', slug: '/manga/switch-girl/' }),
        title: 'Switch Girl'
    },
    child: {
        id: '/manga/switch-girl/volume-1/chapter-1-kyonpyon/',
        title: 'Chapter 1 - kyonpyon'
    },
    entry: {
        index: 0,
        size: 235_881,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());