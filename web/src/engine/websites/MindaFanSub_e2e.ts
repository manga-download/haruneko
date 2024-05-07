import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mindafansub',
        title: 'Minda Fansub'
    },
    container: {
        url: 'https://mindafansub.online/manga/painter-of-the-night/',
        id: JSON.stringify({ post: '1873', slug: '/manga/painter-of-the-night/'}),
        title: 'Painter of the Night'
    },
    child: {
        id: '/manga/painter-of-the-night/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 483_927,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());