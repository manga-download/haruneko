import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'komikid',
        title: 'Komikid'
    },
    container: {
        url: 'https://www.komikid.com/manga/one-punchman',
        id: '/manga/one-punchman',
        title: 'One Punch-Man'
    },
    child: {
        id: '/manga/one-punchman/182',
        title: '182'
    },
    entry: {
        index: 0,
        size: 458_299,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());