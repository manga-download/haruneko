import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'darkscan',
        title: 'Dark Scan'
    },
    container: {
        url: 'https://dark-scan.com/manga/okashi-na-tensei/',
        id: JSON.stringify({ post: '256', slug: '/manga/okashi-na-tensei/' }),
        title: 'Okashi na tensei'
    },
    child: {
        id: '/manga/okashi-na-tensei/capitulo-51-2/',
        title: 'Capitulo 51.2'
    },
    entry: {
        index: 0,
        size: 1_145_527,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());