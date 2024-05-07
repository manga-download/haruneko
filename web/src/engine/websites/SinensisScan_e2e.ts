import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sinensisscan',
        title: 'Sinensis Scans',
        timeout: 35000, //warning : WEBSITE IS SLOW IN BROWSER
    },
    container: {
        url: 'https://sinensisscan.net/manga/9436/',
        id: JSON.stringify({ post: '9436', slug: '/manga/9436/' }),
        title: 'A vida de um passarinho',
    },
    child: {
        id: '/manga/9436/cap-01/',
        title: 'Cap. 01',
        timeout: 15000

    },
    entry: {
        index: 0,
        size: 514_538,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());