import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'anikiga',
        title: 'Anikiga'
    },
    container: {
        url: 'https://anikiga.com/manga/degausser/',
        id: JSON.stringify({ post: '2590', slug: '/manga/degausser/' }),
        title: 'Degausser'
    },
    child: {
        id: '/manga/degausser/1-cilt/bolum-1/',
        title: 'Bölüm 1 - Limandan Kalkış'
    },
    entry: {
        index: 0,
        size: 889_557,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());