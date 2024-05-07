import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tritiniascans',
        title: 'Tritinia Scans'
    },
    container: {
        url: 'https://tritinia.org/manga/we-may-be-an-inexperienced-couple-but/',
        id: JSON.stringify({ post: '1958', slug: '/manga/we-may-be-an-inexperienced-couple-but/' }),
        title: 'We May Be an Inexperienced Couple but…'
    },
    child: {
        id: '/manga/we-may-be-an-inexperienced-couple-but/volume-14/vol-14-ch-108/',
        title: 'Vol. 14. Ch. 108'
    },
    entry: {
        index: 0,
        size: 455_563,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());