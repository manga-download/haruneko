import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'zenithscans',
        title: 'Zenith Scans'
    },
    container: {
        url: 'https://zenithscans.com/manga/rastgele-sohbetten-gelen-kiz/',
        id: '/manga/rastgele-sohbetten-gelen-kiz/',
        title: 'Rastgele Sohbetten Gelen Kız'
    },
    child: {
        id: '/rastgele-sohbetten-gelen-kiz-bolum-184/',
        title: 'Bölüm 184'
    },
    entry: {
        index: 1,
        size: 2_647_842,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());