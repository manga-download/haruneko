import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'viyafansub',
        title: 'Viya Fansub'
    },
    container: {
        url: 'https://viyafansub.com/manga/restart-wa-tadaima-no-ato-de/',
        id: JSON.stringify({ post: '677', slug: '/manga/restart-wa-tadaima-no-ato-de/' }),
        title: 'Restart wa Tadaima no Ato de'
    },
    child: {
        id: '/manga/restart-wa-tadaima-no-ato-de/5-bolum/',
        title: '5.Bölüm'
    },
    entry: {
        index: 0,
        size: 834_423,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());