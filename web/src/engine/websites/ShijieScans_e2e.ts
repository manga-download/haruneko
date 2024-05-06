import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'shijiescans',
        title: 'Shijie Scans'
    },
    container: {
        url: 'https://shijiescans.com/manga/gel-beni-al/',
        id: '/manga/gel-beni-al/',
        title: 'Gel Beni Al!'
    },
    child: {
        id: '/gel-beni-al-bolum-80/',
        title: 'Bölüm 80'
    },
    entry: {
        index: 0,
        size: 426_608,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());