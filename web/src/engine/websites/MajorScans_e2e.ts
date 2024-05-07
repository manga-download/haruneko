import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'majorscans',
        title: 'Major Scans'
    },
    container: {
        url: 'https://www.majorscans.com/manga/the-reincarnation-of-the-forbidden-archmage/',
        id: '/manga/the-reincarnation-of-the-forbidden-archmage/',
        title: 'The Reincarnation of the Forbidden Archmage'
    },
    child: {
        id: '/the-reincarnation-of-the-forbidden-archmage-bolum-66/',
        title: 'Bölüm 66'
    },
    entry: {
        index: 1,
        size: 452_621,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());