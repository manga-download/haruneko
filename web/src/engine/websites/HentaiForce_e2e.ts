import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentaiforce',
        title: 'HentaiForce'
    },
    container: {
        url: 'https://hentaiforce.net/view/78436',
        id: '/view/78436',
        title: '(C94) [Jikansa-Kougeki (Tooya Daisuke)] Shishou to H Shimakuru Hon (Fate/Grand Order) [English] [SDTLs]'
    },
    child: {
        id: '/view/78436',
        title: '(C94) [Jikansa-Kougeki (Tooya Daisuke)] Shishou to H Shimakuru Hon (Fate/Grand Order) [English] [SDTLs]'
    },
    entry: {
        index: 0,
        size: 325_022,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());