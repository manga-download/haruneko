import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'piedpiperfb',
        title: 'Pied Piper'
    },
    container: {
        url: 'https://piedpiperfansub.me/manga/chainsaw-man/',
        id: JSON.stringify({ post: '28250', slug: '/manga/chainsaw-man/' }),
        title: 'Chainsaw Man'
    },
    child: {
        id: '/manga/chainsaw-man/1-bolum/',
        title: '1.Bölüm'
    },
    entry: {
        index: 1,
        size: 706_465,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());