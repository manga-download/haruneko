import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'niverafansub',
        title: 'Nivera Fansub'
    },
    container: {
        url: 'https://niverafansub.org/manga/xian-chan-nu/',
        id: JSON.stringify({ post: '183', slug: '/manga/xian-chan-nu/' }),
        title: 'Xian Chan Nu'
    },
    child: {
        id: '/manga/xian-chan-nu/101-bolum/',
        title: '101. Bölüm'
    },
    entry: {
        index: 1,
        size: 1_536_881,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());