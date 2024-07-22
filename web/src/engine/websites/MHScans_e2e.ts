import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mhscans',
        title: 'MHScans'
    },
    container: {
        url: 'https://mh.twobluescans.com/series/de-un-simple-soldado-a-monarca/',
        id: JSON.stringify({ post: '2337', slug: '/series/de-un-simple-soldado-a-monarca/' }),
        title: `De un Simple Soldado a Monarca`
    },
    child: {
        id: '/series/de-un-simple-soldado-a-monarca/capitulo-133-5/',
        title: 'Capítulo 133.5'
    },
    entry: {
        index: 0,
        size: 613_048,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());